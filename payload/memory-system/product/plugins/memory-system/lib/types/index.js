/** Native Host half of DSH's global two-document memory system. */
import { SessionId } from '@deepseek-ai/dsh-session';
import z from '@deepseek-ai/schemastery';
import { resolveDshHome } from '@deepseek-ai/dsh-home-paths';
import { MEMORY_API_ROUTE, memoryApiHandler } from "./api.js";
import { memoryContextFor, redactSensitiveText } from "./domain.js";
import { maintainMemoryDocument } from "./maintenance.js";
import { generateMemoryWithLlm, PLUGIN_AI_ROUTE } from "./model.js";
import { IdleMemoryScheduler } from "./scheduler.js";
import { MemoryDocumentStore } from "./store.js";
import { injectMemoryContext } from "./recall.js";
export { MEMORY_API_ROUTE } from "./api.js";
export { MemoryDocumentStore } from "./store.js";
export const name = 'memory-system';
export const inject = ['webServer', 'llm', 'sessionQuery', 'agents'];
/** Runtime schema for {@link Config}. */
export const Config = z.object({
    idleDelayMs: z.number().min(60_000).max(3_600_000).default(300_000),
});
function directText(messages) {
    return messages
        .filter(message => message.source.kind === 'user')
        .flatMap(message => message.content)
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('\n')
        .trim();
}
class NativeMemoryService {
    ctx;
    store;
    scheduler;
    constructor(ctx, store, scheduler) {
        this.ctx = ctx;
        this.store = store;
        this.scheduler = scheduler;
    }
    async documents() {
        const [user, ai, state] = await Promise.all([
            this.store.read('user'), this.store.read('ai'), this.store.readState(),
        ]);
        return { user, ai, state };
    }
    write(kind, content, revision) {
        return this.store.write(kind, content, revision, 'user-edit');
    }
    restore(kind, revision) {
        return this.store.restorePrevious(kind, revision);
    }
    maintain() {
        return this.scheduler.organizeNow();
    }
    async remember(source, signal) {
        const agent = this.ctx.agents.get(SessionId(source.sessionId));
        if (agent === undefined)
            throw new Error('the source conversation is not currently available');
        const route = PLUGIN_AI_ROUTE;
        const safeSource = {
            ...source,
            selectedText: redactSensitiveText(source.selectedText),
            context: redactSensitiveText(source.context),
        };
        const result = await maintainMemoryDocument({
            store: this.store,
            kind: 'user',
            source: safeSource,
            route,
            sessionId: agent.id,
            ...signal === undefined ? {} : { signal },
            generate: args => generateMemoryWithLlm(this.ctx, args.request, {
                ...args.sessionId === undefined ? {} : { sessionId: args.sessionId },
                ...args.signal === undefined ? {} : { signal: args.signal },
            }),
        });
        const state = await this.store.readState();
        await this.store.writeState({
            ...state,
            lastProvider: route.provider,
            lastModel: route.model,
        });
        return result;
    }
}
/** Mount API, quiet-period upkeep, route capture, and relevance-gated pre-step recall. */
export function apply(ctx, config) {
    const store = new MemoryDocumentStore(resolveDshHome());
    const scheduler = new IdleMemoryScheduler(ctx, store, { idleDelayMs: config.idleDelayMs });
    const service = new NativeMemoryService(ctx, store, scheduler);
    ctx.effect(() => ctx.webServer.register({
        kind: 'prefix',
        path: MEMORY_API_ROUTE,
        handler: (req, res) => { void memoryApiHandler(req, res, service); },
    }), 'memory-system: loopback document and selection API');
    ctx.effect(() => scheduler.listen(), 'memory-system: session activity quiets the upkeep timer');
    ctx.effect(() => scheduler.start(), 'memory-system: startup backfill and quiet-period ai-memory upkeep');
    ctx.on('agent/pre-step', async ({ agent, messages, step, signal }, next) => {
        const decision = await next();
        if (decision.kind === 'reject' || signal.aborted || step !== 1)
            return decision;
        const query = directText(messages);
        if (query === '')
            return decision;
        const [user, ai] = await Promise.all([store.read('user'), store.read('ai')]);
        if (signal.aborted)
            return decision;
        const memory = memoryContextFor({
            query,
            ...agent.session.header.cwd === undefined ? {} : { cwd: agent.session.header.cwd },
            userDocument: user.content,
            aiDocument: ai.content,
        });
        if (memory === undefined)
            return decision;
        return {
            kind: 'enter',
            messages: injectMemoryContext(decision.messages, memory),
        };
    }, { prepend: true });
}
//# sourceMappingURL=index.js.map
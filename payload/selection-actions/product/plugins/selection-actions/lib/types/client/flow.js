/** Native same-workspace conversation creation and unsent quote insertion. */
import { createSelectionReference } from "./reference.js";
const QUOTE_HANDOFF_PREFIX = 'dsh.selection-quote.';
function handoffKey(sessionId) {
    return `${QUOTE_HANDOFF_PREFIX}${sessionId}`;
}
function writeQuote(input, packet) {
    const reference = createSelectionReference(packet);
    const before = input.state.getSnapshot();
    const start = before.draft.length;
    if (!input.insertReference(reference, {
        start,
        end: start,
        draftRev: before.draftRev,
    })) {
        return undefined;
    }
    const previousIds = new Set(before.occurrences.map(occurrence => occurrence.occurrenceId));
    const occurrence = input.state.getSnapshot().occurrences.find(candidate => (candidate.source === reference.source && !previousIds.has(candidate.occurrenceId)));
    if (occurrence === undefined) {
        return undefined;
    }
    return {
        packet,
        occurrenceId: occurrence.occurrenceId,
        getSnapshot: () => input.state.getSnapshot().occurrences
            .some(candidate => candidate.occurrenceId === occurrence.occurrenceId),
        subscribe: listener => input.state.subscribe(listener),
    };
}
/** Append an unsent selected-text annotation to the current conversation. */
export function addSelectionQuote(ctx, packet) {
    const sessionId = ctx.uiSession.adapter.current.getSnapshot().key;
    if (sessionId === undefined)
        throw new Error('there is no active conversation');
    const binding = ctx.sessions.binding(sessionId);
    if (binding === undefined)
        throw new Error('the active conversation is not ready');
    const active = writeQuote(ctx.conversation.input.for(binding.ctx), packet);
    if (active === undefined)
        throw new Error('the quote could not be inserted into the conversation');
    return active;
}
/** One-shot same-origin transfer from the primary runtime to an embedded pane runtime. */
export function consumeSelectionQuoteHandoff(ctx, sessionId, storage = localStorage) {
    const key = handoffKey(sessionId);
    const raw = storage.getItem(key);
    if (raw === null)
        return false;
    let handoff;
    try {
        handoff = JSON.parse(raw);
    }
    catch {
        storage.removeItem(key);
        return false;
    }
    if (handoff.version !== 1 || typeof handoff.packet?.selectedText !== 'string') {
        storage.removeItem(key);
        return false;
    }
    const binding = ctx.sessions.binding(sessionId);
    if (binding === undefined)
        return false;
    if (writeQuote(ctx.conversation.input.for(binding.ctx), handoff.packet) === undefined)
        return false;
    storage.removeItem(key);
    return true;
}
/** Create/reuse the workspace's blank conversation, seed one chip, and reveal it beside the source. */
export async function openSelectionQuote(ctx, packet, auxiliaryPane) {
    const workspaceState = ctx.workspaces.list.getSnapshot();
    const workspace = workspaceState.items
        .find(item => item.sessionIds.includes(packet.sessionId));
    if (workspace === undefined)
        throw new Error('the selected conversation is not attached to a project');
    const sessionState = ctx.sessions.list.getSnapshot();
    const reusable = workspace.sessionIds.find((id) => {
        const summary = sessionState.byId[id];
        return summary?.blank === true && summary.cwd === workspace.path
            && !workspaceState.archivedSessionIds.includes(id);
    });
    if (!await auxiliaryPane.canOpenSession(reusable))
        return { pane: 'limit' };
    const sessionId = await ctx.uiWorkspace.connectWorkspace(workspace.workspaceId);
    const pane = await auxiliaryPane.openSession(sessionId);
    if (pane === 'limit')
        return { pane };
    const handoff = { version: 1, packet };
    localStorage.setItem(handoffKey(sessionId), JSON.stringify(handoff));
    return { sessionId, pane };
}
//# sourceMappingURL=flow.js.map
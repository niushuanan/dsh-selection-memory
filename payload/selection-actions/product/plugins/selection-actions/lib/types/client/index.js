/** Browser half of DSH's native quote and memory selection actions. */
import { MemoryUnavailableError, rememberSelection, undoSelectionMemory } from "./api.js";
import { addSelectionQuote, consumeSelectionQuoteHandoff, openSelectionQuote } from "./flow.js";
import { en, NS, zh } from "./locales.js";
import { serializeSelectionReference } from "./reference.js";
import { captureDshSelection } from "./selection.js";
import { SelectionActions } from "./SelectionActions.js";
import { SelectionReferenceDock } from "./SelectionReferenceDock.js";
export { SelectionActions } from "./SelectionActions.js";
export { captureDshSelection } from "./selection.js";
export { createSelectionReference, serializeSelectionReference } from "./reference.js";
export { addSelectionQuote, openSelectionQuote } from "./flow.js";
export const inject = [
    'slots', 'sessions', 'uiSession', 'workspaces', 'uiWorkspace', 'conversation', 'inputTriggers', 'locale',
];
function isAuxiliaryWindow() {
    if (typeof location === 'undefined')
        return false;
    const params = new URLSearchParams(location.search);
    return params.get('dsh-window') === 'auxiliary'
        && (params.get('dsh-window-id')?.trim().length ?? 0) > 0;
}
/** Mount the hidden reference codec and one global two-action selection popover. */
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'selection-actions: dictionaries');
    const referenceSource = {
        trigger: '@',
        name: 'selection-reference',
        showGroupTitle: false,
        candidates: () => Promise.resolve([]),
        onPick: () => undefined,
        codec: {
            clipboardText: ref => `“${JSON.parse(decodeURIComponent(ref)).selectedText}”`,
            serialize: ref => Promise.resolve(serializeSelectionReference(ref)),
        },
    };
    ctx.effect(() => ctx.inputTriggers.registerSource(referenceSource), 'selection-actions: quote reference codec');
    ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
        name: 'conversation.input.dock',
        id: 'selection-references',
        order: -20,
        locale: NS,
        inject: (sessionId) => ({
            removeReference: (occurrenceId) => {
                const binding = ctx.sessions.binding(sessionId);
                if (binding === undefined)
                    return;
                const input = ctx.conversation.input.for(binding.ctx);
                const state = input.state.getSnapshot();
                const occurrence = state.occurrences.find(candidate => candidate.occurrenceId === occurrenceId);
                if (occurrence === undefined || occurrence.source !== 'selection-reference')
                    return;
                let start = occurrence.offset;
                let end = occurrence.offset + occurrence.length;
                if (state.draft[end] === ' ')
                    end += 1;
                if (start > 0 && state.draft[start - 1] === '\n' && end === state.draft.length)
                    start -= 1;
                input.setDraft(state.draft.slice(0, start) + state.draft.slice(end));
            },
        }),
    }, SelectionReferenceDock));
    if (isAuxiliaryWindow()) {
        const hydrate = () => {
            const sessionId = ctx.uiSession.adapter.current.getSnapshot().key;
            if (sessionId !== undefined)
                consumeSelectionQuoteHandoff(ctx, sessionId);
        };
        hydrate();
        ctx.effect(() => ctx.sessions.list.subscribe(hydrate), 'selection-actions: hydrate pane quote');
        ctx.effect(() => ctx.uiSession.adapter.current.subscribe(hydrate), 'selection-actions: hydrate selected pane quote');
        ctx.effect(() => {
            window.addEventListener('storage', hydrate);
            return () => { window.removeEventListener('storage', hydrate); };
        }, 'selection-actions: receive pane quote');
    }
    ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'selection-actions',
        order: 25,
        locale: NS,
        inject: () => {
            const auxiliaryPane = ctx.get('auxiliaryPane');
            return {
                capture: () => {
                    const state = ctx.sessions.list.getSnapshot();
                    const sessionId = ctx.uiSession.adapter.current.getSnapshot().key;
                    if (sessionId === undefined)
                        return undefined;
                    return captureDshSelection(document, sessionId, state.byId[sessionId]?.cwd);
                },
                quote: async (packet) => addSelectionQuote(ctx, packet),
                ...(auxiliaryPane === undefined ? {} : {
                    sideChat: async (packet) => (await openSelectionQuote(ctx, packet, auxiliaryPane)).pane,
                }),
                remember: async (packet) => {
                    try {
                        return await rememberSelection(packet);
                    }
                    catch (error) {
                        if (error instanceof MemoryUnavailableError)
                            throw new Error(ctx.locale.bind(NS)('memory.unavailable'));
                        throw error;
                    }
                },
                undo: async (revision) => undoSelectionMemory(revision),
            };
        },
    }, SelectionActions));
}
//# sourceMappingURL=index.js.map
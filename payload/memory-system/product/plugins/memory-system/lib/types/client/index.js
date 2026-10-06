/** Browser half of the native two-document memory system. */
import { MemorySettings } from "./MemorySettings.js";
import { en, NS, zh } from "./locales.js";
export { MemorySettings } from "./MemorySettings.js";
export { loadMemoryDocuments, organizeAiMemory, rememberSelection, restoreMemoryDocument, saveMemoryDocument } from "./api.js";
export const inject = ['slots', 'locale'];
/** Register the global memory editor as one native Settings section. */
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'memory-system: dictionaries');
    ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'memory-system',
        order: 55,
        label: () => ctx.locale.bind(NS)('title'),
        locale: NS,
    }, MemorySettings));
}
//# sourceMappingURL=index.js.map
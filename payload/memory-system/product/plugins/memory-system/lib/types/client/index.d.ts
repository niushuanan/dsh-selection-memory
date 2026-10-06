/** Browser half of the native two-document memory system. */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type MemoryLocaleKey } from './locales.ts';
export { MemorySettings } from './MemorySettings.tsx';
export { loadMemoryDocuments, organizeAiMemory, rememberSelection, restoreMemoryDocument, saveMemoryDocument } from './api.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        memorySystem: MemoryLocaleKey;
    }
}
export declare const inject: string[];
/** Register the global memory editor as one native Settings section. */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map
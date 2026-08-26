/** Native Host half of DSH's global two-document memory system. */
import type { Context } from '@deepseek-ai/cordis';
export { MEMORY_API_ROUTE } from './api.ts';
export { MemoryDocumentStore } from './store.ts';
export declare const name = "memory-system";
export declare const inject: string[];
/** Mount API, daily upkeep, route capture, and relevance-gated pre-step recall. */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map
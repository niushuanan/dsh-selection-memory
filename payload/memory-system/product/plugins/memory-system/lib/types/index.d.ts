/** Native Host half of DSH's global two-document memory system. */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
export { MEMORY_API_ROUTE } from './api.ts';
export { MemoryDocumentStore } from './store.ts';
export declare const name = "memory-system";
export declare const inject: string[];
/** Deployment-tunable automatic-memory timing, changeable from cordis.yml. */
export interface Config {
    /** Quiet span a conversation must reach before its new evidence is curated into `ai.md`. */
    readonly idleDelayMs: number;
}
/** Runtime schema for {@link Config}. */
export declare const Config: z<Config>;
/** Mount API, quiet-period upkeep, route capture, and relevance-gated pre-step recall. */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map
/** Quiet-period, cursor-incremental upkeep of the AI memory document. */
import type { Context } from '@deepseek-ai/cordis';
import type { MemoryModelRequest, MemoryModelResult, MemoryRoute } from './model.ts';
import type { MemoryDocumentStore } from './store.ts';
import type { MaintenanceOutcome } from './types.ts';
/** Deployment-tunable upkeep timing for {@link IdleMemoryScheduler}. */
export interface IdleUpkeepConfig {
    /** Quiet span a contributing conversation must reach before its evidence is curated. */
    readonly idleDelayMs: number;
}
/** One maintenance model call: the framed request in, the parsed replacement out. */
export type MemoryGenerator = (input: {
    readonly request: MemoryModelRequest;
    readonly route: MemoryRoute;
}) => Promise<MemoryModelResult>;
/** The store slice upkeep actually touches: state cursors plus the living AI document. */
type UpkeepStore = Pick<MemoryDocumentStore, 'read' | 'readState' | 'write' | 'writeState'>;
/**
 * Maintains `ai.md` from recorded conversations using one monotonic time cursor
 * instead of a wall-clock schedule. Triggers are conversation silence (any session
 * event restarts the quiet timer), a startup backfill over everything missed while
 * DSH was not running, and an explicit user request. Passes run serially; extra
 * triggers while one pass runs coalesce into exactly one follow-up pass.
 *
 * Scheduled passes only curate events older than `idleDelayMs`, so evidence enters
 * memory strictly after its conversation went quiet; explicit passes include up to
 * the current instant. The cursor advances — and any persisted failure note clears —
 * only after every model batch of the window commits, so a failed window retries in
 * full on the next trigger without dropping evidence.
 *
 * @param ctx - Host context supplying the session query, logger, and LLM route.
 * @param store - The memory slice this scheduler reads documents and state from.
 * @param config - Quiet-span timing for scheduled passes.
 * @param generate - Model adapter; defaults to the product flash route.
 */
export declare class IdleMemoryScheduler {
    private timer;
    private cycle;
    private queued;
    private stopped;
    private readonly ctx;
    private readonly store;
    private readonly config;
    private readonly generate;
    constructor(ctx: Context, store: UpkeepStore, config: IdleUpkeepConfig, generate?: MemoryGenerator);
    /** Subscribe to the session event bus so any activity defers the quiet deadline.
     *
     * @returns The listener disposer for effect registration.
     */
    listen(): () => void;
    /** Backfill everything missed while DSH was not running, then keep idle-watching.
     *
     * @returns The scheduler disposer, which stops accepting triggers and clears the timer.
     */
    start(): () => void;
    /** Run one immediate pass through the current instant; report `busy` if one is active.
     *
     * @returns The pass outcome, or the `busy` outcome when a pass already runs.
     */
    organizeNow(): Promise<MaintenanceOutcome>;
    private requestCycle;
    private armQuietTimer;
    private runPass;
    private maintainWindow;
}
export {};
//# sourceMappingURL=scheduler.d.ts.map
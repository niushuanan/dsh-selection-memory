/** Loopback call used by the selection plugin without importing the memory plugin bundle. */
import type { DshSelectionPacket } from './selection.ts';
/** Distinguishes an independently disabled memory plugin from a failed model call. */
export declare class MemoryUnavailableError extends Error {
    name: string;
}
export declare function rememberSelection(packet: DshSelectionPacket): Promise<{
    readonly summary: string;
    readonly changed: boolean;
    readonly revision: string;
}>;
export declare function undoSelectionMemory(revision: string): Promise<void>;
//# sourceMappingURL=api.d.ts.map
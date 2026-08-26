/** Browser transport for the fixed global memory documents and selection action. */
import type { MaintenanceOutcome, MemoryDocumentKind, MemoryDocumentView, MemoryState, SelectionMemorySource } from '../types.ts';
export interface MemoryDocumentsResponse {
    readonly user: MemoryDocumentView;
    readonly ai: MemoryDocumentView;
    readonly state: MemoryState;
}
export declare class MemoryRequestError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
export declare function loadMemoryDocuments(signal?: AbortSignal): Promise<MemoryDocumentsResponse>;
export declare function saveMemoryDocument(kind: MemoryDocumentKind, content: string, revision: string): Promise<MemoryDocumentView>;
export declare function restoreMemoryDocument(kind: MemoryDocumentKind, revision: string): Promise<MemoryDocumentView>;
export declare function rememberSelection(source: SelectionMemorySource): Promise<{
    readonly summary: string;
    readonly changed: boolean;
    readonly revision: string;
}>;
/** Ask the Host for one immediate AI-memory pass that includes brand-new messages.
 *
 * @returns The pass outcome as the Host scheduler reports it.
 */
export declare function organizeAiMemory(): Promise<MaintenanceOutcome>;
//# sourceMappingURL=api.d.ts.map
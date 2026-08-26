/** Loopback-only HTTP boundary for the memory settings and selection plugins. */
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { MaintenanceOutcome, MemoryDocumentKind, MemoryDocumentView, MemoryState, SelectionMemorySource } from './types.ts';
export declare const MEMORY_API_ROUTE = "/plugins/memory-system/api";
export interface MemoryApiService {
    documents(): Promise<{
        user: MemoryDocumentView;
        ai: MemoryDocumentView;
        state: MemoryState;
    }>;
    write(kind: MemoryDocumentKind, content: string, revision: string): Promise<MemoryDocumentView>;
    restore(kind: MemoryDocumentKind, revision: string): Promise<MemoryDocumentView>;
    /** One explicit AI-memory pass through the current instant. */
    maintain(): Promise<MaintenanceOutcome>;
    remember(source: SelectionMemorySource, signal?: AbortSignal): Promise<{
        readonly summary: string;
        readonly changed: boolean;
        readonly revision: string;
    }>;
}
/** Route fixed document operations and bounded model-backed memory actions. */
export declare function memoryApiHandler(req: IncomingMessage, res: ServerResponse, service: MemoryApiService): Promise<void>;
//# sourceMappingURL=api.d.ts.map
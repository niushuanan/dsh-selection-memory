/** Fixed-path atomic persistence for the two global memory documents. */
import type { MemoryDocumentKind, MemoryDocumentView, MemoryState, MemoryWriteReason } from './types.ts';
export type { MemoryDocumentKind, MemoryDocumentView, MemoryState, MemoryWriteReason } from './types.ts';
export declare class MemoryStoreError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
/** Owns only `${DSH_HOME}/memory/*`; callers never supply a path. */
export declare class MemoryDocumentStore {
    private readonly root;
    private readonly history;
    private readonly statePath;
    constructor(dshHome: string);
    read(kind: MemoryDocumentKind): Promise<MemoryDocumentView>;
    write(kind: MemoryDocumentKind, content: string, expectedRevision: string, reason: MemoryWriteReason): Promise<MemoryDocumentView>;
    restorePrevious(kind: MemoryDocumentKind, expectedRevision: string): Promise<MemoryDocumentView>;
    readState(): Promise<MemoryState>;
    writeState(state: MemoryState): Promise<void>;
    private saveHistory;
    private historyFiles;
    private atomicWrite;
}
//# sourceMappingURL=store.d.ts.map
/** Pure policy for DSH's two global living-memory documents. */
export interface MemoryContextRequest {
    readonly query: string;
    readonly cwd?: string;
    readonly userDocument: string;
    readonly aiDocument: string;
    readonly maxBlocks?: number;
    readonly maxCharacters?: number;
}
/** Remove common credential forms before selected or scanned context reaches a memory model. */
export declare function redactSensitiveText(text: string): string;
/** Select a small relevant memory excerpt. User memory is always rendered first. */
export declare function memoryContextFor(request: MemoryContextRequest): string | undefined;
//# sourceMappingURL=domain.d.ts.map
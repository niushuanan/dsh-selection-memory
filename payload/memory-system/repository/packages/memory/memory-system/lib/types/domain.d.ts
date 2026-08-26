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
/** Return the current local calendar day's midnight as a UTC instant. */
export declare function localDayStart(now: Date, offsetMinutes: number): Date;
/** Return the next 00:00 wall-clock instant in a fixed local UTC offset. */
export declare function nextLocalMidnight(now: Date, offsetMinutes: number): Date;
/** Return the exact cursor window for the local calendar day ending at `midnight`. */
export declare function completedLocalDayWindow(midnight: Date, offsetMinutes: number): {
    afterCursor: number;
    throughCursor: number;
};
//# sourceMappingURL=domain.d.ts.map
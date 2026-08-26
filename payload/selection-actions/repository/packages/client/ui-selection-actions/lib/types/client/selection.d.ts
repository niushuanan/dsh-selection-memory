/** DOM-to-product selection packet conversion for native DSH conversations. */
export interface SelectionRect {
    readonly left: number;
    readonly top: number;
    readonly bottom: number;
    readonly width: number;
}
export interface DshSelectionPacket {
    readonly selectedText: string;
    readonly context: string;
    readonly sessionId: string;
    readonly cwd?: string;
    readonly sourceType: 'dsh';
    readonly messageRole: 'user' | 'assistant';
    readonly messageSeq: number;
    readonly rect: SelectionRect;
}
/** Capture a non-collapsed selection only when both endpoints belong to one DSH message. */
export declare function captureDshSelection(document: Document, sessionId: string, cwd?: string): DshSelectionPacket | undefined;
//# sourceMappingURL=selection.d.ts.map
/** Compact composer projection and hidden model serialization of a selection. */
import type { ReferenceInsert } from '@deepseek-ai/dsh-client-ui-input-trigger/client';
import type { DshSelectionPacket } from './selection.ts';
interface SelectionReferencePayload {
    readonly selectedText: string;
    readonly context: string;
    readonly sessionId: string;
    readonly cwd?: string;
    readonly sourceType: 'dsh';
    readonly messageRole: 'user' | 'assistant';
    readonly messageSeq: number;
}
/** Read the source-owned payload for composer previews and source markers. */
export declare function readSelectionReference(ref: string): SelectionReferencePayload;
/** Create the visible chip and keep the full packet in its source-owned opaque ref. */
export declare function createSelectionReference(packet: DshSelectionPacket): ReferenceInsert;
/** Expand a chip only at submit time; quoted data is explicitly lower authority than the new request. */
export declare function serializeSelectionReference(ref: string): string;
export {};
//# sourceMappingURL=reference.d.ts.map
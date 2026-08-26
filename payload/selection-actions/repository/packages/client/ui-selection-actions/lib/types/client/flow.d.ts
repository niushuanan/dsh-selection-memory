/** Native same-workspace conversation creation and unsent quote insertion. */
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client';
import type { MultiPaneService } from '@deepseek-ai/dsh-client-ui-multi-window/client';
import type { DshSelectionPacket } from './selection.ts';
export interface ActiveSelectionReference {
    readonly packet: DshSelectionPacket;
    readonly occurrenceId: number;
    getSnapshot(): boolean;
    subscribe(listener: () => void): () => void;
}
/** Append an unsent selected-text annotation to the current conversation. */
export declare function addSelectionQuote(ctx: ClientContext, packet: DshSelectionPacket): ActiveSelectionReference;
/** One-shot same-origin transfer from the primary runtime to an embedded pane runtime. */
export declare function consumeSelectionQuoteHandoff(ctx: ClientContext, sessionId: SessionId, storage?: Pick<Storage, 'getItem' | 'removeItem'>): boolean;
/** Create/reuse the workspace's blank conversation, seed one chip, and reveal it beside the source. */
export declare function openSelectionQuote(ctx: ClientContext, packet: DshSelectionPacket, multiPane?: MultiPaneService): Promise<{
    readonly sessionId?: SessionId;
    readonly pane: ReturnType<MultiPaneService['openSession']>;
}>;
//# sourceMappingURL=flow.d.ts.map
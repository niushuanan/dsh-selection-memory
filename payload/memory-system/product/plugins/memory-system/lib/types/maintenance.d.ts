/** Conversation scanning and transactional living-document maintenance. */
import type { SessionId } from '@deepseek-ai/dsh-session';
import type { SessionQueryEngine } from '@deepseek-ai/dsh-session-query';
import { buildMemoryModelRequest, type ConversationMemoryEvidence, type MemoryModelResult, type MemoryModelSource, type MemoryRoute } from './model.ts';
import type { MemoryDocumentKind, MemoryDocumentStore } from './store.ts';
type MemoryQuery = Pick<SessionQueryEngine, 'listSessions' | 'readSurface'>;
export declare function boundedEvidenceText(text: string, maxCharacters?: number): string;
/** Split one cursor window's conversation evidence into model-sized batches without dropping conversations. */
export declare function batchConversationEvidence(evidence: readonly ConversationMemoryEvidence[], maxCharacters?: number): ConversationMemoryEvidence[][];
/** Read only real user/model conversation events in the exact successful-cursor window. */
export declare function collectConversationChanges(sessionQuery: MemoryQuery, afterCursor: number, throughCursor: number, signal?: AbortSignal): Promise<ConversationMemoryEvidence[]>;
export interface MaintainMemoryRequest {
    readonly store: Pick<MemoryDocumentStore, 'read' | 'write'>;
    readonly kind: MemoryDocumentKind;
    readonly source: MemoryModelSource;
    readonly route: MemoryRoute;
    readonly sessionId?: SessionId;
    readonly signal?: AbortSignal;
    readonly generate: (input: {
        readonly request: ReturnType<typeof buildMemoryModelRequest>;
        readonly route: MemoryRoute;
        readonly sessionId?: SessionId;
        readonly signal?: AbortSignal;
    }) => Promise<MemoryModelResult>;
}
/** Curate a complete replacement and commit it only when it differs from the loaded revision. */
export declare function maintainMemoryDocument(request: MaintainMemoryRequest): Promise<{
    readonly summary: string;
    readonly changed: boolean;
    readonly revision: string;
}>;
export {};
//# sourceMappingURL=maintenance.d.ts.map
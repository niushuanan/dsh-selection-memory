/** Prompt framing and one-shot LLM adapter for living-memory maintenance. */
import type { Context } from '@deepseek-ai/cordis';
import type { SessionId } from '@deepseek-ai/dsh-session';
import type { MemoryDocumentKind, SelectionMemorySource } from './types.ts';
export type { SelectionMemorySource } from './types.ts';
export interface ConversationMemoryEvidence {
    readonly sessionId: string;
    readonly cwd?: string;
    readonly seq: number;
    readonly time: number;
    readonly role: 'user' | 'assistant';
    readonly text: string;
}
export interface ConversationWindowSource {
    readonly conversations: readonly ConversationMemoryEvidence[];
    readonly fromCursor?: number;
    readonly throughCursor?: number;
}
export type MemoryModelSource = SelectionMemorySource | ConversationWindowSource;
export interface MemoryModelRequest {
    readonly system: string;
    readonly input: string;
    readonly maxTokens?: number;
}
export interface MemoryModelResult {
    readonly document: string;
    readonly summary: string;
}
export interface MemoryRoute {
    readonly provider: string;
    readonly model: string;
}
/** Product-owned route for background AI features; conversation model choices do not alter it. */
export declare const PLUGIN_AI_ROUTE: MemoryRoute;
/** Frame the complete current document and evidence as one inert JSON payload. */
export declare function buildMemoryModelRequest(input: {
    readonly kind: MemoryDocumentKind;
    readonly currentDocument: string;
    readonly source: MemoryModelSource;
}): MemoryModelRequest;
/** Frame one large history batch for concise fact extraction before the global merge. */
export declare function buildMemoryBatchExtractionRequest(source: ConversationWindowSource): MemoryModelRequest;
/** Parse the tagged document protocol, with legacy JSON compatibility; malformed output never reaches persistence. */
export declare function parseMemoryModelOutput(output: string): MemoryModelResult;
/** Run one text-only memory maintenance call through DSH's configured LLM service. */
export declare function generateMemoryWithLlm(ctx: Context, request: MemoryModelRequest, options?: {
    readonly sessionId?: SessionId;
    readonly signal?: AbortSignal;
}): Promise<MemoryModelResult>;
//# sourceMappingURL=model.d.ts.map
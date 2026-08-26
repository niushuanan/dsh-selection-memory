/** Low-authority placement for relevant long-term memory in one model step. */
import { type UserMessage } from '@deepseek-ai/dsh-llm';
/** Place recalled memory immediately before the current request inside an explicit inert-data boundary. */
export declare function injectMemoryContext(messages: readonly UserMessage[], memory: string): UserMessage[];
//# sourceMappingURL=recall.d.ts.map
/** Browser half of DSH's native quote and memory selection actions. */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
export { SelectionActions } from './SelectionActions.tsx';
export { captureDshSelection, type DshSelectionPacket } from './selection.ts';
export { createSelectionReference, serializeSelectionReference } from './reference.ts';
export { addSelectionQuote, openSelectionQuote } from './flow.ts';
export declare const inject: string[];
/** Mount the hidden reference codec and one global two-action selection popover. */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
export interface SelectionReferenceDockInjected {
    removeReference: (occurrenceId: number) => void;
}
export type SelectionReferenceDockProps = PropsRuntime<'conversation.input.dock'> & PropsLocale<'selectionActions'> & SelectionReferenceDockInjected;
/** Compact selected-text annotations above the composer, with source preview on hover/focus. */
export declare function SelectionReferenceDock({ input, removeReference, t }: SelectionReferenceDockProps): import("react").JSX.Element | null;
//# sourceMappingURL=SelectionReferenceDock.d.ts.map
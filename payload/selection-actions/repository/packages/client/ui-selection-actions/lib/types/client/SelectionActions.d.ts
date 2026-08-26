import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { ActiveSelectionReference } from './flow.ts';
import type { DshSelectionPacket } from './selection.ts';
export interface SelectionActionsInjected {
    capture: () => DshSelectionPacket | undefined;
    quote: (packet: DshSelectionPacket) => Promise<ActiveSelectionReference>;
    sideChat: (packet: DshSelectionPacket) => Promise<'opened' | 'visible' | 'limit'>;
    remember: (packet: DshSelectionPacket) => Promise<{
        summary: string;
        changed: boolean;
        revision: string;
    }>;
    undo: (revision: string) => Promise<void>;
}
export type SelectionActionsProps = PropsLocale<'selectionActions'> & InjectFace<SelectionActionsInjected>;
/** Selection-anchored action bar shared by primary and embedded DSH panes. */
export declare function SelectionActions({ capture, quote, sideChat, remember, undo, t }: SelectionActionsProps): import("react").JSX.Element;
//# sourceMappingURL=SelectionActions.d.ts.map
import type { ActiveSelectionReference } from './flow.ts';
interface MarkerPosition {
    readonly left: number;
    readonly top: number;
}
export declare function sourceMarkerPosition(rect: Pick<DOMRect, 'right' | 'top' | 'bottom'>, number: number, viewport: {
    readonly width: number;
    readonly height: number;
}): MarkerPosition | undefined;
/** Numbered source annotation that lives only while its unsent reference exists. */
export declare function SelectionSourceMarker({ reference, number }: {
    readonly reference: ActiveSelectionReference;
    readonly number: number;
}): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=SelectionSourceMarker.d.ts.map
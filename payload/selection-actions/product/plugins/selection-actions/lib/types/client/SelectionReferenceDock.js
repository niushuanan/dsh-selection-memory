import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IconCloseOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives';
import { readSelectionReference } from "./reference.js";
import css from './SelectionReferenceDock.module.css';
/** Compact selected-text annotations above the composer, with source preview on hover/focus. */
export function SelectionReferenceDock({ input, removeReference, t }) {
    const references = input.occurrences.flatMap((occurrence) => {
        if (occurrence.source !== 'selection-reference')
            return [];
        try {
            return [{ occurrence, payload: readSelectionReference(occurrence.ref) }];
        }
        catch {
            return [];
        }
    });
    if (references.length === 0)
        return null;
    return (_jsx("div", { className: css.dock, children: _jsx("div", { className: css.row, children: references.map(({ occurrence, payload }, index) => (_jsxs("div", { className: css.annotation, children: [_jsx("span", { className: css.marker, "aria-hidden": true, children: index + 1 }), index === 0 ? _jsx("span", { className: css.label, children: t('quote.count', { count: references.length }) }) : null, _jsx("button", { type: "button", className: css.remove, "aria-label": t('quote.remove'), onClick: () => { removeReference(occurrence.occurrenceId); }, children: _jsx(IconCloseOutlineRegular, { size: 13 }) }), _jsxs("span", { className: css.preview, role: "tooltip", children: [_jsxs("span", { className: css.previewNumber, children: [index + 1, "."] }), _jsx("span", { children: payload.selectedText })] })] }, occurrence.occurrenceId))) }) }));
}
//# sourceMappingURL=SelectionReferenceDock.js.map
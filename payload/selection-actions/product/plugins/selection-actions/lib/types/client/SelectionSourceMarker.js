import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useSyncExternalStore } from 'react';
import css from './SelectionActions.module.css';
export function sourceMarkerPosition(rect, number, viewport) {
    if (rect.bottom <= 0 || rect.top >= viewport.height)
        return undefined;
    return {
        left: Math.min(viewport.width - 36, rect.right + 8),
        top: Math.min(viewport.height - 36, Math.max(8, rect.top + 8 + (number - 1) * 30)),
    };
}
/** Numbered source annotation that lives only while its unsent reference exists. */
export function SelectionSourceMarker({ reference, number }) {
    const active = useSyncExternalStore(reference.subscribe, reference.getSnapshot, reference.getSnapshot);
    const [position, setPosition] = useState();
    useEffect(() => {
        if (!active)
            return;
        const { messageRole, messageSeq } = reference.packet;
        const selector = `[data-dsh-message][data-dsh-message-role="${messageRole}"][data-dsh-message-seq="${messageSeq}"]`;
        const update = () => {
            const source = document.querySelector(selector);
            if (source === null) {
                setPosition(undefined);
                return;
            }
            const rect = source.getBoundingClientRect();
            setPosition(sourceMarkerPosition(rect, number, { width: window.innerWidth, height: window.innerHeight }));
        };
        update();
        const observer = new MutationObserver(update);
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update, true);
        };
    }, [active, number, reference]);
    if (!active || position === undefined)
        return null;
    return (_jsxs("span", { className: css.sourceMarker, style: position, tabIndex: 0, "aria-label": `引用 ${number}`, children: [number, _jsxs("span", { className: css.sourcePreview, role: "tooltip", children: [_jsxs("span", { children: [number, "."] }), _jsx("span", { children: reference.packet.selectedText })] })] }));
}
//# sourceMappingURL=SelectionSourceMarker.js.map
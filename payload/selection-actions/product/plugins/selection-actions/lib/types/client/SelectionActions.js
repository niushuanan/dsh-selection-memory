import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { IconMemoryOutlineRegular, IconQuoteOutlineRegular, IconWindowNewOutlineRegular } from "./icons.js";
import { SelectionSourceMarker } from "./SelectionSourceMarker.js";
import css from './SelectionActions.module.css';
/** Selection-anchored action bar shared by primary and embedded DSH panes. */
export function SelectionActions({ capture, quote, sideChat, remember, undo, t }) {
    const root = useRef(null);
    const [packet, setPacket] = useState();
    const [busy, setBusy] = useState();
    const [references, setReferences] = useState([]);
    const [remembered, setRemembered] = useState();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        if (references.length === 0)
            return;
        const prune = () => {
            setReferences((current) => {
                const active = current.filter(reference => reference.getSnapshot());
                return active.length === current.length ? current : active;
            });
        };
        const disposers = references.map(reference => reference.subscribe(prune));
        prune();
        return () => { for (const dispose of disposers)
            dispose(); };
    }, [references]);
    useEffect(() => {
        const update = () => {
            requestAnimationFrame(() => {
                const next = capture();
                if (next !== undefined) {
                    setPacket(next);
                    setRemembered(undefined);
                    setMessage('');
                    setError('');
                }
            });
        };
        const dismiss = (event) => {
            if (root.current?.contains(event.target) === true)
                return;
            // One press outside closes the bar. The old "only once the selection is
            // collapsed" guard could not fire on the first press: the browser
            // collapses the selection on release, so closing always took two clicks.
            setPacket(undefined);
        };
        const key = (event) => {
            if (event.key === 'Escape')
                setPacket(undefined);
            else if (event.key === 'Shift' || event.key.startsWith('Arrow'))
                update();
        };
        document.addEventListener('pointerup', update);
        document.addEventListener('pointerdown', dismiss);
        document.addEventListener('keyup', key);
        window.addEventListener('scroll', update, true);
        return () => {
            document.removeEventListener('pointerup', update);
            document.removeEventListener('pointerdown', dismiss);
            document.removeEventListener('keyup', key);
            window.removeEventListener('scroll', update, true);
        };
    }, [capture]);
    const left = packet === undefined ? 0 : Math.max(12, Math.min(window.innerWidth - 330, packet.rect.left + packet.rect.width / 2 - 150));
    const top = packet === undefined ? 0 : (() => {
        const above = packet.rect.top - 40 - 4;
        if (above >= 8)
            return above;
        return Math.min(window.innerHeight - 48, packet.rect.bottom + 4);
    })();
    const runQuote = async () => {
        if (busy !== undefined || packet === undefined)
            return;
        const selected = packet;
        setBusy('quote');
        setError('');
        try {
            const result = await quote(selected);
            setReferences(current => [...current.filter(reference => reference.getSnapshot()), result]);
            document.getSelection()?.removeAllRanges();
            setPacket(undefined);
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : String(reason));
        }
        finally {
            setBusy(undefined);
        }
    };
    const runSideChat = async () => {
        if (busy !== undefined || packet === undefined || sideChat === undefined)
            return;
        const selected = packet;
        setBusy('sideChat');
        setError('');
        try {
            const result = await sideChat(selected);
            if (result === 'limit') {
                setError(t('quote.limit'));
                return;
            }
            document.getSelection()?.removeAllRanges();
            setPacket(undefined);
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : String(reason));
        }
        finally {
            setBusy(undefined);
        }
    };
    const runMemory = async () => {
        if (busy !== undefined || packet === undefined)
            return;
        const selected = packet;
        setBusy('memory');
        setError('');
        setMessage('');
        try {
            const result = await remember(selected);
            setRemembered(result.changed ? result : undefined);
            setMessage(result.summary || t('memory.done'));
            document.getSelection()?.removeAllRanges();
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : String(reason));
        }
        finally {
            setBusy(undefined);
        }
    };
    const runUndo = async () => {
        if (remembered === undefined || busy !== undefined)
            return;
        setBusy('undo');
        setError('');
        try {
            await undo(remembered.revision);
            setRemembered(undefined);
            setMessage(t('undone'));
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : String(reason));
        }
        finally {
            setBusy(undefined);
        }
    };
    return (_jsxs(_Fragment, { children: [references.map((reference, index) => (_jsx(SelectionSourceMarker, { reference: reference, number: index + 1 }, reference.occurrenceId))), packet === undefined ? null : _jsxs("div", { ref: root, className: css.root, style: { left, top }, role: "toolbar", "aria-label": "selection actions", onPointerDown: (event) => { event.preventDefault(); }, children: [remembered === undefined && message === '' ? (_jsxs("div", { className: css.actions, children: [_jsxs("button", { type: "button", disabled: busy !== undefined, onClick: () => { void runQuote(); }, children: [_jsx(IconQuoteOutlineRegular, { size: 14 }), busy === 'quote' ? t('quoting') : t('quote')] }), _jsxs("button", { type: "button", disabled: busy !== undefined, onClick: () => { void runMemory(); }, children: [_jsx(IconMemoryOutlineRegular, { size: 14 }), busy === 'memory' ? t('remembering') : t('memory')] }), sideChat === undefined ? null : (_jsxs("button", { type: "button", disabled: busy !== undefined, onClick: () => { void runSideChat(); }, children: [_jsx(IconWindowNewOutlineRegular, { size: 14 }), busy === 'sideChat' ? t('openingSideChat') : t('sideChat')] }))] })) : null, message !== '' ? (_jsxs("div", { className: css.result, role: "status", children: [_jsx("span", { children: message }), remembered === undefined ? null : (_jsx("button", { type: "button", disabled: busy !== undefined, onClick: () => { void runUndo(); }, children: t('undo') }))] })) : null, error === '' ? null : _jsx("div", { className: css.error, role: "alert", children: error })] })] }));
}
//# sourceMappingURL=SelectionActions.js.map
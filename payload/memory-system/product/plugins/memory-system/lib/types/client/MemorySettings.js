import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from 'react';
import { SettingsSectionHeader } from '@deepseek-ai/dsh-client-ui-primitives';
import { loadMemoryDocuments, organizeAiMemory, restoreMemoryDocument, saveMemoryDocument, } from "./api.js";
import css from './MemorySettings.module.css';
function displayTime(value) {
    if (value === undefined)
        return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}
function replaceDocument(snapshot, kind, document) {
    return { ...snapshot, [kind]: document };
}
/** Compact editor for both global living-memory documents. */
export function MemorySettings({ t }) {
    const tabsId = useId();
    const tabRefs = useRef([]);
    const [snapshot, setSnapshot] = useState();
    const [drafts, setDrafts] = useState({ user: '', ai: '' });
    const [active, setActive] = useState('user');
    const [busy, setBusy] = useState();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const load = async (signal) => {
        setLoading(true);
        setError('');
        try {
            const loaded = await loadMemoryDocuments(signal);
            setSnapshot(loaded);
            setDrafts({ user: loaded.user.content, ai: loaded.ai.content });
        }
        catch (reason) {
            if (signal?.aborted !== true)
                setError(reason instanceof Error ? reason.message : String(reason));
        }
        finally {
            if (signal?.aborted !== true)
                setLoading(false);
        }
    };
    useEffect(() => {
        const controller = new AbortController();
        void load(controller.signal);
        return () => { controller.abort(); };
    }, []);
    const document = snapshot?.[active];
    const dirty = document !== undefined && drafts[active] !== document.content;
    const updateDocument = (next, message) => {
        setSnapshot(current => current === undefined ? current : replaceDocument(current, active, next));
        setDrafts(current => ({ ...current, [active]: next.content }));
        setStatus(message);
    };
    const save = async () => {
        if (document === undefined || !dirty || busy !== undefined)
            return;
        setBusy('save');
        setError('');
        setStatus('');
        try {
            updateDocument(await saveMemoryDocument(active, drafts[active], document.revision), t('saved'));
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : String(reason));
        }
        finally {
            setBusy(undefined);
        }
    };
    const restore = async () => {
        if (document === undefined || !document.canRestore || busy !== undefined)
            return;
        setBusy('restore');
        setError('');
        setStatus('');
        try {
            updateDocument(await restoreMemoryDocument(active, document.revision), t('restored'));
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : String(reason));
        }
        finally {
            setBusy(undefined);
        }
    };
    const organize = async () => {
        if (snapshot === undefined || busy !== undefined)
            return;
        setBusy('organize');
        setError('');
        setStatus('');
        try {
            const outcome = await organizeAiMemory();
            switch (outcome.status) {
                case 'completed':
                    setStatus(outcome.changed === true ? t('organized') : t('organizedUnchanged'));
                    // An unsaved local draft must keep its own revision story; a clean
                    // editor can safely adopt what this pass committed.
                    if (!dirty)
                        await load();
                    break;
                case 'empty':
                    setStatus(t('organizedUnchanged'));
                    break;
                case 'busy':
                    setStatus(t('organizeBusy'));
                    break;
                case 'failed':
                    setError(t('organizeFailed', { message: outcome.message ?? '' }));
                    break;
            }
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : String(reason));
        }
        finally {
            setBusy(undefined);
        }
    };
    const updated = displayTime(active === 'ai'
        ? snapshot?.state.lastMaintenanceAt ?? document?.updatedAt
        : document?.updatedAt);
    return (_jsxs("div", { className: css.root, children: [_jsx(SettingsSectionHeader, { title: t('title') }), _jsx("div", { className: css.tabs, role: "tablist", "aria-label": t('title'), children: ['user', 'ai'].map((kind, index, kinds) => (_jsx("button", { ref: (element) => { tabRefs.current[index] = element; }, id: `${tabsId}-tab-${kind}`, type: "button", role: "tab", "aria-selected": active === kind, "aria-controls": `${tabsId}-panel-${kind}`, tabIndex: active === kind ? 0 : -1, className: css.tab, "data-active": active === kind ? 'true' : undefined, onClick: () => { setActive(kind); setStatus(''); setError(''); }, onKeyDown: (event) => {
                        let nextIndex;
                        switch (event.key) {
                            case 'ArrowRight':
                                nextIndex = (index + 1) % kinds.length;
                                break;
                            case 'ArrowLeft':
                                nextIndex = (index - 1 + kinds.length) % kinds.length;
                                break;
                            case 'Home':
                                nextIndex = 0;
                                break;
                            case 'End':
                                nextIndex = kinds.length - 1;
                                break;
                            default: return;
                        }
                        event.preventDefault();
                        setActive(kinds[nextIndex]);
                        setStatus('');
                        setError('');
                        tabRefs.current[nextIndex]?.focus();
                    }, children: t(`tab.${kind}`) }, kind))) }), snapshot === undefined && loading ? _jsx("p", { className: css.notice, children: t('loading') }) : null, snapshot === undefined && !loading && error !== '' ? (_jsxs("div", { className: css.notice, children: [_jsx("span", { className: css.error, role: "alert", children: error }), ' ', _jsx("button", { type: "button", className: css.secondary, onClick: () => { void load(); }, children: t('retry') })] })) : null, document !== undefined ? (_jsxs("section", { id: `${tabsId}-panel-${active}`, className: css.editorPanel, role: "tabpanel", "aria-labelledby": `${tabsId}-tab-${active}`, children: [_jsx("textarea", { className: css.editor, "aria-label": t(`editor.${active}`), value: drafts[active], placeholder: t('empty'), spellCheck: false, onChange: (event) => {
                            const value = event.currentTarget.value;
                            setDrafts(current => ({ ...current, [active]: value }));
                            setStatus('');
                        } }), _jsxs("div", { className: css.footer, children: [_jsxs("div", { className: css.meta, children: [updated === undefined ? null : _jsx("span", { children: t('updatedAt', { time: updated }) }), active !== 'ai' || snapshot?.state.lastMaintenanceError === undefined ? null : (_jsx("span", { className: css.error, role: "alert", children: t('lastFailed', {
                                            time: displayTime(snapshot.state.lastMaintenanceError.at)
                                                ?? snapshot.state.lastMaintenanceError.at,
                                            message: snapshot.state.lastMaintenanceError.message,
                                        }) })), status === '' ? null : _jsx("span", { className: css.success, role: "status", children: status }), error === '' ? null : _jsx("span", { className: css.error, role: "alert", children: error })] }), _jsxs("div", { className: css.actions, children: [active === 'ai' ? (_jsx("button", { type: "button", className: css.secondary, disabled: busy !== undefined, onClick: () => { void organize(); }, children: busy === 'organize' ? t('organizing') : t('organize') })) : null, document.canRestore ? (_jsx("button", { type: "button", className: css.secondary, disabled: busy !== undefined, onClick: () => { void restore(); }, children: busy === 'restore' ? t('restoring') : t('restore') })) : null, _jsx("button", { type: "button", className: css.primary, disabled: !dirty || busy !== undefined, onClick: () => { void save(); }, children: busy === 'save' ? t('saving') : t('save') })] })] })] })) : null, snapshot !== undefined && error !== '' ? _jsx("p", { className: css.error, role: "alert", children: error }) : null] }));
}
//# sourceMappingURL=MemorySettings.js.map
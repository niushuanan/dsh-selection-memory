window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-memory-system",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region lib/types/client/api.js
		/** Browser transport for the fixed global memory documents and selection action. */
		const API = "/plugins/memory-system/api";
		var MemoryRequestError = class extends Error {
			status;
			constructor(status, message) {
				super(message);
				this.status = status;
			}
		};
		async function jsonResponse(response) {
			const body = await response.json();
			if (!response.ok) throw new MemoryRequestError(response.status, typeof body.error === "string" ? body.error : `HTTP ${String(response.status)}`);
			return body;
		}
		async function loadMemoryDocuments(signal) {
			return jsonResponse(await fetch(`${API}/documents`, signal === void 0 ? void 0 : { signal }));
		}
		async function saveMemoryDocument(kind, content, revision) {
			return jsonResponse(await fetch(`${API}/documents/${kind}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					content,
					revision
				})
			}));
		}
		async function restoreMemoryDocument(kind, revision) {
			return jsonResponse(await fetch(`${API}/documents/${kind}/restore`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ revision })
			}));
		}
		async function rememberSelection(source) {
			return jsonResponse(await fetch(`${API}/remember`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(source)
			}));
		}
		//#endregion
		//#region \0dsh-css:dsh-source/packages/memory/memory-system/src/client/MemorySettings.module.css.mjs
		const css = ".ONlAza_root{box-sizing:border-box;width:100%;max-width:760px;color:var(--dsw-alias-label-primary);padding-bottom:28px}.ONlAza_header h2{margin:0;font-size:18px;font-weight:600;line-height:26px}.ONlAza_tabs{border-bottom:1px solid var(--dsw-alias-border-l2);align-items:flex-end;gap:22px;margin-top:14px;display:flex}.ONlAza_tab{color:var(--dsw-alias-label-tertiary);font:inherit;cursor:pointer;background:0 0;border:0;padding:7px 1px 9px;font-size:13px;line-height:20px;position:relative}.ONlAza_tab:hover,.ONlAza_tab[data-active=true]{color:var(--dsw-alias-label-primary)}.ONlAza_tab[data-active=true]:after,.ONlAza_tab:focus-visible:after{background:var(--dsw-alias-label-primary);content:\"\";border-radius:2px 2px 0 0;height:2px;position:absolute;bottom:-1px;left:0;right:0}.ONlAza_tab:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px;border-radius:2px}.ONlAza_editorPanel{margin-top:14px}.ONlAza_editor{box-sizing:border-box;resize:vertical;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);width:100%;min-height:360px;color:var(--dsw-alias-label-primary);border-radius:12px;outline:none;padding:14px 16px;font:12px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace;display:block}.ONlAza_editor:focus{border-color:var(--dsw-alias-label-secondary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent)}.ONlAza_footer{justify-content:space-between;align-items:flex-start;gap:16px;margin-top:12px;display:flex}.ONlAza_meta{min-width:0;color:var(--dsw-alias-label-tertiary);flex-direction:column;gap:2px;font-size:10px;line-height:16px;display:flex}.ONlAza_actions{flex:none;gap:8px;display:flex}.ONlAza_primary,.ONlAza_secondary{height:32px;font:inherit;cursor:pointer;border-radius:8px;padding:0 14px;font-size:12px}.ONlAza_primary{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-1);border:0}.ONlAza_secondary{border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);background:0 0}.ONlAza_primary:disabled,.ONlAza_secondary:disabled{cursor:default;opacity:.45}.ONlAza_notice{color:var(--dsw-alias-label-secondary);font-size:12px}.ONlAza_success{color:var(--dsw-alias-green-primary,#15803d)}.ONlAza_error{color:var(--dsw-alias-red-primary,#d92d20);font-size:11px}@media (width<=620px){.ONlAza_footer{flex-direction:column}.ONlAza_actions{align-self:flex-end}}";
		const tagId = "@deepseek-ai/dsh-memory-system/MemorySettings.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-memory-system";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var MemorySettings_module_css_default = {
			"actions": "ONlAza_actions",
			"editor": "ONlAza_editor",
			"editorPanel": "ONlAza_editorPanel",
			"error": "ONlAza_error",
			"footer": "ONlAza_footer",
			"header": "ONlAza_header",
			"meta": "ONlAza_meta",
			"notice": "ONlAza_notice",
			"primary": "ONlAza_primary",
			"root": "ONlAza_root",
			"secondary": "ONlAza_secondary",
			"success": "ONlAza_success",
			"tab": "ONlAza_tab",
			"tabs": "ONlAza_tabs"
		};
		//#endregion
		//#region lib/types/client/MemorySettings.js
		function displayTime(value) {
			if (value === void 0) return void 0;
			const date = new Date(value);
			return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
		}
		function replaceDocument(snapshot, kind, document) {
			return {
				...snapshot,
				[kind]: document
			};
		}
		/** Compact editor for both global living-memory documents. */
		function MemorySettings({ t }) {
			const tabsId = (0, react.useId)();
			const tabRefs = (0, react.useRef)([]);
			const [snapshot, setSnapshot] = (0, react.useState)();
			const [drafts, setDrafts] = (0, react.useState)({
				user: "",
				ai: ""
			});
			const [active, setActive] = (0, react.useState)("user");
			const [busy, setBusy] = (0, react.useState)();
			const [loading, setLoading] = (0, react.useState)(true);
			const [status, setStatus] = (0, react.useState)("");
			const [error, setError] = (0, react.useState)("");
			const load = async (signal) => {
				setLoading(true);
				setError("");
				try {
					const loaded = await loadMemoryDocuments(signal);
					setSnapshot(loaded);
					setDrafts({
						user: loaded.user.content,
						ai: loaded.ai.content
					});
				} catch (reason) {
					if (signal?.aborted !== true) setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					if (signal?.aborted !== true) setLoading(false);
				}
			};
			(0, react.useEffect)(() => {
				const controller = new AbortController();
				load(controller.signal);
				return () => {
					controller.abort();
				};
			}, []);
			const document = snapshot?.[active];
			const dirty = document !== void 0 && drafts[active] !== document.content;
			const updateDocument = (next, message) => {
				setSnapshot((current) => current === void 0 ? current : replaceDocument(current, active, next));
				setDrafts((current) => ({
					...current,
					[active]: next.content
				}));
				setStatus(message);
			};
			const save = async () => {
				if (document === void 0 || !dirty || busy !== void 0) return;
				setBusy("save");
				setError("");
				setStatus("");
				try {
					updateDocument(await saveMemoryDocument(active, drafts[active], document.revision), t("saved"));
				} catch (reason) {
					setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					setBusy(void 0);
				}
			};
			const restore = async () => {
				if (document === void 0 || !document.canRestore || busy !== void 0) return;
				setBusy("restore");
				setError("");
				setStatus("");
				try {
					updateDocument(await restoreMemoryDocument(active, document.revision), t("restored"));
				} catch (reason) {
					setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					setBusy(void 0);
				}
			};
			const updated = displayTime(active === "ai" ? snapshot?.state.lastMaintenanceAt ?? document?.updatedAt : document?.updatedAt);
			return (0, react_jsx_runtime.jsxs)("div", {
				className: MemorySettings_module_css_default.root,
				children: [
					(0, react_jsx_runtime.jsx)("header", {
						className: MemorySettings_module_css_default.header,
						children: (0, react_jsx_runtime.jsx)("h2", { children: t("title") })
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: MemorySettings_module_css_default.tabs,
						role: "tablist",
						"aria-label": t("title"),
						children: ["user", "ai"].map((kind, index, kinds) => (0, react_jsx_runtime.jsx)("button", {
							ref: (element) => {
								tabRefs.current[index] = element;
							},
							id: `${tabsId}-tab-${kind}`,
							type: "button",
							role: "tab",
							"aria-selected": active === kind,
							"aria-controls": `${tabsId}-panel-${kind}`,
							tabIndex: active === kind ? 0 : -1,
							className: MemorySettings_module_css_default.tab,
							"data-active": active === kind ? "true" : void 0,
							onClick: () => {
								setActive(kind);
								setStatus("");
								setError("");
							},
							onKeyDown: (event) => {
								let nextIndex;
								switch (event.key) {
									case "ArrowRight":
										nextIndex = (index + 1) % kinds.length;
										break;
									case "ArrowLeft":
										nextIndex = (index - 1 + kinds.length) % kinds.length;
										break;
									case "Home":
										nextIndex = 0;
										break;
									case "End":
										nextIndex = kinds.length - 1;
										break;
									default: return;
								}
								event.preventDefault();
								setActive(kinds[nextIndex]);
								setStatus("");
								setError("");
								tabRefs.current[nextIndex]?.focus();
							},
							children: t(`tab.${kind}`)
						}, kind))
					}),
					snapshot === void 0 && loading ? (0, react_jsx_runtime.jsx)("p", {
						className: MemorySettings_module_css_default.notice,
						children: t("loading")
					}) : null,
					snapshot === void 0 && !loading && error !== "" ? (0, react_jsx_runtime.jsxs)("div", {
						className: MemorySettings_module_css_default.notice,
						children: [
							(0, react_jsx_runtime.jsx)("span", {
								className: MemorySettings_module_css_default.error,
								role: "alert",
								children: error
							}),
							" ",
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: MemorySettings_module_css_default.secondary,
								onClick: () => {
									load();
								},
								children: t("retry")
							})
						]
					}) : null,
					document !== void 0 ? (0, react_jsx_runtime.jsxs)("section", {
						id: `${tabsId}-panel-${active}`,
						className: MemorySettings_module_css_default.editorPanel,
						role: "tabpanel",
						"aria-labelledby": `${tabsId}-tab-${active}`,
						children: [(0, react_jsx_runtime.jsx)("textarea", {
							className: MemorySettings_module_css_default.editor,
							"aria-label": t(`editor.${active}`),
							value: drafts[active],
							placeholder: t("empty"),
							spellCheck: false,
							onChange: (event) => {
								const value = event.currentTarget.value;
								setDrafts((current) => ({
									...current,
									[active]: value
								}));
								setStatus("");
							}
						}), (0, react_jsx_runtime.jsxs)("div", {
							className: MemorySettings_module_css_default.footer,
							children: [(0, react_jsx_runtime.jsxs)("div", {
								className: MemorySettings_module_css_default.meta,
								children: [
									updated === void 0 ? null : (0, react_jsx_runtime.jsx)("span", { children: t("updatedAt", { time: updated }) }),
									status === "" ? null : (0, react_jsx_runtime.jsx)("span", {
										className: MemorySettings_module_css_default.success,
										role: "status",
										children: status
									}),
									error === "" ? null : (0, react_jsx_runtime.jsx)("span", {
										className: MemorySettings_module_css_default.error,
										role: "alert",
										children: error
									})
								]
							}), (0, react_jsx_runtime.jsxs)("div", {
								className: MemorySettings_module_css_default.actions,
								children: [document.canRestore ? (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: MemorySettings_module_css_default.secondary,
									disabled: busy !== void 0,
									onClick: () => {
										restore();
									},
									children: busy === "restore" ? t("restoring") : t("restore")
								}) : null, (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: MemorySettings_module_css_default.primary,
									disabled: !dirty || busy !== void 0,
									onClick: () => {
										save();
									},
									children: busy === "save" ? t("saving") : t("save")
								})]
							})]
						})]
					}) : null,
					snapshot !== void 0 && error !== "" ? (0, react_jsx_runtime.jsx)("p", {
						className: MemorySettings_module_css_default.error,
						role: "alert",
						children: error
					}) : null
				]
			});
		}
		//#endregion
		//#region lib/types/client/locales.js
		const NS = "memorySystem";
		const zh = {
			title: "长期记忆",
			"tab.user": "选中记忆",
			"tab.ai": "AI主动记忆",
			"editor.user": "编辑选中记忆",
			"editor.ai": "编辑 AI主动记忆",
			save: "保存",
			saving: "正在保存…",
			restore: "恢复上一版",
			restoring: "正在恢复…",
			saved: "已保存",
			restored: "已恢复上一版",
			loading: "正在读取记忆…",
			retry: "重试",
			empty: "暂无记忆。",
			"updatedAt": "更新于 {time}"
		};
		const en = {
			title: "Long-term memory",
			"tab.user": "Selection memory",
			"tab.ai": "AI memory",
			"editor.user": "Edit selection memory",
			"editor.ai": "Edit AI memory",
			save: "Save",
			saving: "Saving…",
			restore: "Restore previous",
			restoring: "Restoring…",
			saved: "Saved",
			restored: "Previous revision restored",
			loading: "Loading memory…",
			retry: "Retry",
			empty: "No memory yet.",
			"updatedAt": "Updated {time}"
		};
		//#endregion
		//#region lib/types/client/index.js
		/** Browser half of the native two-document memory system. */
		const inject = ["slots", "locale"];
		/** Register the global memory editor as one native Settings section. */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "memory-system: dictionaries");
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "memory-system",
				order: 55,
				label: () => ctx.locale.bind(NS)("title"),
				locale: NS
			}, MemorySettings));
		}
		//#endregion
		exports.MemorySettings = MemorySettings;
		exports.apply = apply;
		exports.inject = inject;
		exports.loadMemoryDocuments = loadMemoryDocuments;
		exports.rememberSelection = rememberSelection;
		exports.restoreMemoryDocument = restoreMemoryDocument;
		exports.saveMemoryDocument = saveMemoryDocument;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map
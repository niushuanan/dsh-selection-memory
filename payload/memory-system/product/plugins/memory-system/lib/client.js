window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-memory-system",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/api.ts
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
		/** Ask the Host for one immediate AI-memory pass that includes brand-new messages.
		*
		* @returns The pass outcome as the Host scheduler reports it.
		*/
		async function organizeAiMemory() {
			return jsonResponse(await fetch(`${API}/maintain`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: "{}"
			}));
		}
		//#endregion
		//#region \0dsh-css:/private/tmp/dsh-publish-20260905.X1Ok1K/source/plugins/memory-system/src/client/MemorySettings.module.css.mjs
		const css = ".etGCYa_root{box-sizing:border-box;width:100%;max-width:760px;color:var(--dsw-alias-label-primary);padding-bottom:28px}.etGCYa_tabs{border-bottom:1px solid var(--dsw-alias-border-l2);align-items:flex-end;gap:22px;margin-top:14px;display:flex}.etGCYa_tab{color:var(--dsw-alias-label-tertiary);font:inherit;cursor:pointer;background:0 0;border:0;padding:7px 1px 9px;font-size:13px;line-height:20px;position:relative}.etGCYa_tab:hover,.etGCYa_tab[data-active=true]{color:var(--dsw-alias-label-primary)}.etGCYa_tab[data-active=true]:after,.etGCYa_tab:focus-visible:after{background:var(--dsw-alias-label-primary);content:\"\";border-radius:2px 2px 0 0;height:2px;position:absolute;bottom:-1px;left:0;right:0}.etGCYa_tab:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px;border-radius:2px}.etGCYa_editorPanel{margin-top:14px}.etGCYa_editor{box-sizing:border-box;resize:vertical;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);width:100%;min-height:360px;color:var(--dsw-alias-label-primary);border-radius:12px;outline:none;padding:14px 16px;font:12px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace;display:block}.etGCYa_editor:focus{border-color:var(--dsw-alias-label-secondary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent)}.etGCYa_footer{justify-content:space-between;align-items:flex-start;gap:16px;margin-top:12px;display:flex}.etGCYa_meta{min-width:0;color:var(--dsw-alias-label-tertiary);flex-direction:column;gap:2px;font-size:10px;line-height:16px;display:flex}.etGCYa_actions{flex:none;gap:8px;display:flex}.etGCYa_primary,.etGCYa_secondary{height:32px;font:inherit;cursor:pointer;border-radius:8px;padding:0 14px;font-size:12px}.etGCYa_primary{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-1);border:0}.etGCYa_secondary{border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);background:0 0}.etGCYa_primary:disabled,.etGCYa_secondary:disabled{cursor:default;opacity:.45}.etGCYa_notice{color:var(--dsw-alias-label-secondary);font-size:12px}.etGCYa_success{color:var(--dsw-alias-green-primary,#15803d)}.etGCYa_error{color:var(--dsw-alias-red-primary,#d92d20);font-size:11px}@media (width<=620px){.etGCYa_footer{flex-direction:column}.etGCYa_actions{align-self:flex-end}}";
		const tagId = "@deepseek-ai/dsh-memory-system/MemorySettings.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-memory-system";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var MemorySettings_module_css_default = {
			"actions": "etGCYa_actions",
			"editor": "etGCYa_editor",
			"editorPanel": "etGCYa_editorPanel",
			"error": "etGCYa_error",
			"footer": "etGCYa_footer",
			"meta": "etGCYa_meta",
			"notice": "etGCYa_notice",
			"primary": "etGCYa_primary",
			"root": "etGCYa_root",
			"secondary": "etGCYa_secondary",
			"success": "etGCYa_success",
			"tab": "etGCYa_tab",
			"tabs": "etGCYa_tabs"
		};
		//#endregion
		//#region src/client/MemorySettings.tsx
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
			const organize = async () => {
				if (snapshot === void 0 || busy !== void 0) return;
				setBusy("organize");
				setError("");
				setStatus("");
				try {
					const outcome = await organizeAiMemory();
					switch (outcome.status) {
						case "completed":
							setStatus(outcome.changed === true ? t("organized") : t("organizedUnchanged"));
							if (!dirty) await load();
							break;
						case "empty":
							setStatus(t("organizedUnchanged"));
							break;
						case "busy":
							setStatus(t("organizeBusy"));
							break;
						case "failed":
							setError(t("organizeFailed", { message: outcome.message ?? "" }));
							break;
					}
				} catch (reason) {
					setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					setBusy(void 0);
				}
			};
			const updated = displayTime(active === "ai" ? snapshot?.state.lastMaintenanceAt ?? document?.updatedAt : document?.updatedAt);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: MemorySettings_module_css_default.root,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.SettingsSectionHeader, { title: t("title") }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: MemorySettings_module_css_default.tabs,
						role: "tablist",
						"aria-label": t("title"),
						children: ["user", "ai"].map((kind, index, kinds) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
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
					snapshot === void 0 && loading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: MemorySettings_module_css_default.notice,
						children: t("loading")
					}) : null,
					snapshot === void 0 && !loading && error !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: MemorySettings_module_css_default.notice,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: MemorySettings_module_css_default.error,
								role: "alert",
								children: error
							}),
							" ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: MemorySettings_module_css_default.secondary,
								onClick: () => {
									load();
								},
								children: t("retry")
							})
						]
					}) : null,
					document !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						id: `${tabsId}-panel-${active}`,
						className: MemorySettings_module_css_default.editorPanel,
						role: "tabpanel",
						"aria-labelledby": `${tabsId}-tab-${active}`,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
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
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: MemorySettings_module_css_default.footer,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: MemorySettings_module_css_default.meta,
								children: [
									updated === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("updatedAt", { time: updated }) }),
									active !== "ai" || snapshot?.state.lastMaintenanceError === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MemorySettings_module_css_default.error,
										role: "alert",
										children: t("lastFailed", {
											time: displayTime(snapshot.state.lastMaintenanceError.at) ?? snapshot.state.lastMaintenanceError.at,
											message: snapshot.state.lastMaintenanceError.message
										})
									}),
									status === "" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MemorySettings_module_css_default.success,
										role: "status",
										children: status
									}),
									error === "" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MemorySettings_module_css_default.error,
										role: "alert",
										children: error
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: MemorySettings_module_css_default.actions,
								children: [
									active === "ai" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: MemorySettings_module_css_default.secondary,
										disabled: busy !== void 0,
										onClick: () => {
											organize();
										},
										children: busy === "organize" ? t("organizing") : t("organize")
									}) : null,
									document.canRestore ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: MemorySettings_module_css_default.secondary,
										disabled: busy !== void 0,
										onClick: () => {
											restore();
										},
										children: busy === "restore" ? t("restoring") : t("restore")
									}) : null,
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: MemorySettings_module_css_default.primary,
										disabled: !dirty || busy !== void 0,
										onClick: () => {
											save();
										},
										children: busy === "save" ? t("saving") : t("save")
									})
								]
							})]
						})]
					}) : null,
					snapshot !== void 0 && error !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: MemorySettings_module_css_default.error,
						role: "alert",
						children: error
					}) : null
				]
			});
		}
		//#endregion
		//#region src/client/locales.ts
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
			"updatedAt": "更新于 {time}",
			organize: "立即整理",
			organizing: "正在整理…",
			organized: "AI 记忆已更新",
			organizedUnchanged: "暂无需要沉淀的新内容",
			organizeBusy: "已有一次整理在进行，请稍后",
			organizeFailed: "整理失败：{message}",
			lastFailed: "上次自动整理失败于 {time}：{message}"
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
			"updatedAt": "Updated {time}",
			organize: "Organize now",
			organizing: "Organizing…",
			organized: "AI memory updated",
			organizedUnchanged: "Nothing new worth remembering yet",
			organizeBusy: "A maintenance pass is already running",
			organizeFailed: "Maintenance failed: {message}",
			lastFailed: "Last automatic maintenance failed at {time}: {message}"
		};
		//#endregion
		//#region src/client/index.ts
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
			ctx.slots.inject("settings.section.icon", () => ctx.slots.register({
				name: "settings.section.icon",
				id: "memory-system"
			}, _deepseek_ai_dsh_client_ui_primitives.IconMemoryOutline16));
		}
		//#endregion
		exports.MemorySettings = MemorySettings;
		exports.apply = apply;
		exports.inject = inject;
		exports.loadMemoryDocuments = loadMemoryDocuments;
		exports.organizeAiMemory = organizeAiMemory;
		exports.rememberSelection = rememberSelection;
		exports.restoreMemoryDocument = restoreMemoryDocument;
		exports.saveMemoryDocument = saveMemoryDocument;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map
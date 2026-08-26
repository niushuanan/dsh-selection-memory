//#region lib/types/invariant.js
/** Package-owned invariant companion for the native memory system. */
const PACKAGE_NAME = "@deepseek-ai/dsh-memory-system";
const name = "memory-system-invariant";
const inject = ["invariants"];
/** No runtime invariant: fixed-path persistence and prompt framing are covered by package tests. */
const install = () => {};
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };

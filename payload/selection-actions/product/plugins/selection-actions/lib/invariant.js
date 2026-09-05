//#region src/invariant.ts
const PACKAGE_NAME = "@deepseek-ai/dsh-client-ui-selection-actions";
const name = "client-ui-selection-actions-invariant";
const inject = ["invariants"];
/** No runtime invariant: the overlay is effect-scoped and quote serialization is covered by package tests. */
const install = () => {};
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };

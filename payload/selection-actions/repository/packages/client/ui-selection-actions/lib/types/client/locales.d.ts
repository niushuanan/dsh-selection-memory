export declare const NS = "selectionActions";
export declare const zh: {
    readonly quote: "引用";
    readonly memory: "记忆";
    readonly sideChat: "侧边聊天";
    readonly quoting: "正在引用…";
    readonly openingSideChat: "正在打开…";
    readonly remembering: "正在整理记忆…";
    readonly undo: "撤销";
    readonly undone: "已撤销这次记忆";
    readonly 'quote.limit': "已达到多对话分屏上限";
    readonly 'quote.unavailable': "多对话分屏当前不可用";
    readonly 'quote.count': "{count} 个已选文本";
    readonly 'quote.remove': "移除引用";
    readonly 'memory.unavailable': "记忆体系当前不可用，请在插件中心开启";
    readonly 'memory.done': "已写入用户主动记忆";
};
export declare const en: Record<keyof typeof zh, string>;
export type SelectionLocaleKey = keyof typeof zh;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        selectionActions: SelectionLocaleKey;
    }
}
//# sourceMappingURL=locales.d.ts.map
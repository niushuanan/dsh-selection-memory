import type { MemoryLocaleKey } from './locales.ts';
type Translate = (key: MemoryLocaleKey, params?: Record<string, unknown>) => string;
export interface MemorySettingsProps {
    readonly t: Translate;
}
/** Compact editor for both global living-memory documents. */
export declare function MemorySettings({ t }: MemorySettingsProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=MemorySettings.d.ts.map
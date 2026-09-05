import { useTranslation } from "react-i18next";

export default function TestModeBanner() {
    const { t } = useTranslation();

    return (
        <div
            className="sticky top-0 left-0 right-0 z-50 h-9 flex items-center overflow-hidden"
            style={{
                background: "var(--color-accent-100)",
                color: "var(--color-accent-800)",
                borderBottom: "1px solid var(--color-accent)",
            }}
        >
            <div className="whitespace-nowrap animate-marquee-rl text-sm font-semibold tracking-wide w-full px-4 leading-normal flex items-center">
                {t("testModeWarning")}
            </div>
        </div>
    );
}

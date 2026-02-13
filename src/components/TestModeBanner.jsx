import { useTranslation } from "react-i18next";

export default function TestModeBanner() {
    const { t } = useTranslation();

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-amber-700 to-red-700 text-white h-10 flex items-center overflow-hidden shadow-md">
            <div className="whitespace-nowrap animate-marquee-rl text-sm sm:text-base font-semibold tracking-wide w-full px-4 leading-normal flex items-center">
                {t("testModeWarning")}
            </div>

        </div>
    );
}

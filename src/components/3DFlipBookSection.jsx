import { Book } from "lucide-react";
import React from "react";
import HTMLFlipBook from "react-pageflip";
import AnimatedSectionDivider from "./AnimatedSectionDivider";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Page = React.forwardRef(({ title, text, pageNumber }, ref) => {
  return (
    <div
      ref={ref}
      className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 shadow-inner rounded-sm border-r border-amber-200 p-6 flex flex-col justify-between relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(45deg, transparent 24%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 76%, transparent 77%, transparent),
          linear-gradient(-45deg, transparent 24%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '12px 12px'
      }}
    >
      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-amber-100 to-orange-100"></div>

      <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-red-300 bg-gradient-to-r from-red-50 to-transparent">
        <div className="absolute left-3 top-8 w-1 h-1 bg-red-400 rounded-full"></div>
        <div className="absolute left-3 top-16 w-1 h-1 bg-red-400 rounded-full"></div>
        <div className="absolute left-3 bottom-16 w-1 h-1 bg-red-400 rounded-full"></div>
      </div>

      <div className="relative z-10 ml-6">
        {title && <h3 className="text-base font-bold text-gray-800 mb-3 font-serif border-b border-amber-200 pb-2">{title}</h3>}
        <p className="text-gray-700 text-xs leading-relaxed font-serif">{text}</p>
      </div>

      <div className="absolute bottom-4 right-6 text-xs text-gray-500 font-serif">{pageNumber}</div>
    </div>
  );
});

const CoverPage = React.forwardRef((props, ref) => (
  <div
    ref={ref}
    className="w-full h-full relative rounded-sm overflow-hidden"
  >
    <div className="absolute inset-0 bg-slate-800"></div>

    <div
      className="absolute inset-0 opacity-80"
      style={{
        background: `linear-gradient(145deg, #0f172a 0%, #1e293b 20%, #334155 40%, #475569 60%, #64748b 100%)`,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(0,0,0,0.4) 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 1px, transparent 1px),
          linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.08) 49%, rgba(255,255,255,0.08) 51%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, rgba(0,0,0,0.1) 49%, rgba(0,0,0,0.1) 51%, transparent 52%)
        `,
        backgroundSize: '6px 6px, 8px 8px, 4px 4px, 4px 4px'
      }}
    ></div>

    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/40"></div>

    <div className="relative z-20 p-8 h-full flex flex-col items-center justify-center text-white">
      <div className="relative mb-6">
        <h1 className="text-3xl font-bold font-serif tracking-wide relative z-10 drop-shadow-2xl">
          O'tkan Kunlar
        </h1>
        <div className="absolute inset-0 text-3xl font-bold font-serif tracking-wide text-black/60 transform translate-x-1 translate-y-1">
          O'tkan Kunlar
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-amber-300"></div>
        <Book className="w-7 h-7 text-amber-300 drop-shadow-lg" />
        <div className="w-16 h-px bg-gradient-to-l from-transparent via-amber-400 to-amber-300"></div>
      </div>

      <p className="text-xl font-serif tracking-widest text-amber-100 drop-shadow-md">
        Abdulla Qodiriy
      </p>

      <div className="absolute bottom-6 right-6 text-xs text-amber-200/80 font-serif drop-shadow-sm">
        Toshkent — 1926
      </div>
    </div>

    <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-amber-400/70 rounded-tl-sm"></div>
    <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/70 rounded-tr-sm"></div>
    <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-amber-400/70 rounded-bl-sm"></div>
    <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-amber-400/70 rounded-br-sm"></div>
  </div>
));

const BackCover = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  return (
    <div
      ref={ref}
      className="w-full h-full relative rounded-sm overflow-hidden"
    >
      <div className="absolute inset-0 bg-slate-800"></div>
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `linear-gradient(145deg, #0f172a 0%, #1e293b 20%, #334155 40%, #475569 60%, #64748b 100%)`,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(0,0,0,0.4) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '6px 6px, 8px 8px'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-white/20 via-transparent to-black/40"></div>

      <div className="relative z-20 p-8 h-full flex flex-col justify-center text-white">
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold font-serif mb-4 drop-shadow-lg">{t("flipBook.aboutWork")}</h2>
          <p className="text-sm leading-relaxed text-gray-200 font-serif drop-shadow-sm">
            {t("flipBook.aboutWorkDesc")}
          </p>
        </div>
        <div className="mt-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Book className="w-8 h-8 text-amber-300 drop-shadow-lg" />
          </div>
          <p className="text-xs font-serif text-amber-200/90 drop-shadow-sm">
            {t("flipBook.publisher")}
          </p>
        </div>
      </div>
    </div>
  );
});

const pages = [
  {
    title: "Kirish",
    pageNumber: 1,
    text: `"O'tkan kunlar" — o'zbek klassik adabiyotining eng buyuk romani bo'lib, Abdulla Qodiriy tomonidan 1922–1926-yillarda yozilgan. Asar o'zbek tilida yozilgan birinchi roman sifatida tarixga kirgan.

Romanda XIX asrning ikkinchi yarmida — Chor Rossiyasi bosqini arafasida — o'zbek jamiyatining hayoti, urf-odatlari, sevgi va iztiroblari, oilaviy munosabatlar keng va chuqur tasvirlanadi.

Asar qahramonlari — Otabek va Kumush — o'rtasidagi sof muhabbat taqdiri orqali davr fojiasi, jamiyat ziddiyatlari va inson ruhiyatining murakkabligi ochib beriladi. Bu roman avloddan avlodga o'tib kelayotgan bebaho adabiy meros hisoblanadi.`,
  },
  {
    title: "1-Bob. Otabek — Yusufbek hoji o'g'li",
    pageNumber: 2,
    text: `1264-inchi yil, dalv oyining o'n yettinchi kunchisi, qish chillasining ayni o'rtalari edi. Kech kirgan, kun botganiga ancha vaqt o'tgan bo'lsa ham, qishning qahraton sovug'i kishini junjiktirar, qorong'u tunning vahimasini yanada oshirar edi.

Otabek — Marg'ilonning eng ko'zga ko'ringan boylaridan Yusufbek hojining yagona o'g'li — yoshligidan yaxshi tarbiya ko'rgan, bilimli va or-nomusli yigit edi. U bugun Toshkentdan qadrdon do'sti Hasanali bilan uchrashish uchun Marg'ilonga qaytmoqda edi.

Uning ko'ngli g'ash, yuragi allaqanday notinch edi. Yo'l bo'yi o't-o'lan qotib qolgan dalalar, sovuq shamol va jimjitlik ichida at yurib borardi. Otabekning xayolida nimalardur aylanardi — lekin u o'zi ham bilmasdi bu safar hayotini butunlay o'zgartirishi mumkin ekanini.`,
  },
  {
    title: "2-Bob. Marg'ilon g'allasi",
    pageNumber: 3,
    text: `Marg'ilon — qadimiy va obod shahar. Tor ko'chalari, baland devorli hovlilari, ko'p gumbazli masjidlari bilan bu shahar o'zining alohida qiyofasiga ega edi. Bozori handalak, anor va ipak matolari bilan butun O'rta Osiyoda mashhur edi.

Hasanali uni darvoza oldida kutib olgan edi. Do'stlar ko'rishib, ko'p bo'lmagan suhbatdan so'ng shaharga kirishdi. Bozor tomondan kelayotgan ovozlar, qo'y-echki ma'rashi, temirchilar taqir-tuquri shaharning jonli ekanidan darak berardi.

"Uzoq bo'ldi, do'stim," — dedi Hasanali kulimsirab. "Toshkentning havosi yoqib qoldimi?" Otabek bosh silkidi, lekin ko'nglida boshqa bir narsa edi. U bu shaharga qaytganda o'zini doim erkin his qilardi — go'yo Marg'ilon uni o'z bag'riga tortgandek.`,
  },
  {
    title: "3-Bob. Ziyo shohichi uyida",
    pageNumber: 4,
    text: `Ziyo shohichi — Marg'ilonning obro'li, diyonatli va xalq ichida hurmatli kishilaridan biri edi. Uning keng hovlisi katta chinor va tol daraxtlari soyasida yotardi. Mehmonxonasida qimmatbaho gilam va ko'rpachalar to'shaldi, devorlardan eski qilichlar osilgan.

Hasanali Otabekni shu uyga olib keldi. Ziyo shohichi o'z mehmonlarini ochiq yuz va samimiy gap bilan kutib oldi. Dasturxon yozildi — non, meva, palov hidi butun xonani tutdi.

Suhbat davomida Otabekning ko'zi hovlidagi eshikka tushdi. Bir on ichida pardaning orqasida kimningdir soyasi ko'rindi. Yurak bir urdi — go'yo butun dunyo o'sha bir lahzaga sig'ib qolgandek. U o'zini qo'lga olib, suhbatga qaytdi, ammo ko'nglining bir burchagida allaqanday iliq bir his uyg'onib qolgan edi.`,
  },
  {
    title: "4-Bob. Kumushbibi",
    pageNumber: 5,
    text: `Kumush — Ziyo shohichining yagona qizi, Marg'ilonning eng go'zal va aqlli qizlaridan biri edi. Ko'zlari qora va chuqur, kiprik ostidan boqishi muloyim, yurishi esa nozik edi. U odobli, kamgap, lekin ichki dunyosi boy bir qiz edi.

Otabek uni birinchi ko'rganda so'z topolmay qoldi. Bu — oddiy bir ko'rishish emas, balki yurakka sanchilgan bir nazar edi. Kumush ham Otabekka bir zum tikildi, so'ng ko'zini olib qochdi. Lekin o'sha bir lahzada ikki yosh yurak orasida ko'zga ko'rinmas bir ipak tortilganini ikkalasi ham his qildi.

Hasanali do'stining ahvolini sezib, ichida kulib qo'ydi. U bu ikki yosh kishining taqdiri o'zaro bog'liq bo'lishini allaqachon his qilgan edi.`,
  },
  {
    title: "5-Bob. Xatlar",
    pageNumber: 6,
    text: `Otabek Toshkentga qaytgach, kunlar unga og'ir kechdi. Kumushning qiyofasi ko'z o'ngidan ketmasdi — ovqat yeyolmadi, uxlolmadi, kitob o'qishga ham ko'zi yetmadi. Hasanaliga xat yozdi, lekin so'zlarni topishga qiynaldi.

Nihoyat bir kuni Hasanali orqali javob xati keldi. Otabek xatni qo'lida tutganida qo'llari titrar, yuragi tez-tez urar edi. Xatni ohista ochdi. Kumushning nozik xatti bilan yozilgan so'zlarni ko'rdi: "Siz ketgach, bog'dagi qushlar ham jim qoldi..."

Bu so'zlar Otabekning yuragiga o't bo'lib tushdi. U xatni yuziga bosdi. Ko'zida yosh, lekin labida tabassum bor edi. Shu paytdan e'tiboran ikki yosh o'rtasida yashirin va ulug'vor muhabbat boshlanib ketdi.`,
  },
  {
    title: "6-Bob. Yusufbek hoji",
    pageNumber: 7,
    text: `Yusufbek hoji — Toshkentning taniqli va badavlat savdogarlaridan biri, lekin undan ham ko'proq — dono va adolatli bir ota edi. Oqsoqollar majlisida so'zi o'tardi, kambag'allar dardini tinglar, hech kimni xor qilmasdi.

O'g'li Otabekning ko'nglidagi sirni sezdi. Bir kuni o'g'lini yoniga chaqirib: "Yuragingda bir narsa bor, ochilib gapir," — dedi. Otabek avval tortindi, so'ng sekin-asta Kumush haqida so'zlab berdi.

Yusufbek hoji uzoq jim qoldi. Keyin: "Yaxshi qiz bo'lsa, Xudodan so'ra, men rozi," — dedi. O'sha kecha Otabek birinchi marta tinch uxladi. Otasining roziligi unga katta quvonch va kuch baxsh etdi.`,
  },
  {
    title: "7-Bob. Unashtiruv",
    pageNumber: 8,
    text: `Bahor keldi. Marg'ilon ko'chalari gul va yashillikka burkandi. Yusufbek hoji o'g'li bilan Marg'ilonga jo'nadi. Ziyo shohichining uyiga savob niyatida, lekin asl maqsad bilan kelishdi.

Ikki ota uzoq suhbatlashdi. Ziyo shohichi ham Otabekni yaxshi bilardi — yigitning odobini, bilimini, otasining obro'sini. U qizini bu uyga berishga rozi bo'ldi.

Xonaga Kumush kirib kelganida uning yuzi qizarib ketgan, ko'zlari pastga qarab turardi. Otabek bilan ko'zlari to'qnashganda ikkalasi ham labini qimirlatmadi — lekin yuraklar bir-biriga so'z berdi. Unashtiruv marosimi boshlandi. Katta dasturxon yozildi, duo o'qildi, xursandchilik to'ldi.`,
  },
  {
    title: "8-Bob. To'y",
    pageNumber: 9,
    text: `To'y — yetti kun, yetti kecha davom etdi. Marg'ilonning katta ko'chalarida surnay va doira ovozi yangradi. Mehmonlar uzoq-yaqindan keldi, dasturxonlar keng yozildi. Oshxonalarda palov damlanib, xushbo'y hid butun mahallaga taraldi.

Otabek to'y kechasi yuragidagi hayajonni bosishga urinardi. Kumush esa oq libosda, ko'zlarida uyat va quvonch aralash nazar bilan bir chetda o'tirardi.

Kelin ko'chib kelganda Yusufbek hoji ko'ziga yosh oldi — bu sevinchan yosh edi. O'g'lini baxtli ko'rish — ota uchun dunyodagi eng katta boylik. Shu kecha Otabek va Kumush uchun yangi hayot boshlandi — umid, mehr va bir-biriga bo'lgan cheksiz ishonch bilan to'la hayot.`,
  },
  {
    title: "9-Bob. Baxt va sinov",
    pageNumber: 10,
    text: `Nikohdan keyin Otabek va Kumushning hayoti go'zal boshlandi. Kumush — aqlli va mehribon xotin, uy bekasi sifatida qaynonasining hurmatini qozondi. Otabek savdo ishlarini olib borardi, lekin uyga kelganda butun vaqtini Kumushga bag'ishlardi.

Lekin taqdir har doim ham silliq yo'l tutmaydi. Oradan ko'p o'tmay, Otabekning hayotiga yangi sinov kirib keldi. Uning ustiga yopilib kelayotgan vaziyat — jaholat, atrofdagi odamlarning hasadi va fitna — ikki yosh qalbni siqib qo'ya boshladi.

Kumush barcha og'irliklarni jim ko'tardi. U er oldida doim xotirjam ko'rinishga urinardi — lekin yolg'iz qolganda ko'zyoshlarini to'xtatib bo'lmasdi. Ishq — bu faqat baxt emas, balki birga ko'tarish, birga yig'lash, birga sabr qilishdir.`,
  },
];

export default function FlipBookSection() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-20 bg-stone-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] -translate-x-1/2"></div>
        
      </div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-stone-900 font-serif mb-4 tracking-tight">{t("flipBook.readFree")}</h2>
          {t("flipBook.freeBooksDesc") && <p className="text-stone-600 text-lg font-medium mb-3">{t("flipBook.freeBooksDesc")}</p>}
          <AnimatedSectionDivider />
        </div>

        <div className="relative flex justify-center items-center">
          <div className="absolute inset-0 bg-gradient-radial from-black/10 via-black/5 to-transparent rounded-full transform scale-150"></div>

          <div className="relative transform-gpu perspective-1000">
            <div className="absolute left-1/2 top-4 -translate-x-1/2 w-[340px] h-[460px] bg-black/20 blur-xl rounded-lg transform rotate-x-60 scale-y-50"></div>
            <div className="absolute left-1/2 top-2 -translate-x-1/2 w-[335px] h-[455px] bg-black/15 blur-lg rounded-lg transform rotate-x-45 scale-y-60"></div>

            <div
              ref={(el) => {
                if (el) el.addEventListener("touchstart", () => {}, { passive: true });
              }}
              className="relative z-20 transform hover:scale-105 transition-transform duration-300 ease-out"
              style={{ touchAction: "none" }}
            >
              <HTMLFlipBook
                width={isMobile ? 280 : 320}
                height={isMobile ? 390 : 440}
                size="stretch"
                minWidth={isMobile ? 280 : 300}
                maxWidth={isMobile ? 320 : 360}
                minHeight={isMobile ? 380 : 420}
                maxHeight={isMobile ? 420 : 480}
                usePortrait={isMobile}
                maxShadowOpacity={0.8}
                showCover={!isMobile}
                startPage={isMobile ? 0 : 1}
                mobileScrollSupport={false}
                className="book-shadow"
                style={{
                  filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.3)) drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
                }}
                flippingTime={800}
                startZIndex={100}
                autoSize={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={50}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                <CoverPage />
                {pages.map((page, idx) => (
                  <Page
                    key={idx}
                    title={page.title}
                    text={page.text}
                    pageNumber={page.pageNumber}
                  />
                ))}
                <BackCover />
              </HTMLFlipBook>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

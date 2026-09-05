import { Book, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import HTMLFlipBook from "react-pageflip";
import AnimatedSectionDivider from "./AnimatedSectionDivider";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const Page = React.forwardRef(({ title, text, pageNumber, side }, ref) => {
  // react-pageflip clones this root element and overwrites its `style` prop
  // internally, so all real styling must live on a nested wrapper div instead.
  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          width: "100%", height: "100%",
          background: "var(--color-neutral-100)",
          boxShadow:
            side === "left"
              ? "inset -16px 0 20px -16px color-mix(in srgb, var(--color-neutral-900) 55%, transparent)"
              : "inset 16px 0 20px -16px color-mix(in srgb, var(--color-neutral-900) 55%, transparent)",
          borderRight: side === "left" ? "1px solid color-mix(in srgb, var(--color-text) 30%, transparent)" : "none",
          borderLeft: side === "right" ? "1px solid color-mix(in srgb, var(--color-text) 30%, transparent)" : "none",
          padding: "var(--space-6)",
          paddingRight: side === "left" ? "calc(var(--space-6) + var(--space-4))" : "var(--space-6)",
          paddingLeft: side === "right" ? "calc(var(--space-6) + var(--space-4))" : "var(--space-6)",
          display: "flex", flexDirection: "column",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {title && (
          <h5
            style={{
              flex: "none",
              borderBottom: "1px solid var(--color-divider)",
              paddingBottom: "var(--space-2)",
              marginBottom: "var(--space-2)",
            }}
          >
            {title}
          </h5>
        )}

        <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto" }}>
          {text.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: 12.5, lineHeight: 1.65, textAlign: "justify",
                textIndent: "1.5em", margin: "0 0 0.4em",
              }}
            >
              {para}
            </p>
          ))}
        </div>

        <div className="num text-muted" style={{ flex: "none", fontSize: 11, alignSelf: "flex-end", paddingTop: "var(--space-1)" }}>
          {pageNumber}
        </div>
      </div>
    </div>
  );
});

const CoverPage = React.forwardRef((props, ref) => (
  <div ref={ref} style={{ width: "100%", height: "100%" }}>
    <div
      style={{
        width: "100%", height: "100%", position: "relative", boxSizing: "border-box",
        background: "var(--color-neutral-900)",
        border: "1px solid var(--color-accent)",
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0, padding: "var(--space-6)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          color: "var(--color-neutral-100)", textAlign: "center",
        }}
      >
        <h1 style={{ fontWeight: 600, letterSpacing: "0.02em", color: "var(--color-neutral-100)" }}>
          O'tkan Kunlar
        </h1>

        <div className="flex items-center" style={{ gap: "var(--space-2)", margin: "var(--space-3) 0" }}>
          <span style={{ width: 40, height: 1, background: "var(--color-accent)" }} />
          <Book size={20} color="var(--color-accent)" />
          <span style={{ width: 40, height: 1, background: "var(--color-accent)" }} />
        </div>

        <p style={{ fontSize: 14, letterSpacing: "0.08em", color: "var(--color-accent)" }}>
          Abdulla Qodiriy
        </p>

        <div style={{ position: "absolute", bottom: "var(--space-4)", fontSize: 11, color: "var(--color-neutral-400)" }}>
          Toshkent — 1926
        </div>
      </div>

      <div style={{ position: "absolute", top: 8, left: 8, width: 18, height: 18, borderLeft: "1px solid var(--color-accent)", borderTop: "1px solid var(--color-accent)" }} />
      <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRight: "1px solid var(--color-accent)", borderTop: "1px solid var(--color-accent)" }} />
      <div style={{ position: "absolute", bottom: 8, left: 8, width: 18, height: 18, borderLeft: "1px solid var(--color-accent)", borderBottom: "1px solid var(--color-accent)" }} />
      <div style={{ position: "absolute", bottom: 8, right: 8, width: 18, height: 18, borderRight: "1px solid var(--color-accent)", borderBottom: "1px solid var(--color-accent)" }} />
    </div>
  </div>
));

const BackCover = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          width: "100%", height: "100%", boxSizing: "border-box",
          background: "var(--color-neutral-900)",
          border: "1px solid var(--color-accent)",
          color: "var(--color-neutral-100)",
          padding: "var(--space-6)",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}
      >
        <div className="text-center" style={{ marginBottom: "var(--space-6)" }}>
          <h5 style={{ color: "var(--color-neutral-100)", marginBottom: "var(--space-2)" }}>{t("flipBook.aboutWork")}</h5>
          <p style={{ fontSize: 12, lineHeight: 1.75, color: "var(--color-neutral-300)" }}>
            {t("flipBook.aboutWorkDesc")}
          </p>
        </div>
        <div className="text-center" style={{ marginTop: "auto" }}>
          <Book size={24} color="var(--color-accent)" style={{ margin: "0 auto var(--space-2)" }} />
          <p style={{ fontSize: 11, color: "var(--color-accent)" }}>
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
  const flipBookRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const goPrev = () => flipBookRef.current?.pageFlip()?.flipPrev();
  const goNext = () => flipBookRef.current?.pageFlip()?.flipNext();

  return (
    <section id="reader" style={{ padding: "var(--space-8) 0" }}>
      <div className="text-center" style={{ marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontWeight: 400 }}>{t("flipBook.readFree")}</h2>
        {t("flipBook.freeBooksDesc") && <p className="text-muted">{t("flipBook.freeBooksDesc")}</p>}
        <AnimatedSectionDivider />
      </div>

      <div className="flex justify-center items-center" style={{ gap: "var(--space-4)" }}>
        <button onClick={goPrev} className="btn btn-secondary btn-icon" aria-label="previous page">
          <ChevronLeft size={18} />
        </button>

        <div
          style={{
            border: "1px solid var(--color-divider)",
            background: "var(--color-neutral-100)",
            padding: "var(--space-2)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <HTMLFlipBook
            ref={flipBookRef}
            width={isMobile ? 300 : 360}
            height={isMobile ? 420 : 480}
            size="stretch"
            minWidth={isMobile ? 290 : 340}
            maxWidth={isMobile ? 340 : 440}
            minHeight={isMobile ? 400 : 460}
            maxHeight={isMobile ? 460 : 540}
            usePortrait={isMobile}
            maxShadowOpacity={0.3}
            showCover={!isMobile}
            startPage={isMobile ? 0 : 1}
            mobileScrollSupport={false}
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
                side={idx % 2 === 0 ? "left" : "right"}
              />
            ))}
            <BackCover />
          </HTMLFlipBook>
        </div>

        <button onClick={goNext} className="btn btn-secondary btn-icon" aria-label="next page">
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

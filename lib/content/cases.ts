import type { Lang } from "@/lib/lang";

export function casesContent(lang: Lang) {
  const isAr = lang === "ar";

  const t = isAr
    ? {
        pageTitle: "قصص نجاح تستحق أن تُروى",
        pageSub: "حالات حقيقية عبرت أصعب اللحظات بأمان — من الولادة بدون ألم إلى استئصال أعقد الأورام مع الحفاظ على الرحم.",
        tabSuccess: "قصص نجاح",
        tabCelebs: "المشاهير",
        ctaTitle: "قصتك القادمة تبدأ بموعد",
        photoPh: "أسقطي صورة هنا",
      }
    : {
        pageTitle: "Success stories worth telling",
        pageSub: "Real cases that crossed the hardest moments safely — from pain-free delivery to removing the most complex tumors while preserving the uterus.",
        tabSuccess: "Success Stories",
        tabCelebs: "Celebrities",
        ctaTitle: "Your next story starts with an appointment",
        photoPh: "Drop a photo here",
      };

  const success = isAr
    ? [
        { tag: "جراحة أورام", title: "استئصال ورم 14 كيلو أثناء الحمل مع الحفاظ على الجنين", excerpt: "كان أول حمل لي وكنا نطير فرحًا، لكن سرعان ما بدأت آلام شديدة ولاحظنا ازدياد حجم بطني بشكل غير طبيعي — حتى وجدنا اليد الأمينة." },
        { tag: "ولادة", title: "ولدت ابنتي بعد تجربة ولادة مبكرة فقدت فيها توأمي", excerpt: "بدأت معرفتي بالدكتور أحمد مرزوق في أصعب أيام حياتي، بعدما فقدت توأمًا في ولادة مبكرة — وانتهت بأجمل نهاية." },
        { tag: "جراحة أورام", title: "«توكلي على الله وواصلي الرحلة» — سارة من أسوان", excerpt: "تزوجت وأنا لا أعلم أن رحمي به ورمان ليفيان، وقيل لي إن استئصال الرحم هو الحل الوحيد — لكن القصة انتهت بحمل آمن." },
        { tag: "طوارئ", title: "استشارة الدكتور لأول مرة الساعة 3 فجرًا", excerpt: "قرار صائب بإجراء عملية استئصال الزائدة أثناء الحمل حفاظًا على الجنين — استجابة فورية في منتصف الليل." },
        { tag: "تشخيص نادر", title: "الوحيد الذي شخّص مرضي النادر", excerpt: "سنوات من النزيف الشديد وتنقل بين الأطباء بلا تشخيص — حتى وضع الدكتور يده على الحالة النادرة وعالجها." },
        { tag: "ولادة", title: "ولادة طبيعية بدون ألم في يوم مميز", excerpt: "حلم كل أم أن تحتضن طفلها وهي في أتم الصحة — تجربة ولادة هادئة بدون الخوف المتوارث من يوم الولادة." },
      ]
    : [
        { tag: "Tumor surgery", title: "14 kg tumor removed during pregnancy — fetus preserved", excerpt: "It was my first pregnancy and we were overjoyed — until severe pain began and my belly grew abnormally. Then we found the right hands." },
        { tag: "Delivery", title: "I delivered my daughter after losing twins in a premature birth", excerpt: "I met Dr. Ahmed Marzouk in the hardest days of my life, after losing twins in a premature delivery — and the story ended beautifully." },
        { tag: "Tumor surgery", title: "“Trust God and continue the journey” — Sara from Aswan", excerpt: "I married not knowing my uterus had two fibroids; hysterectomy was called the only option — but the story ended with a safe pregnancy." },
        { tag: "Emergency", title: "First consultation at 3 a.m.", excerpt: "The right call: an appendectomy during pregnancy to protect the fetus — an immediate response in the middle of the night." },
        { tag: "Rare diagnosis", title: "The only one who diagnosed my rare condition", excerpt: "Years of severe bleeding, moving between doctors with no diagnosis — until the doctor identified the rare condition and treated it." },
        { tag: "Delivery", title: "A pain-free natural birth on a special day", excerpt: "Every mother’s dream: to embrace her baby in full health — a calm delivery without the inherited fear of birth day." },
      ];

  const celebs = isAr
    ? [
        { tag: "مشاهير", title: "المطربة رنا سماحة وطلق الساعة 2 بعد منتصف الليل", excerpt: "بدأ الطلق المفاجئ الساعة 2 فجرًا ليأتي مالك بأحلى فرحة وبدون ألم على الإطلاق." },
        { tag: "مشاهير", title: "الموديل دعاء ياسر وولادة في شهرها الثامن", excerpt: "ولادة مبكرة في الشهر الثامن استدعت توجهًا سريعًا — وتمت القيصرية بدون ألم أو خوف." },
        { tag: "مشاهير", title: "المذيعة إنجي يحيى وأحلى توأم", excerpt: "مذيعة ON Sport وتوأمها عمر وكلارا بعد قيصرية بدون ألم واستكمال الحمل للشهر التاسع." },
        { tag: "مشاهير", title: "ولادة مالك ابن نجم منتخب مصر محمد مجدي", excerpt: "قفشة نجم الأهلي والمنتخب يحتفل بوصول مولوده مالك بدون توتر أو آلام ولادة." },
        { tag: "مشاهير", title: "الفنان محمود الليثي يستقبل مولوده بأحلى الضحكات", excerpt: "يضحك في أجمل لحظات حياته من داخل غرفة العمليات فجرًا عند ولادة ابنه البكر يونس." },
        { tag: "مشاهير", title: "الفنانة سامية عاطف بعد 8 سنين من الانتظار", excerpt: "داليدا التي وُلدت بعد 8 سنوات انتظار — ودموع الفرحة داخل غرفة العمليات بحضور الزوج." },
      ]
    : [
        { tag: "Celebrity", title: "Singer Rana Samaha — labor at 2 a.m.", excerpt: "Sudden labor began at 2 a.m., and Malek arrived with pure joy and no pain at all." },
        { tag: "Celebrity", title: "Model Doaa Yasser — delivery in her 8th month", excerpt: "A premature delivery in the 8th month required a rapid response — a cesarean without pain or fear." },
        { tag: "Celebrity", title: "Anchor Engy Yehia and the loveliest twins", excerpt: "The ON Sport anchor with twins Omar and Clara after a pain-free cesarean, reaching the 9th month safely." },
        { tag: "Celebrity", title: "Baby Malek — son of national team star Mohamed Magdy", excerpt: "“Afsha” of Al Ahly and Egypt celebrates his newborn without stress or labor pain." },
        { tag: "Celebrity", title: "Actor Mahmoud El-Leithy welcomes his baby with laughter", excerpt: "Laughing in the finest moment of his life inside the operating room at dawn, at the birth of his firstborn Younes." },
        { tag: "Celebrity", title: "Actress Samia Atef — after 8 years of waiting", excerpt: "Dalida, born after 8 years of waiting — tears of joy inside the operating room with her husband present." },
      ];

  return { t, success, celebs };
}

// Per-card visual styling derived from row parity (matches the original design).
export function caseCardStyle(index: number, tab: string) {
  const dark = index % 2 === 1;
  return {
    slotId: "case-" + tab + "-" + (index + 1),
    numStr: "0" + (index + 1),
    bg: dark ? "linear-gradient(150deg, #04202E 0%, #0A3950 60%, #0C4661 100%)" : "#ffffff",
    fg: dark ? "#ffffff" : "#0C3446",
    subC: dark ? "rgba(255,255,255,0.75)" : "#5B7A88",
    numC: dark ? "rgba(143,224,247,0.08)" : "rgba(48,182,222,0.1)",
    chipBg: dark ? "rgba(48,182,222,0.18)" : "rgba(48,182,222,0.12)",
    chipFg: dark ? "#8FE0F7" : "#1E92B8",
    imgGrad: dark
      ? "linear-gradient(180deg, rgba(4,32,46,0.12) 0%, rgba(4,32,46,0) 45%, rgba(4,32,46,0.35) 100%)"
      : "linear-gradient(180deg, rgba(4,32,46,0.06) 0%, rgba(4,32,46,0) 50%, rgba(4,32,46,0.18) 100%)",
  };
}

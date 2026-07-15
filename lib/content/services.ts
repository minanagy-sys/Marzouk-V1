import type { Lang } from "@/lib/lang";

const SPANS = [
  { gc: "span 2", gr: "span 2" },
  { gc: "auto", gr: "span 2" },
  { gc: "auto", gr: "auto" },
  { gc: "auto", gr: "auto" },
  { gc: "span 2", gr: "auto" },
  { gc: "span 2", gr: "auto" },
];

export function servicesContent(lang: Lang) {
  const isAr = lang === "ar";

  const t = isAr
    ? {
        pageTitle: "خدماتنا",
        pageSub: "رعاية متكاملة لصحة المرأة — من متابعة الحمل والولادة بدون ألم إلى أدق جراحات الأورام والتجميل النسائي.",
        ctaTitle: "غير متأكدة أي خدمة تناسبك؟",
        ctaBody: "تواصلي معنا وسيساعدك فريقنا في تحديد موعد الاستشارة المناسبة — ويمكن إجراء استشارة فيديو في حالات الأورام الليفية.",
        photoPh: "أسقطي صورة هنا",
      }
    : {
        pageTitle: "Our Services",
        pageSub: "Complete care for women’s health — from pregnancy follow-up and pain-free delivery to the most precise tumor and cosmetic surgeries.",
        ctaTitle: "Not sure which service fits you?",
        ctaBody: "Contact us and our team will help you schedule the right consultation — video consultations are available for fibroid cases.",
        photoPh: "Drop a photo here",
      };

  const base = isAr
    ? [
        { glyph: "⊕", tag: "ولادة", title: "الولادة القيصرية بدون ألم", desc: "ولادة قيصرية آمنة تجنب النساء المعرضات للخطر أي مضاعفات، بتقنيات حديثة تجعل التجربة بدون ألم وبأجمل الذكريات." },
        { glyph: "♡", tag: "ولادة", title: "الولادة الطبيعية بدون ألم", desc: "تجربة ولادة طبيعية هادئة بدون معاناة، مع متابعة دقيقة طوال فترة الحمل وحتى أول احتضان لطفلك." },
        { glyph: "❀", tag: "جراحة أورام", title: "استئصال الأورام الليفية المعقدة", desc: "استئصال الأورام المعقدة مع الحفاظ على الرحم — الخيار الأفضل لمن تعانين من الأعراض وترغبين في الإنجاب مستقبلًا." },
        { glyph: "✿", tag: "علاج تخصصي", title: "بطانة الرحم المهاجرة", desc: "تشخيص دقيق وعلاج متخصص لحالات بطانة الرحم المهاجرة، للتخلص من الألم المزمن واستعادة جودة الحياة." },
        { glyph: "✦", tag: "تجميل", title: "التجميل النسائي", desc: "جراحات تجميل نسائي دقيقة تعيد الثقة والراحة، بأحدث التقنيات وبخصوصية تامة." },
        { glyph: "⦿", tag: "تجميل", title: "شد البطن مع القيصرية", desc: "استعيدي رشاقة جسمك بعد الولادة مباشرةً — عملية شد البطن تُجرى مع القيصرية في جلسة واحدة." },
      ]
    : [
        { glyph: "⊕", tag: "Delivery", title: "Pain-Free Cesarean Delivery", desc: "A safe cesarean that protects at-risk mothers from complications — modern techniques for a pain-free experience and beautiful memories." },
        { glyph: "♡", tag: "Delivery", title: "Pain-Free Natural Delivery", desc: "A calm natural birth without suffering, with careful follow-up throughout pregnancy until your first embrace." },
        { glyph: "❀", tag: "Tumor surgery", title: "Complex Fibroid Removal", desc: "Removal of complex fibroids while preserving the uterus — the best option for women with symptoms who want children in the future." },
        { glyph: "✿", tag: "Specialized care", title: "Endometriosis Care", desc: "Precise diagnosis and specialized treatment for endometriosis — relief from chronic pain and a better quality of life." },
        { glyph: "✦", tag: "Cosmetic", title: "Cosmetic Gynecology", desc: "Precise cosmetic gynecology procedures that restore confidence and comfort, with full privacy and the latest techniques." },
        { glyph: "⦿", tag: "Cosmetic", title: "Tummy Tuck with Cesarean", desc: "Regain your figure right after delivery — a tummy tuck performed together with your cesarean in one session." },
      ];

  const services = base.map((s, i) => ({ ...s, ...(SPANS[i] || SPANS[2]), slotId: "svc-" + (i + 1) }));

  return { t, services };
}

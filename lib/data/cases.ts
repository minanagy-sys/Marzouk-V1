import type { CaseItem } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";
import { slugify } from "@/lib/admin/slug";

/** Cases seed — feeds the cases page and each /cases/[slug] story page. */
export const CASES_SEED: CaseItem[] = [
  {
    slug: "14kg-tumor-during-pregnancy",
    category: "success",
    tag: { ar: "جراحة أورام", en: "Tumor surgery" },
    title: { ar: "استئصال ورم 14 كيلو أثناء الحمل مع الحفاظ على الجنين", en: "14 kg tumor removed during pregnancy — fetus preserved" },
    excerpt: { ar: "كان أول حمل لي وكنا نطير فرحًا، لكن سرعان ما بدأت آلام شديدة ولاحظنا ازدياد حجم بطني بشكل غير طبيعي — حتى وجدنا اليد الأمينة.", en: "It was my first pregnancy and we were overjoyed — until severe pain began and my belly grew abnormally. Then we found the right hands." },
    body: { ar: "كان أول حمل لي وكنا نطير فرحًا، لكن سرعان ما بدأت آلام شديدة ولاحظنا ازدياد حجم بطني بشكل غير طبيعي. بعد التشخيص تبيّن وجود ورم كبير، وكان القرار الأصعب هو الحفاظ على الجنين أثناء استئصاله. بفضل الله ثم خبرة الفريق، تم استئصال ورم بوزن 14 كجم مع الحفاظ على الحمل حتى وصل مولودي بأمان.", en: "It was my first pregnancy and we were overjoyed, but severe pain soon began and my belly grew abnormally. Diagnosis revealed a large tumor, and the hardest decision was to preserve the fetus while removing it. Thanks to God and the team's experience, a 14 kg tumor was removed while the pregnancy continued safely until my baby arrived." },
  },
  {
    slug: "delivered-after-losing-twins",
    category: "success",
    tag: { ar: "ولادة", en: "Delivery" },
    title: { ar: "ولدت ابنتي بعد تجربة ولادة مبكرة فقدت فيها توأمي", en: "I delivered my daughter after losing twins in a premature birth" },
    excerpt: { ar: "بدأت معرفتي بالدكتور أحمد مرزوق في أصعب أيام حياتي، بعدما فقدت توأمًا في ولادة مبكرة — وانتهت بأجمل نهاية.", en: "I met Dr. Ahmed Marzouk in the hardest days of my life, after losing twins in a premature delivery — and the story ended beautifully." },
    body: { ar: "بدأت معرفتي بالدكتور في أصعب أيام حياتي بعد فقدان توأمي في ولادة مبكرة. تابع حالتي بدقة وصبر خلال الحمل التالي، ووضع خطة متكاملة لضمان استمراره بأمان حتى وصلت ابنتي إلى الدنيا بصحة جيدة.", en: "I met the doctor in the hardest days of my life after losing my twins in a premature birth. He followed my case carefully and patiently through the next pregnancy, with a complete plan to keep it safe until my daughter arrived healthy." },
  },
  {
    slug: "sara-from-aswan",
    category: "success",
    tag: { ar: "جراحة أورام", en: "Tumor surgery" },
    title: { ar: "«توكلي على الله وواصلي الرحلة» — سارة من أسوان", en: "“Trust God and continue the journey” — Sara from Aswan" },
    excerpt: { ar: "تزوجت وأنا لا أعلم أن رحمي به ورمان ليفيان، وقيل لي إن استئصال الرحم هو الحل الوحيد — لكن القصة انتهت بحمل آمن.", en: "I married not knowing my uterus had two fibroids; hysterectomy was called the only option — but the story ended with a safe pregnancy." },
    body: { ar: "تزوجت دون أن أعلم بوجود ورمين ليفيين، وقيل لي إن استئصال الرحم هو الحل الوحيد. لكن بعد استشارة الدكتور تم استئصال الورمين مع الحفاظ على الرحم، وانتهت رحلتي بحمل آمن بعد أن كدت أفقد الأمل.", en: "I married unaware of two fibroids, and was told a hysterectomy was the only option. After consulting the doctor, both fibroids were removed while preserving the uterus, and my journey ended with a safe pregnancy after I had nearly lost hope." },
  },
  {
    slug: "3am-consultation",
    category: "success",
    tag: { ar: "طوارئ", en: "Emergency" },
    title: { ar: "استشارة الدكتور لأول مرة الساعة 3 فجرًا", en: "First consultation at 3 a.m." },
    excerpt: { ar: "قرار صائب بإجراء عملية استئصال الزائدة أثناء الحمل حفاظًا على الجنين — استجابة فورية في منتصف الليل.", en: "The right call: an appendectomy during pregnancy to protect the fetus — an immediate response in the middle of the night." },
    body: { ar: "في منتصف الليل بدأت آلام حادة، وكانت الاستجابة فورية. القرار الصائب باستئصال الزائدة أثناء الحمل حفظ الجنين وتجنّب مضاعفات خطيرة، وهو مثال على الرعاية في الطوارئ في أي وقت.", en: "In the middle of the night, sharp pain began and the response was immediate. The right decision to remove the appendix during pregnancy protected the fetus and avoided serious complications — an example of emergency care at any hour." },
  },
  {
    slug: "rare-diagnosis",
    category: "success",
    tag: { ar: "تشخيص نادر", en: "Rare diagnosis" },
    title: { ar: "الوحيد الذي شخّص مرضي النادر", en: "The only one who diagnosed my rare condition" },
    excerpt: { ar: "سنوات من النزيف الشديد وتنقل بين الأطباء بلا تشخيص — حتى وضع الدكتور يده على الحالة النادرة وعالجها.", en: "Years of severe bleeding, moving between doctors with no diagnosis — until the doctor identified the rare condition and treated it." },
    body: { ar: "عانيت سنوات من النزيف الشديد وتنقلت بين الأطباء دون تشخيص واضح. الخبرة المتخصصة مكّنت الدكتور من تحديد الحالة النادرة وعلاجها، لتعود إليّ حياتي الطبيعية أخيرًا.", en: "I suffered years of severe bleeding and moved between doctors with no clear diagnosis. Specialized experience allowed the doctor to identify and treat the rare condition, and my normal life finally returned." },
  },
  {
    slug: "pain-free-natural-birth-story",
    category: "success",
    tag: { ar: "ولادة", en: "Delivery" },
    title: { ar: "ولادة طبيعية بدون ألم في يوم مميز", en: "A pain-free natural birth on a special day" },
    excerpt: { ar: "حلم كل أم أن تحتضن طفلها وهي في أتم الصحة — تجربة ولادة هادئة بدون الخوف المتوارث من يوم الولادة.", en: "Every mother’s dream: to embrace her baby in full health — a calm delivery without the inherited fear of birth day." },
    body: { ar: "كنت أخشى يوم الولادة كما تخشاه كل أم، لكن التجربة كانت هادئة وبدون ألم. احتضنت طفلي وأنا في أتم صحتي، وتغيّرت نظرتي تمامًا لتجربة الولادة.", en: "I feared birth day as every mother does, but the experience was calm and pain-free. I embraced my baby in full health, and my view of childbirth changed completely." },
  },
  {
    slug: "rana-samaha",
    category: "celebrity",
    tag: { ar: "مشاهير", en: "Celebrity" },
    title: { ar: "المطربة رنا سماحة وطلق الساعة 2 بعد منتصف الليل", en: "Singer Rana Samaha — labor at 2 a.m." },
    excerpt: { ar: "بدأ الطلق المفاجئ الساعة 2 فجرًا ليأتي مالك بأحلى فرحة وبدون ألم على الإطلاق.", en: "Sudden labor began at 2 a.m., and Malek arrived with pure joy and no pain at all." },
    body: { ar: "بدأ الطلق المفاجئ في الثانية فجرًا، وكانت الاستجابة سريعة ومطمئنة. جاء مالك بأحلى فرحة وبدون ألم على الإطلاق، في تجربة ولادة لا تُنسى.", en: "Sudden labor began at 2 a.m., and the response was swift and reassuring. Malek arrived with pure joy and no pain at all, in an unforgettable delivery." },
  },
  {
    slug: "doaa-yasser",
    category: "celebrity",
    tag: { ar: "مشاهير", en: "Celebrity" },
    title: { ar: "الموديل دعاء ياسر وولادة في شهرها الثامن", en: "Model Doaa Yasser — delivery in her 8th month" },
    excerpt: { ar: "ولادة مبكرة في الشهر الثامن استدعت توجهًا سريعًا — وتمت القيصرية بدون ألم أو خوف.", en: "A premature delivery in the 8th month required a rapid response — a cesarean without pain or fear." },
    body: { ar: "استدعت الولادة المبكرة في الشهر الثامن توجهًا سريعًا للعيادة. تمت القيصرية بدون ألم أو خوف، وبمتابعة دقيقة للأم والمولود بعد الولادة.", en: "The premature delivery in the eighth month required a rapid response. The cesarean was done without pain or fear, with careful follow-up for mother and baby afterward." },
  },
  {
    slug: "engy-yehia",
    category: "celebrity",
    tag: { ar: "مشاهير", en: "Celebrity" },
    title: { ar: "المذيعة إنجي يحيى وأحلى توأم", en: "Anchor Engy Yehia and the loveliest twins" },
    excerpt: { ar: "مذيعة ON Sport وتوأمها عمر وكلارا بعد قيصرية بدون ألم واستكمال الحمل للشهر التاسع.", en: "The ON Sport anchor with twins Omar and Clara after a pain-free cesarean, reaching the 9th month safely." },
    body: { ar: "استكملت مذيعة ON Sport حملها بتوأم حتى الشهر التاسع بمتابعة دقيقة، ثم تمت القيصرية بدون ألم ليأتي عمر وكلارا بصحة جيدة.", en: "The ON Sport anchor carried her twins safely to the ninth month with careful follow-up, then a pain-free cesarean brought Omar and Clara in good health." },
  },
  {
    slug: "mohamed-magdy",
    category: "celebrity",
    tag: { ar: "مشاهير", en: "Celebrity" },
    title: { ar: "ولادة مالك ابن نجم منتخب مصر محمد مجدي", en: "Baby Malek — son of national team star Mohamed Magdy" },
    excerpt: { ar: "قفشة نجم الأهلي والمنتخب يحتفل بوصول مولوده مالك بدون توتر أو آلام ولادة.", en: "“Afsha” of Al Ahly and Egypt celebrates his newborn without stress or labor pain." },
    body: { ar: "احتفل نجم الأهلي والمنتخب محمد مجدي «قفشة» بوصول مولوده مالك في تجربة ولادة هادئة بدون توتر أو آلام، بمتابعة كاملة للأم والطفل.", en: "Al Ahly and Egypt star Mohamed Magdy “Afsha” celebrated his newborn Malek in a calm delivery without stress or pain, with full follow-up for mother and child." },
  },
  {
    slug: "mahmoud-el-leithy",
    category: "celebrity",
    tag: { ar: "مشاهير", en: "Celebrity" },
    title: { ar: "الفنان محمود الليثي يستقبل مولوده بأحلى الضحكات", en: "Actor Mahmoud El-Leithy welcomes his baby with laughter" },
    excerpt: { ar: "يضحك في أجمل لحظات حياته من داخل غرفة العمليات فجرًا عند ولادة ابنه البكر يونس.", en: "Laughing in the finest moment of his life inside the operating room at dawn, at the birth of his firstborn Younes." },
    body: { ar: "من داخل غرفة العمليات فجرًا، عاش الفنان محمود الليثي أجمل لحظات حياته بضحكات لا تنسى عند ولادة ابنه البكر يونس في تجربة آمنة ومطمئنة.", en: "From inside the operating room at dawn, actor Mahmoud El-Leithy lived the finest moment of his life with unforgettable laughter at the birth of his firstborn Younes, in a safe and reassuring experience." },
  },
  {
    slug: "samia-atef",
    category: "celebrity",
    tag: { ar: "مشاهير", en: "Celebrity" },
    title: { ar: "الفنانة سامية عاطف بعد 8 سنين من الانتظار", en: "Actress Samia Atef — after 8 years of waiting" },
    excerpt: { ar: "داليدا التي وُلدت بعد 8 سنوات انتظار — ودموع الفرحة داخل غرفة العمليات بحضور الزوج.", en: "Dalida, born after 8 years of waiting — tears of joy inside the operating room with her husband present." },
    body: { ar: "بعد 8 سنوات من الانتظار، جاءت داليدا لتملأ حياة الفنانة سامية عاطف بالفرح. كانت دموع الفرحة داخل غرفة العمليات بحضور الزوج لحظة لا تُنسى.", en: "After 8 years of waiting, Dalida came to fill actress Samia Atef's life with joy. The tears of happiness inside the operating room with her husband present were an unforgettable moment." },
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToCase(r: any): CaseItem {
  return {
    slug: r.slug,
    slugAr: r.slug_ar ?? undefined,
    slugEn: r.slug_en ?? undefined,
    category: r.category === "celebrity" ? "celebrity" : "success",
    imageUrl: r.image_url ?? undefined,
    tag: { ar: r.tag_ar ?? "", en: r.tag_en ?? "" },
    title: { ar: r.title_ar ?? "", en: r.title_en ?? "" },
    excerpt: { ar: r.excerpt_ar ?? "", en: r.excerpt_en ?? "" },
    body: { ar: r.body_ar ?? "", en: r.body_en ?? "" },
    showOnHome: r.show_on_home ?? true,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const CASES_SEED_SLUGS: CaseItem[] = CASES_SEED.map((c) => ({ ...c, slugAr: c.slugAr || slugify(c.title.ar), slugEn: c.slugEn || c.slug }));

export async function getCases(): Promise<CaseItem[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return CASES_SEED_SLUGS;
  const { data, error } = await supabase.from("cases").select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return CASES_SEED_SLUGS;
  return data.map(rowToCase);
}

/** Celebrity cases flagged to appear in the home celebrities slider. */
export async function getHomeCelebrities(): Promise<CaseItem[]> {
  const cases = await getCases();
  return cases.filter((c) => c.category === "celebrity" && c.showOnHome !== false);
}

export async function getCase(slug: string): Promise<CaseItem | undefined> {
  const all = await getCases();
  return all.find((c) => c.slug === slug || c.slugAr === slug || c.slugEn === slug);
}

/** { lang, slug } params for static generation — ASCII only (Arabic slugs render on-demand). */
export async function getCaseParams(): Promise<{ lang: string; slug: string }[]> {
  const all = await getCases();
  return all
    .flatMap((c) => [
      { lang: "ar", slug: c.slugAr || c.slug },
      { lang: "en", slug: c.slugEn || c.slug },
    ])
    .filter((p) => /^[\x20-\x7E]*$/.test(p.slug));
}

import type { Lang } from "@/lib/lang";
import type { Service } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";

const SPANS = [
  { gc: "span 2", gr: "span 2" },
  { gc: "auto", gr: "span 2" },
  { gc: "auto", gr: "auto" },
  { gc: "auto", gr: "auto" },
  { gc: "span 2", gr: "auto" },
  { gc: "span 2", gr: "auto" },
];

/**
 * Seed content — the single source that feeds the home grid, the services page
 * and each /services/[slug] pillar page. Also used as the fallback when
 * Supabase isn't configured, and as the seed for the `services` table.
 */
export const SERVICES_SEED: Service[] = [
  {
    slug: "pain-free-cesarean",
    slotId: "svc-1",
    glyph: "⊕",
    gc: SPANS[0].gc, gr: SPANS[0].gr,
    tag: { ar: "ولادة", en: "Delivery" },
    title: { ar: "الولادة القيصرية بدون ألم", en: "Pain-Free Cesarean Delivery" },
    shortDesc: {
      ar: "ولادة قيصرية آمنة تجنب النساء المعرضات للخطر أي مضاعفات، بتقنيات حديثة تجعل التجربة بدون ألم وبأجمل الذكريات.",
      en: "A safe cesarean that protects at-risk mothers from complications — modern techniques for a pain-free experience and beautiful memories.",
    },
    heroSub: {
      ar: "تجربة قيصرية آمنة ومطمئنة بدون ألم، بأحدث التقنيات التي تحفظ لكِ أجمل لحظات استقبال طفلك.",
      en: "A safe, reassuring cesarean experience without pain — the latest techniques that preserve your most beautiful first moments.",
    },
    intro: {
      ar: "الولادة القيصرية بدون ألم هي خيار آمن ومدروس للنساء اللاتي تستدعي حالتهن الطبية إجراء قيصرية، سواء لأسباب متعلقة بوضع الجنين أو صحة الأم. نحرص على أن تكون التجربة خالية من الألم والتوتر قدر الإمكان، مع أعلى معايير الأمان للأم والجنين.",
      en: "Pain-free cesarean delivery is a safe, well-considered option for women whose medical condition calls for a cesarean — whether due to the baby's position or the mother's health. We make the experience as free of pain and anxiety as possible, with the highest safety standards for both mother and baby.",
    },
    sections: [
      {
        heading: { ar: "متى تُنصح القيصرية؟", en: "When is a cesarean recommended?" },
        body: {
          ar: "تُنصح القيصرية في حالات مثل وضع الجنين المقعدي، أو تعدد الأجنة، أو بعض حالات المشيمة، أو عندما تكون الولادة الطبيعية غير آمنة للأم أو الجنين. يتم اتخاذ القرار بعد تقييم دقيق وشرح كامل لكل الخيارات.",
          en: "A cesarean is advised in cases such as a breech baby, multiple pregnancies, certain placenta conditions, or when natural delivery isn't safe for mother or baby. The decision is made after careful assessment and a full explanation of every option.",
        },
      },
      {
        heading: { ar: "كيف نجعلها بدون ألم؟", en: "How we make it pain-free" },
        body: {
          ar: "نعتمد على تقنيات التخدير الحديثة التي تسمح للأم بالبقاء واعية أثناء الولادة والاستمتاع بلحظة استقبال طفلها، مع إدارة دقيقة للألم بعد العملية لتعافٍ سريع ومريح.",
          en: "We rely on modern anesthesia techniques that let the mother stay awake and enjoy meeting her baby, with careful post-operative pain management for a fast, comfortable recovery.",
        },
      },
      {
        heading: { ar: "التعافي بعد الولادة", en: "Recovery after delivery" },
        body: {
          ar: "نضع خطة تعافٍ فردية لكل أم تشمل المتابعة الدقيقة للجرح، ونصائح الحركة المبكرة الآمنة، والدعم الكامل خلال الأيام الأولى لضمان عودة سريعة لحياتك الطبيعية.",
          en: "We set an individual recovery plan for each mother — careful wound follow-up, safe early-mobility guidance, and full support through the first days for a quick return to normal life.",
        },
      },
    ],
    benefits: [
      { ar: "تجربة بدون ألم من أول لحظة", en: "A pain-free experience from the first moment" },
      { ar: "أعلى معايير الأمان للأم والجنين", en: "Highest safety standards for mother and baby" },
      { ar: "إمكانية إجراء شد البطن مع القيصرية", en: "Option to combine a tummy tuck with the cesarean" },
      { ar: "متابعة دقيقة وتعافٍ سريع", en: "Careful follow-up and rapid recovery" },
    ],
    faq: [
      {
        q: { ar: "هل القيصرية بدون ألم آمنة؟", en: "Is a pain-free cesarean safe?" },
        a: { ar: "نعم، عند إجرائها على يد فريق متخصص وفي بيئة مجهزة، تُعد من أكثر الإجراءات أمانًا.", en: "Yes — performed by a specialized team in a fully equipped setting, it is among the safest procedures." },
      },
      {
        q: { ar: "متى أستطيع العودة لنشاطي الطبيعي؟", en: "When can I return to normal activity?" },
        a: { ar: "تتعافى معظم الأمهات تدريجيًا خلال أسابيع قليلة مع اتباع خطة التعافي الموصى بها.", en: "Most mothers recover gradually over a few weeks by following the recommended recovery plan." },
      },
      {
        q: { ar: "هل يمكن حضور زوجي؟", en: "Can my husband attend?" },
        a: { ar: "نناقش معكِ كل التفاصيل مسبقًا لتوفير تجربة مطمئنة تناسب رغباتك قدر الإمكان.", en: "We discuss every detail with you in advance to provide a reassuring experience that fits your wishes as much as possible." },
      },
    ],
    metaTitle: { ar: "الولادة القيصرية بدون ألم | د. أحمد مرزوق", en: "Pain-Free Cesarean Delivery | Dr. Ahmed Marzouk" },
    metaDesc: {
      ar: "ولادة قيصرية بدون ألم بأحدث تقنيات التخدير وأعلى معايير الأمان مع د. أحمد مرزوق — استشاري النساء والتوليد.",
      en: "Pain-free cesarean delivery with the latest anesthesia techniques and highest safety standards with Dr. Ahmed Marzouk, OB-GYN consultant.",
    },
  },
  {
    slug: "pain-free-natural-birth",
    slotId: "svc-2",
    glyph: "♡",
    gc: SPANS[1].gc, gr: SPANS[1].gr,
    tag: { ar: "ولادة", en: "Delivery" },
    title: { ar: "الولادة الطبيعية بدون ألم", en: "Pain-Free Natural Delivery" },
    shortDesc: {
      ar: "تجربة ولادة طبيعية هادئة بدون معاناة، مع متابعة دقيقة طوال فترة الحمل وحتى أول احتضان لطفلك.",
      en: "A calm natural birth without suffering, with careful follow-up throughout pregnancy until your first embrace.",
    },
    heroSub: {
      ar: "ولادة طبيعية هادئة بدون معاناة، مع متابعة دقيقة قبل الولادة وحتى أول احتضان.",
      en: "A calm natural birth without suffering, with careful follow-up through the first embrace.",
    },
    intro: {
      ar: "نؤمن أن الولادة الطبيعية يمكن أن تكون تجربة هادئة وجميلة بدلًا من أن تكون مصدرًا للخوف. من خلال التخدير النصفي (الإبيدورال) والمتابعة الدقيقة، نساعدك على المرور بتجربة ولادة آمنة وبأقل قدر ممكن من الألم.",
      en: "We believe natural birth can be a calm, beautiful experience rather than a source of fear. Through epidural anesthesia and careful monitoring, we help you go through a safe delivery with the least pain possible.",
    },
    sections: [
      {
        heading: { ar: "التخدير النصفي (الإبيدورال)", en: "Epidural anesthesia" },
        body: {
          ar: "يسمح لكِ التخدير النصفي بالبقاء واعية ومشاركة في لحظة الولادة مع تخفيف الألم بشكل كبير، وهو آمن على الأم والجنين عند تطبيقه بشكل صحيح.",
          en: "The epidural lets you stay awake and part of the moment while greatly relieving pain — safe for mother and baby when applied correctly.",
        },
      },
      {
        heading: { ar: "متابعة الحمل حتى الولادة", en: "Follow-up until delivery" },
        body: {
          ar: "نتابع معكِ الحمل شهرًا بشهر لضمان جاهزيتك ليوم الولادة، مع خطة واضحة لكل مرحلة وطمأنة مستمرة.",
          en: "We follow your pregnancy month by month to ensure you're ready for delivery day, with a clear plan for each stage and continuous reassurance.",
        },
      },
      {
        heading: { ar: "بيئة داعمة ومطمئنة", en: "A supportive, reassuring environment" },
        body: {
          ar: "نوفر بيئة هادئة ودعمًا كاملًا قبل وأثناء وبعد الولادة، لأن راحتك النفسية جزء أساسي من التجربة.",
          en: "We provide a calm environment and full support before, during and after birth — your peace of mind is an essential part of the experience.",
        },
      },
    ],
    benefits: [
      { ar: "ألم أقل وتجربة أكثر هدوءًا", en: "Less pain and a calmer experience" },
      { ar: "بقاؤك واعية أثناء الولادة", en: "Staying awake during birth" },
      { ar: "متابعة دقيقة طوال الحمل", en: "Careful follow-up throughout pregnancy" },
      { ar: "تعافٍ أسرع من القيصرية عادةً", en: "Usually faster recovery than a cesarean" },
    ],
    faq: [
      {
        q: { ar: "هل الإبيدورال يؤثر على الطفل؟", en: "Does the epidural affect the baby?" },
        a: { ar: "عند تطبيقه بشكل صحيح فهو آمن ولا يؤثر سلبًا على الطفل.", en: "When applied correctly it is safe and does not harm the baby." },
      },
      {
        q: { ar: "هل يمكنني اختيار الولادة الطبيعية؟", en: "Can I choose natural birth?" },
        a: { ar: "نقيّم حالتك ونناقش الخيار الأنسب لكِ ولطفلك معًا.", en: "We assess your case and discuss the most suitable option for you and your baby together." },
      },
      {
        q: { ar: "متى أذهب للعيادة عند بدء الطلق؟", en: "When should I come in when labor starts?" },
        a: { ar: "نعطيكِ إرشادات واضحة مسبقًا حول علامات الولادة ومتى تتوجهين إلينا.", en: "We give you clear guidance in advance about the signs of labor and when to come in." },
      },
    ],
    metaTitle: { ar: "الولادة الطبيعية بدون ألم | د. أحمد مرزوق", en: "Pain-Free Natural Delivery | Dr. Ahmed Marzouk" },
    metaDesc: {
      ar: "ولادة طبيعية بدون ألم بالتخدير النصفي ومتابعة دقيقة للحمل مع د. أحمد مرزوق.",
      en: "Pain-free natural delivery with epidural anesthesia and careful pregnancy follow-up with Dr. Ahmed Marzouk.",
    },
  },
  {
    slug: "complex-fibroid-removal",
    slotId: "svc-3",
    glyph: "❀",
    gc: SPANS[2].gc, gr: SPANS[2].gr,
    tag: { ar: "جراحة أورام", en: "Tumor surgery" },
    title: { ar: "استئصال الأورام الليفية المعقدة", en: "Complex Fibroid Removal" },
    shortDesc: {
      ar: "استئصال الأورام المعقدة مع الحفاظ على الرحم — الخيار الأفضل لمن تعانين من الأعراض وترغبين في الإنجاب مستقبلًا.",
      en: "Removal of complex fibroids while preserving the uterus — the best option for women with symptoms who want children in the future.",
    },
    heroSub: {
      ar: "مهارة نادرة في استئصال الأورام الليفية المعقدة مع الحفاظ على الرحم والقدرة على الإنجاب.",
      en: "Rare skill in removing complex fibroids while preserving the uterus and fertility.",
    },
    intro: {
      ar: "الأورام الليفية أورام حميدة شائعة، لكن بعض الحالات المعقدة تتطلب خبرة جراحية نادرة لاستئصالها مع الحفاظ على الرحم والقدرة على الإنجاب. نتميز بمهارة عالية في أصعب هذه الحالات.",
      en: "Fibroids are common benign tumors, but some complex cases require rare surgical skill to remove them while preserving the uterus and fertility. We are distinguished by high skill in the most difficult of these cases.",
    },
    sections: [
      {
        heading: { ar: "متى يجب التدخل؟", en: "When is surgery needed?" },
        body: {
          ar: "يصبح التدخل ضروريًا عند وجود نزيف غزير، أو آلام مستمرة، أو تأثير على الخصوبة أو على الحمل. نقيّم كل حالة على حدة قبل اتخاذ القرار.",
          en: "Surgery becomes necessary with heavy bleeding, persistent pain, or an effect on fertility or pregnancy. We assess each case individually before deciding.",
        },
      },
      {
        heading: { ar: "الحفاظ على الرحم", en: "Preserving the uterus" },
        body: {
          ar: "هدفنا الأول في الحالات المناسبة هو استئصال الورم مع الحفاظ على الرحم، لتظل قدرتك على الإنجاب محفوظة حتى بعد إزالة أورام كبيرة أو معقدة.",
          en: "Our primary goal in suitable cases is to remove the fibroid while preserving the uterus, keeping your fertility intact even after removing large or complex tumors.",
        },
      },
      {
        heading: { ar: "خبرة في الحالات النادرة", en: "Experience with rare cases" },
        body: {
          ar: "من بين إنجازاتنا استئصال ورم بوزن 14 كجم مع الحفاظ على الجنين — دليل على القدرة على التعامل مع أصعب الحالات بأمان.",
          en: "Among our milestones is removing a 14 kg tumor while preserving the fetus — proof of the ability to handle the hardest cases safely.",
        },
      },
    ],
    benefits: [
      { ar: "الحفاظ على الرحم والقدرة على الإنجاب", en: "Preserving the uterus and fertility" },
      { ar: "خبرة في أصعب وأكبر الحالات", en: "Experience with the hardest, largest cases" },
      { ar: "تخفيف الأعراض والنزيف", en: "Relief from symptoms and bleeding" },
      { ar: "خطة علاج فردية لكل حالة", en: "An individual treatment plan for each case" },
    ],
    faq: [
      {
        q: { ar: "هل سأتمكن من الإنجاب بعد العملية؟", en: "Will I be able to conceive after surgery?" },
        a: { ar: "في الحالات المناسبة نحافظ على الرحم لتظل فرص الإنجاب قائمة.", en: "In suitable cases we preserve the uterus so fertility remains possible." },
      },
      {
        q: { ar: "هل كل الأورام الليفية تحتاج جراحة؟", en: "Do all fibroids need surgery?" },
        a: { ar: "لا، كثير منها لا يسبب أعراضًا. الجراحة للحالات التي تسبب مشاكل فقط.", en: "No — many cause no symptoms. Surgery is only for those causing problems." },
      },
      {
        q: { ar: "هل الاستشارة عن بُعد متاحة؟", en: "Is a remote consultation available?" },
        a: { ar: "نعم، تتوفر استشارة فيديو لحالات الأورام الليفية توفيرًا للوقت والمسافة.", en: "Yes — video consultations are available for fibroid cases, saving time and distance." },
      },
    ],
    metaTitle: { ar: "استئصال الأورام الليفية المعقدة | د. أحمد مرزوق", en: "Complex Fibroid Removal | Dr. Ahmed Marzouk" },
    metaDesc: {
      ar: "استئصال الأورام الليفية المعقدة مع الحفاظ على الرحم والقدرة على الإنجاب مع د. أحمد مرزوق.",
      en: "Complex fibroid removal while preserving the uterus and fertility with Dr. Ahmed Marzouk.",
    },
  },
  {
    slug: "endometriosis-care",
    slotId: "svc-4",
    glyph: "✿",
    gc: SPANS[3].gc, gr: SPANS[3].gr,
    tag: { ar: "علاج تخصصي", en: "Specialized care" },
    title: { ar: "بطانة الرحم المهاجرة", en: "Endometriosis Care" },
    shortDesc: {
      ar: "تشخيص دقيق وعلاج متخصص لحالات بطانة الرحم المهاجرة، للتخلص من الألم المزمن واستعادة جودة الحياة.",
      en: "Precise diagnosis and specialized treatment for endometriosis — relief from chronic pain and a better quality of life.",
    },
    heroSub: {
      ar: "تشخيص دقيق وعلاج متخصص لبطانة الرحم المهاجرة لاستعادة جودة حياتك.",
      en: "Precise diagnosis and specialized treatment for endometriosis to restore your quality of life.",
    },
    intro: {
      ar: "بطانة الرحم المهاجرة حالة مزمنة كثيرًا ما يتأخر تشخيصها لسنوات. نقدم تشخيصًا دقيقًا وخطة علاج متخصصة تهدف إلى التخلص من الألم المزمن وتحسين فرص الإنجاب.",
      en: "Endometriosis is a chronic condition whose diagnosis is often delayed for years. We provide accurate diagnosis and a specialized treatment plan aimed at relieving chronic pain and improving fertility prospects.",
    },
    sections: [
      {
        heading: { ar: "لماذا يتأخر التشخيص؟", en: "Why is diagnosis delayed?" },
        body: {
          ar: "غالبًا ما تُنسب الأعراض خطأً إلى آلام الدورة الطبيعية، فيتأخر التشخيص. الخبرة المتخصصة تُحدث فرقًا كبيرًا في اكتشاف الحالة مبكرًا.",
          en: "Symptoms are often wrongly attributed to normal period pain, so diagnosis is delayed. Specialized experience makes a big difference in catching it early.",
        },
      },
      {
        heading: { ar: "خيارات العلاج", en: "Treatment options" },
        body: {
          ar: "تتراوح خيارات العلاج بين الأدوية والتدخل الجراحي حسب شدة الحالة ورغبتك في الإنجاب، وتُوضع الخطة بالتشاور الكامل معكِ.",
          en: "Treatment ranges from medication to surgery depending on severity and your fertility goals, with the plan set in full consultation with you.",
        },
      },
      {
        heading: { ar: "الألم ليس قدرًا", en: "Pain is not inevitable" },
        body: {
          ar: "آلام الدورة الشديدة ليست أمرًا طبيعيًا دائمًا. العلاج المناسب يمكن أن يعيد لكِ حياة أكثر راحة.",
          en: "Severe period pain is not always normal. The right treatment can give you a more comfortable life.",
        },
      },
    ],
    benefits: [
      { ar: "تشخيص دقيق ومبكر", en: "Accurate, early diagnosis" },
      { ar: "تخفيف الألم المزمن", en: "Relief from chronic pain" },
      { ar: "تحسين فرص الإنجاب", en: "Improved fertility prospects" },
      { ar: "خطة علاج مخصصة", en: "A tailored treatment plan" },
    ],
    faq: [
      {
        q: { ar: "ما أعراض بطانة الرحم المهاجرة؟", en: "What are the symptoms of endometriosis?" },
        a: { ar: "أبرزها آلام الدورة الشديدة وآلام الحوض المزمنة وأحيانًا صعوبة الحمل.", en: "The most prominent are severe period pain, chronic pelvic pain, and sometimes difficulty conceiving." },
      },
      {
        q: { ar: "هل يمكن علاجها بدون جراحة؟", en: "Can it be treated without surgery?" },
        a: { ar: "في كثير من الحالات نعم، عبر الأدوية والمتابعة، حسب شدة الحالة.", en: "In many cases yes, through medication and follow-up, depending on severity." },
      },
      {
        q: { ar: "هل تؤثر على الحمل؟", en: "Does it affect pregnancy?" },
        a: { ar: "قد تؤثر على الخصوبة، لكن العلاج المناسب يحسّن الفرص كثيرًا.", en: "It can affect fertility, but the right treatment greatly improves the chances." },
      },
    ],
    metaTitle: { ar: "علاج بطانة الرحم المهاجرة | د. أحمد مرزوق", en: "Endometriosis Care | Dr. Ahmed Marzouk" },
    metaDesc: {
      ar: "تشخيص وعلاج بطانة الرحم المهاجرة للتخلص من الألم المزمن مع د. أحمد مرزوق.",
      en: "Diagnosis and treatment of endometriosis to relieve chronic pain with Dr. Ahmed Marzouk.",
    },
  },
  {
    slug: "cosmetic-gynecology",
    slotId: "svc-5",
    glyph: "✦",
    gc: SPANS[4].gc, gr: SPANS[4].gr,
    tag: { ar: "تجميل", en: "Cosmetic" },
    title: { ar: "التجميل النسائي", en: "Cosmetic Gynecology" },
    shortDesc: {
      ar: "جراحات تجميل نسائي دقيقة تعيد الثقة والراحة، بأحدث التقنيات وبخصوصية تامة.",
      en: "Precise cosmetic gynecology procedures that restore confidence and comfort, with full privacy and the latest techniques.",
    },
    heroSub: {
      ar: "جراحات تجميل نسائي دقيقة تعيد لكِ الثقة والراحة بخصوصية تامة.",
      en: "Precise cosmetic gynecology that restores your confidence and comfort with complete privacy.",
    },
    intro: {
      ar: "نقدم مجموعة من إجراءات التجميل النسائي الدقيقة التي تهدف إلى استعادة الثقة والراحة، بأحدث التقنيات وضمن بيئة تحترم خصوصيتك تمامًا.",
      en: "We offer a range of precise cosmetic gynecology procedures aimed at restoring confidence and comfort, with the latest techniques in an environment that fully respects your privacy.",
    },
    sections: [
      {
        heading: { ar: "خصوصية تامة", en: "Complete privacy" },
        body: {
          ar: "نتعامل مع كل حالة بأقصى درجات السرية والاحترام، لأن راحتك وثقتك أولوية.",
          en: "We handle every case with the utmost confidentiality and respect — your comfort and confidence are a priority.",
        },
      },
      {
        heading: { ar: "أحدث التقنيات", en: "The latest techniques" },
        body: {
          ar: "نستخدم تقنيات حديثة تقلل من فترة التعافي وتضمن نتائج طبيعية ومريحة.",
          en: "We use modern techniques that reduce recovery time and ensure natural, comfortable results.",
        },
      },
      {
        heading: { ar: "استشارة صريحة", en: "An open consultation" },
        body: {
          ar: "نبدأ دائمًا باستشارة صريحة نشرح فيها الخيارات والتوقعات بوضوح قبل أي قرار.",
          en: "We always start with an open consultation explaining the options and expectations clearly before any decision.",
        },
      },
    ],
    benefits: [
      { ar: "استعادة الثقة والراحة", en: "Restored confidence and comfort" },
      { ar: "خصوصية واحترام كامل", en: "Full privacy and respect" },
      { ar: "أحدث التقنيات وأقل تعافٍ", en: "Latest techniques, minimal recovery" },
      { ar: "نتائج طبيعية", en: "Natural results" },
    ],
    faq: [
      {
        q: { ar: "هل الإجراءات سرية تمامًا؟", en: "Are the procedures fully confidential?" },
        a: { ar: "نعم، نضمن أعلى درجات الخصوصية والسرية لكل مريضة.", en: "Yes — we guarantee the highest privacy and confidentiality for every patient." },
      },
      {
        q: { ar: "كم تستغرق فترة التعافي؟", en: "How long is recovery?" },
        a: { ar: "تختلف حسب الإجراء، لكن التقنيات الحديثة تقلل فترة التعافي كثيرًا.", en: "It varies by procedure, but modern techniques greatly shorten recovery." },
      },
      {
        q: { ar: "كيف أعرف الإجراء المناسب لي؟", en: "How do I know which procedure suits me?" },
        a: { ar: "من خلال استشارة صريحة نحدد معًا الخيار الأنسب لحالتك.", en: "Through an open consultation we determine together the best option for your case." },
      },
    ],
    metaTitle: { ar: "التجميل النسائي | د. أحمد مرزوق", en: "Cosmetic Gynecology | Dr. Ahmed Marzouk" },
    metaDesc: {
      ar: "جراحات التجميل النسائي بأحدث التقنيات وخصوصية تامة مع د. أحمد مرزوق.",
      en: "Cosmetic gynecology with the latest techniques and complete privacy with Dr. Ahmed Marzouk.",
    },
  },
  {
    slug: "tummy-tuck-with-cesarean",
    slotId: "svc-6",
    glyph: "⦿",
    gc: SPANS[5].gc, gr: SPANS[5].gr,
    tag: { ar: "تجميل", en: "Cosmetic" },
    title: { ar: "شد البطن مع القيصرية", en: "Tummy Tuck with Cesarean" },
    shortDesc: {
      ar: "استعيدي رشاقة جسمك بعد الولادة مباشرةً — عملية شد البطن تُجرى مع القيصرية في جلسة واحدة.",
      en: "Regain your figure right after delivery — a tummy tuck performed together with your cesarean in one session.",
    },
    heroSub: {
      ar: "شد البطن مع القيصرية في جلسة واحدة لتستعيدي رشاقتك بعد الولادة مباشرةً.",
      en: "A tummy tuck with your cesarean in a single session so you regain your figure right after delivery.",
    },
    intro: {
      ar: "يمكن دمج عملية شد البطن مع الولادة القيصرية في جلسة واحدة، مما يوفر عليكِ عملية منفصلة وفترة نقاهة إضافية، ويساعدك على استعادة شكل جسمك بعد الحمل.",
      en: "A tummy tuck can be combined with a cesarean in a single session, sparing you a separate operation and extra recovery time and helping you restore your body shape after pregnancy.",
    },
    sections: [
      {
        heading: { ar: "لمن يناسب هذا الإجراء؟", en: "Who is it suitable for?" },
        body: {
          ar: "يناسب النساء اللاتي أكملن حجم عائلتهن ويرغبن في استعادة شكل البطن، بعد تقييم دقيق للحالة الصحية.",
          en: "It suits women who have completed their family and wish to restore their abdominal shape, after a careful health assessment.",
        },
      },
      {
        heading: { ar: "مزايا الجلسة الواحدة", en: "Benefits of a single session" },
        body: {
          ar: "تجنّبكِ عملية جراحية إضافية وتخديرًا منفصلًا وفترة نقاهة ثانية، مع نتيجة تجميلية في نفس وقت الولادة.",
          en: "It spares you an extra operation, separate anesthesia and a second recovery, with a cosmetic result at the same time as delivery.",
        },
      },
      {
        heading: { ar: "الأمان أولًا", en: "Safety first" },
        body: {
          ar: "يُتخذ القرار بعد تقييم شامل لصحة الأم والجنين لضمان أعلى درجات الأمان في الإجراء المدمج.",
          en: "The decision is made after a full assessment of the health of mother and baby to ensure the highest safety in the combined procedure.",
        },
      },
    ],
    benefits: [
      { ar: "استعادة الرشاقة بعد الولادة مباشرةً", en: "Regain your figure right after delivery" },
      { ar: "توفير عملية وتخدير وتعافٍ إضافي", en: "Save an extra operation, anesthesia and recovery" },
      { ar: "نتيجة تجميلية في وقت الولادة", en: "A cosmetic result at delivery time" },
      { ar: "تقييم دقيق للأمان", en: "Careful safety assessment" },
    ],
    faq: [
      {
        q: { ar: "هل الإجراء المدمج آمن؟", en: "Is the combined procedure safe?" },
        a: { ar: "نعم عند التقييم المناسب وإجرائه على يد فريق متخصص.", en: "Yes, with proper assessment and a specialized team." },
      },
      {
        q: { ar: "هل يطيل فترة التعافي؟", en: "Does it lengthen recovery?" },
        a: { ar: "دمج الإجراءين غالبًا أفضل من عمليتين منفصلتين من حيث إجمالي التعافي.", en: "Combining the two is usually better than two separate operations in terms of total recovery." },
      },
      {
        q: { ar: "هل يناسب كل الأمهات؟", en: "Is it right for every mother?" },
        a: { ar: "لا، نحدد ذلك بعد تقييم فردي شامل لحالتك.", en: "No — we determine that after a full individual assessment of your case." },
      },
    ],
    metaTitle: { ar: "شد البطن مع القيصرية | د. أحمد مرزوق", en: "Tummy Tuck with Cesarean | Dr. Ahmed Marzouk" },
    metaDesc: {
      ar: "شد البطن مع القيصرية في جلسة واحدة لاستعادة الرشاقة بعد الولادة مع د. أحمد مرزوق.",
      en: "Tummy tuck with cesarean in one session to regain your figure after delivery with Dr. Ahmed Marzouk.",
    },
  },
];

// --- Map a Supabase row to the Service shape -------------------------------
/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToService(r: any): Service {
  return {
    slug: r.slug,
    slotId: r.slug,
    glyph: r.glyph ?? "",
    imageUrl: r.image_url ?? undefined,
    gc: r.span_gc ?? "auto",
    gr: r.span_gr ?? "auto",
    tag: { ar: r.tag_ar ?? "", en: r.tag_en ?? "" },
    title: { ar: r.title_ar ?? "", en: r.title_en ?? "" },
    shortDesc: { ar: r.short_desc_ar ?? "", en: r.short_desc_en ?? "" },
    heroSub: { ar: r.hero_sub_ar ?? "", en: r.hero_sub_en ?? "" },
    intro: { ar: r.intro_ar ?? "", en: r.intro_en ?? "" },
    sections: (r.sections ?? []).map((s: any) => ({
      heading: { ar: s.heading_ar ?? "", en: s.heading_en ?? "" },
      body: { ar: s.body_ar ?? "", en: s.body_en ?? "" },
    })),
    benefits: (r.benefits ?? []).map((b: any) => ({ ar: b.ar ?? "", en: b.en ?? "" })),
    faq: (r.faq ?? []).map((f: any) => ({
      q: { ar: f.q_ar ?? "", en: f.q_en ?? "" },
      a: { ar: f.a_ar ?? "", en: f.a_en ?? "" },
    })),
    metaTitle: { ar: r.meta_title_ar ?? "", en: r.meta_title_en ?? "" },
    metaDesc: { ar: r.meta_desc_ar ?? "", en: r.meta_desc_en ?? "" },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** All published services (Supabase → seed fallback). Server-side. */
export async function getServices(): Promise<Service[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return SERVICES_SEED;
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return SERVICES_SEED;
  return data.map(rowToService);
}

/** One service by slug (Supabase → seed fallback). Server-side. */
export async function getService(slug: string): Promise<Service | undefined> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return SERVICES_SEED.find((s) => s.slug === slug);
  const { data, error } = await supabase.from("services").select("*").eq("slug", slug).single();
  if (error || !data) return SERVICES_SEED.find((s) => s.slug === slug);
  return rowToService(data);
}

/** Slugs for static generation. */
export async function getServiceSlugs(): Promise<string[]> {
  const services = await getServices();
  return services.map((s) => s.slug);
}

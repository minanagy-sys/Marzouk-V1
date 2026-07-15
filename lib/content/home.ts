import type { Lang } from "@/lib/lang";

/** All Home-page content (AR/EN). Shape mirrors the future Supabase tables. */
export function homeContent(lang: Lang) {
  const isAr = lang === "ar";

  const t = isAr
    ? {
        msgKicker: "رسالة من الدكتور",
        msgTitle: "رسالة من د. أحمد مرزوق",
        msgBody:
          "نُكرس جهودنا لتقديم أعلى مستوى من الرعاية في بيئة مريحة بدون ألم وبأجمل الذكريات؛ نساعدك على الترحيب بأحدث فرد في عائلتك عبر مجموعة كاملة من خدمات الأمومة — من متابعة ما قبل الولادة إلى تجربة الولادة بدون ألم بنوعيها الطبيعية والقيصرية — إلى جانب الرعاية المتخصصة في الأورام الليفية المعقدة وبطانة الرحم المهاجرة وجراحات التجميل النسائي. أنتِ تستحقين حياة مليئة بالصحة؛ فأنتِ أساس عائلتك وعمودها.",
        svcKicker: "خدماتنا",
        svcTitle: "رعاية متكاملة لصحة المرأة",
        vmKicker: "من نحن",
        vmTitle: "رسالتنا ورؤيتنا وقيمنا",
        whyKicker: "لماذا تختارنا؟",
        whyTitle: "خبرة تطمئنين إليها في أدق اللحظات",
        whyBody:
          "أكثر من 10,000 ولادة بدون ألم، ومهارة نادرة في استئصال الأورام المعقدة مع الحفاظ على الرحم — رعاية إنسانية قبل أن تكون طبية.",
        whyCta: "تعرفي على الدكتور",
        celebKicker: "المشاهير",
        celebTitle: "نجوم وثقوا بنا في أجمل لحظاتهم",
        ctaTitle: "احجزي موعدك مع د. أحمد مرزوق",
        ctaBody:
          "يمكنك الحجز الآن والتخلص من آلام أمراض النساء نهائيًا، كما يمكنك إجراء استشارة فيديو في حالات الأورام الليفية توفيرًا للوقت وبُعد المسافات.",
        newsKicker: "آخر الأخبار",
        newsTitle: "من المدونة والأخبار",
        heroCta1: "احجزي موعدك",
        heroCta2: "تعرفي على خدماتنا",
        viewAll: "عرض الكل",
        nextLabel: "التالي",
        photoPh: "أسقطي صورة هنا",
      }
    : {
        msgKicker: "A word from the doctor",
        msgTitle: "A Message from Dr. Ahmed Marzouk",
        msgBody:
          "We dedicate ourselves to the highest level of care in a comfortable, pain-free environment with the most beautiful memories. We help you welcome the newest member of your family through a complete range of maternity services — from prenatal follow-up to pain-free natural and cesarean delivery — alongside specialized care for complex fibroids, endometriosis, and cosmetic gynecology. You deserve a life full of health; you are the foundation of your family.",
        svcKicker: "Our Services",
        svcTitle: "Complete Care for Women’s Health",
        vmKicker: "Who we are",
        vmTitle: "Our Mission, Vision & Values",
        whyKicker: "Why choose us?",
        whyTitle: "Expertise you can trust in the most delicate moments",
        whyBody:
          "Over 10,000 pain-free deliveries and rare skill in removing complex tumors while preserving the uterus — humane care before medical care.",
        whyCta: "Meet the doctor",
        celebKicker: "Celebrities",
        celebTitle: "Stars who trusted us with their finest moments",
        ctaTitle: "Book your appointment with Dr. Ahmed Marzouk",
        ctaBody:
          "Book now and put gynecological pain behind you. Video consultations are available for fibroid cases — saving you time and distance.",
        newsKicker: "Latest news",
        newsTitle: "From the Blog & News",
        heroCta1: "Book Your Visit",
        heroCta2: "Explore Services",
        viewAll: "View all",
        nextLabel: "Next",
        photoPh: "Drop a photo here",
      };

  const slides = isAr
    ? [
        { kicker: "استشاري النساء والتوليد وجراحة الأورام", t1: "مبتكر الولادة", t2: "بدون ألم في مصر", sub: "رحلة أمومة كاملة بأعلى مستوى من الرعاية — ولادة طبيعية وقيصرية بدون ألم، بأجمل الذكريات ومن أول لحظة." },
        { kicker: "جراحة الأورام المعقدة", t1: "أورام معقدة تُستأصل", t2: "ورحم يبقى محفوظًا", sub: "مهارة نادرة في استئصال الأورام الليفية المعقدة وبطانة الرحم المهاجرة مع الحفاظ على الرحم والقدرة على الإنجاب — حتى في أصعب الحالات." },
        { kicker: "التجميل النسائي", t1: "استعيدي ثقتك", t2: "ورشاقتك من جديد", sub: "جراحات تجميل نسائي دقيقة بخصوصية تامة، ويمكن إجراء شد البطن مع القيصرية لتستعيدي رشاقتك بعد الولادة مباشرةً." },
      ]
    : [
        { kicker: "Consultant of Obstetrics, Gynecology & Oncologic Surgery", t1: "Egypt’s Pioneer of", t2: "Pain-Free Delivery", sub: "A complete motherhood journey with the highest level of care — natural and cesarean pain-free delivery, with beautiful memories from the very first moment." },
        { kicker: "Complex Tumor Surgery", t1: "Complex tumors removed,", t2: "the uterus preserved", sub: "Rare skill in removing complex fibroids and treating endometriosis while preserving the uterus and fertility — even in the hardest cases." },
        { kicker: "Cosmetic Gynecology", t1: "Regain your confidence", t2: "and your figure", sub: "Precise cosmetic gynecology with complete privacy — a tummy tuck can be performed with your cesarean so you regain your figure right after delivery." },
      ];

  const heroImages = ["assets/hero-doctor-dark.jpg", "assets/hero-surgery.jpg", "assets/hero-prenatal.jpg"];

  const stats = isAr
    ? [
        { num: "+10,000", label: "ولادة بدون ألم" },
        { num: "14 كجم", label: "أكبر ورم مستأصل مع الحفاظ على الجنين" },
        { num: "عيادتان", label: "التجمع الخامس ومدينة نصر" },
      ]
    : [
        { num: "10,000+", label: "Pain-free deliveries" },
        { num: "14 kg", label: "Largest tumor removed while preserving the fetus" },
        { num: "2 Clinics", label: "Fifth Settlement & Nasr City" },
      ];

  const services = (isAr
    ? [
        { tag: "ولادة", title: "الولادة القيصرية بدون ألم" },
        { tag: "ولادة", title: "الولادة الطبيعية بدون ألم" },
        { tag: "جراحة أورام", title: "استئصال الأورام الليفية المعقدة" },
        { tag: "تجميل", title: "التجميل النسائي" },
      ]
    : [
        { tag: "Delivery", title: "Pain-Free Cesarean Delivery" },
        { tag: "Delivery", title: "Pain-Free Natural Delivery" },
        { tag: "Tumor surgery", title: "Complex Fibroid Removal" },
        { tag: "Cosmetic", title: "Cosmetic Gynecology" },
      ]
  ).map((s, i) => ({ ...s, slotId: "svc-home-" + (i + 1) }));

  const vm = isAr
    ? [
        { num: "01", title: "رسالتنا", body: "تقديم علاج متخصص لأمراض النساء والتوليد لدعم المرأة صحيًا، والمساعدة في تحقيق الشفاء التام والسريع، وحماية حقها في الرعاية الإنجابية الكاملة." },
        { num: "02", title: "رؤيتنا", body: "أن تكون كل زيارة استشارة إيجابية وبناءة؛ نقدم مستوى رعاية لائقًا وفريدًا يريح المرأة جسديًا ونفسيًا في مجال أمراض النساء والتوليد." },
        { num: "03", title: "قيمنا", body: "التميز في الرعاية الصحية النسائية، والتطور بتطبيق التكنولوجيا المبتكرة في الوقت المناسب، والنزاهة باتباع الأسس الأخلاقية في كل قرار." },
      ]
    : [
        { num: "01", title: "Our Mission", body: "Specialized OB-GYN treatment that supports women’s health, helps achieve full and rapid recovery, and protects the right to complete reproductive care." },
        { num: "02", title: "Our Vision", body: "Every visit should be a positive, constructive consultation — a unique standard of care that puts women at ease, physically and emotionally." },
        { num: "03", title: "Our Values", body: "Excellence in women’s healthcare, progress through innovative technology delivered at the right time, and integrity in every decision." },
      ];

  const why = isAr
    ? [
        { glyph: "⚕", title: "طبيب محترف", desc: "خبرة طويلة واحترافية عالية في أدق جراحات النساء والتوليد." },
        { glyph: "♡", title: "ولادة بدون ألم", desc: "مبتكر تجربة الولادة بدون ألم في مصر بنوعيها الطبيعية والقيصرية." },
        { glyph: "❀", title: "استئصال الأورام المعقدة", desc: "مهارة نادرة في الحالات المعقدة مع الحفاظ على الرحم." },
        { glyph: "⏱", title: "رعاية في الطوارئ", desc: "استجابة سريعة في أي وقت — حتى الساعة 3 فجرًا." },
      ]
    : [
        { glyph: "⚕", title: "Professional Doctor", desc: "Long experience and high professionalism in the most delicate OB-GYN surgeries." },
        { glyph: "♡", title: "Pain-Free Delivery", desc: "Pioneer of the pain-free birth experience in Egypt — natural and cesarean." },
        { glyph: "❀", title: "Complex Tumor Removal", desc: "Rare skill in complex cases while preserving the uterus." },
        { glyph: "⏱", title: "Emergency Care", desc: "Rapid response at any hour — even 3 a.m." },
      ];

  const celebs = (isAr
    ? [
        { name: "رنا سماحة", caption: "المطربة — ولادة بدون ألم وطلق الساعة 2 فجرًا" },
        { name: "إنجي يحيى", caption: "مذيعة ON Sport — قيصرية بدون ألم لتوأم" },
        { name: "محمد مجدي «قفشة»", caption: "نجم منتخب مصر — ولادة مالك" },
        { name: "محمود الليثي", caption: "الفنان — ولادة ابنه البكر يونس" },
        { name: "أيمن الكاشف", caption: "المعلق الرياضي — ولادة ابنه هشام" },
        { name: "خلود الباشا", caption: "الفنانة — قيصرية بدون ألم" },
      ]
    : [
        { name: "Rana Samaha", caption: "Singer — pain-free delivery at 2 a.m." },
        { name: "Engy Yehia", caption: "ON Sport anchor — pain-free cesarean twins" },
        { name: "Mohamed Magdy", caption: "Egypt national team star — baby Malek" },
        { name: "Mahmoud El-Leithy", caption: "Actor — his firstborn Younes" },
        { name: "Ayman El-Kashef", caption: "Sports commentator — baby Hisham" },
        { name: "Kholoud El-Basha", caption: "Actress — pain-free cesarean" },
      ]
  ).map((c, i) => ({ ...c, slotId: "celeb-" + (i + 1) }));

  const news = (isAr
    ? [
        { date: "24 مارس 2021", title: "الاحتفال بعشرة آلاف حالة من الولادة بدون ألم" },
        { date: "7 يونيو 2017", title: "افتتاح فرع التجمع الخامس" },
        { date: "10 أكتوبر 2016", title: "افتتاح عيادة مدينة نصر" },
      ]
    : [
        { date: "Mar 24, 2021", title: "Celebrating 10,000 pain-free deliveries" },
        { date: "Jun 7, 2017", title: "Fifth Settlement branch opening" },
        { date: "Oct 10, 2016", title: "Nasr City clinic opening" },
      ]
  ).map((n, i) => ({ ...n, slotId: "news-" + (i + 1) }));

  return { t, slides, heroImages, stats, services, vm, why, celebs, news, isAr };
}

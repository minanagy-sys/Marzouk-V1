import type { Lang } from "@/lib/lang";

export type BlogPost = {
  slug: string;
  slotId: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
};

export function blogsUi(lang: Lang) {
  const isAr = lang === "ar";
  return isAr
    ? {
        pageTitle: "المدونة ومعلومات طبية",
        pageSub: "تعرفي على المزيد من المعلومات الطبية الموثوقة حول حالات وعلاج أمراض النساء والتوليد.",
        photoPh: "أسقطي صورة هنا",
        readMore: "اقرأ المزيد",
        backToBlog: "العودة إلى المدونة",
        related: "مقالات ذات صلة",
        share: "شارك المقال",
      }
    : {
        pageTitle: "Blog & Medical Information",
        pageSub: "Trusted medical information about obstetric and gynecological conditions and their treatment.",
        photoPh: "Drop a photo here",
        readMore: "Read more",
        backToBlog: "Back to blog",
        related: "Related articles",
        share: "Share article",
      };
}

export function blogPosts(lang: Lang): BlogPost[] {
  const isAr = lang === "ar";
  const raw = isAr
    ? [
        {
          slug: "pain-free-delivery",
          tag: "الولادة",
          date: "12 يونيو 2026",
          title: "كل ما تريدين معرفته عن الولادة بدون ألم",
          excerpt: "كيف تتم الولادة بدون ألم؟ ومتى تُستخدم؟ وهل هي آمنة عليك وعلى طفلك؟ إجابات شاملة من واقع آلاف الحالات.",
          body: [
            "الولادة بدون ألم هي مجموعة من التقنيات الطبية الحديثة التي تهدف إلى تقليل أو إزالة الألم أثناء الولادة الطبيعية والقيصرية، مع الحفاظ على سلامة الأم والجنين.",
            "تعتمد التقنية الأكثر شيوعًا على التخدير النصفي (الإبيدورال)، الذي يسمح للأم بالبقاء واعية أثناء الولادة والاستمتاع بلحظة استقبال طفلها دون معاناة.",
            "من واقع أكثر من 10,000 حالة ولادة بدون ألم، أثبتت هذه التقنيات أمانها العالي عند إجرائها على يد فريق طبي متخصص وفي بيئة مجهزة بالكامل.",
          ],
        },
        {
          slug: "fibroids-symptoms-surgery",
          tag: "الأورام الليفية",
          date: "28 مايو 2026",
          title: "الأورام الليفية: الأعراض ومتى يجب التدخل الجراحي",
          excerpt: "أكثر من 99% من الأورام الليفية حميدة، لكن تجاهلها قد يؤدي إلى مضاعفات — تعرفي على العلامات التي لا يجب إغفالها.",
          body: [
            "الأورام الليفية هي أورام حميدة تنمو في جدار الرحم، وتصيب نسبة كبيرة من النساء في سن الإنجاب دون أن تسبب أعراضًا في كثير من الأحيان.",
            "تشمل العلامات التي تستدعي استشارة الطبيب: النزيف الغزير، آلام الحوض المستمرة، وصعوبة الحمل. التدخل الجراحي يصبح ضروريًا عند تأثير الورم على الخصوبة أو جودة الحياة.",
            "الخبرة النادرة في استئصال الأورام المعقدة مع الحفاظ على الرحم تمنح المريضة أفضل فرصة للإنجاب مستقبلًا.",
          ],
        },
        {
          slug: "pregnancy-month-by-month",
          tag: "الحمل",
          date: "9 مايو 2026",
          title: "متابعة الحمل شهرًا بشهر: دليلك الكامل",
          excerpt: "جدول الزيارات والفحوصات الأساسية من أول اختبار حمل إيجابي وحتى يوم الولادة.",
          body: [
            "تبدأ رحلة متابعة الحمل بمجرد ظهور نتيجة اختبار الحمل الإيجابية، حيث تُحدد الزيارة الأولى لتأكيد الحمل وتقدير عمره.",
            "تتضمن المتابعة الدورية فحوصات السونار، تحاليل الدم، ومتابعة ضغط الدم والوزن، لضمان سلامة الأم والجنين في كل مرحلة.",
            "الالتزام بجدول الزيارات يساعد على اكتشاف أي مضاعفات مبكرًا والتعامل معها بأمان.",
          ],
        },
        {
          slug: "endometriosis-diagnosis",
          tag: "بطانة الرحم",
          date: "20 أبريل 2026",
          title: "بطانة الرحم المهاجرة: لماذا يتأخر التشخيص؟",
          excerpt: "آلام دورة شديدة ليست أمرًا طبيعيًا دائمًا — متى تشكين في بطانة الرحم المهاجرة وما خيارات العلاج؟",
          body: [
            "بطانة الرحم المهاجرة حالة مزمنة تنمو فيها أنسجة مشابهة لبطانة الرحم خارجه، مسببة آلامًا شديدة وأحيانًا مشاكل في الخصوبة.",
            "يتأخر التشخيص غالبًا لأن الأعراض تُنسب خطأً إلى آلام الدورة الطبيعية. التشخيص الدقيق يتطلب خبرة وفحوصات متخصصة.",
            "تتراوح خيارات العلاج بين الأدوية والتدخل الجراحي حسب شدة الحالة ورغبة المريضة في الإنجاب.",
          ],
        },
        {
          slug: "tummy-tuck-cesarean",
          tag: "القيصرية",
          date: "2 أبريل 2026",
          title: "شد البطن مع القيصرية: هل هو مناسب لكِ؟",
          excerpt: "إجراء واحد يجمع ولادة آمنة واستعادة رشاقة الجسم — الشروط والمزايا وما يجب معرفته قبل القرار.",
          body: [
            "يمكن إجراء عملية شد البطن مع الولادة القيصرية في جلسة واحدة، مما يوفر على الأم عملية جراحية منفصلة وفترة نقاهة إضافية.",
            "يناسب هذا الإجراء النساء اللاتي أكملن حجم عائلتهن ويرغبن في استعادة شكل البطن بعد الحمل.",
            "يُتخذ القرار بعد تقييم دقيق للحالة الصحية للأم والجنين لضمان أعلى درجات الأمان.",
          ],
        },
        {
          slug: "routine-gynecological-checkups",
          tag: "صحة المرأة",
          date: "15 مارس 2026",
          title: "الفحص الدوري النسائي: متى وماذا يشمل؟",
          excerpt: "الوقاية خير من العلاج — دليلك للفحوصات الدورية الأساسية لكل امرأة في كل مرحلة عمرية.",
          body: [
            "الفحص النسائي الدوري ركيزة أساسية للوقاية، إذ يساعد على اكتشاف المشكلات مبكرًا قبل تطورها.",
            "يشمل الفحص عادة تقييمًا سريريًا، مسحة عنق الرحم، وفحص السونار حسب العمر والحالة.",
            "يُنصح كل امرأة بإجراء فحص دوري سنوي على الأقل، مع زيادة التردد حسب توصية الطبيب.",
          ],
        },
      ]
    : [
        {
          slug: "pain-free-delivery",
          tag: "Delivery",
          date: "Jun 12, 2026",
          title: "Everything you need to know about pain-free delivery",
          excerpt: "How does pain-free delivery work? When is it used? Is it safe for you and your baby? Answers drawn from thousands of cases.",
          body: [
            "Pain-free delivery is a set of modern medical techniques designed to reduce or eliminate pain during natural and cesarean births, while keeping mother and baby safe.",
            "The most common approach relies on epidural anesthesia, which lets the mother stay awake and enjoy the moment of meeting her baby without suffering.",
            "Across more than 10,000 pain-free deliveries, these techniques have proven highly safe when performed by a specialized team in a fully equipped setting.",
          ],
        },
        {
          slug: "fibroids-symptoms-surgery",
          tag: "Fibroids",
          date: "May 28, 2026",
          title: "Fibroids: symptoms and when surgery is needed",
          excerpt: "Over 99% of fibroids are benign, but ignoring them can lead to complications — the signs you should never overlook.",
          body: [
            "Fibroids are benign tumors that grow in the uterine wall and affect a large share of women of reproductive age, often without symptoms.",
            "Signs that warrant a consultation include heavy bleeding, persistent pelvic pain, and difficulty conceiving. Surgery becomes necessary when a fibroid affects fertility or quality of life.",
            "Rare skill in removing complex fibroids while preserving the uterus gives the patient the best chance of future pregnancy.",
          ],
        },
        {
          slug: "pregnancy-month-by-month",
          tag: "Pregnancy",
          date: "May 9, 2026",
          title: "Month-by-month pregnancy follow-up: your complete guide",
          excerpt: "The essential visit and screening schedule from the first positive test to delivery day.",
          body: [
            "The pregnancy journey begins the moment a test turns positive, with a first visit to confirm the pregnancy and estimate its age.",
            "Regular follow-up includes ultrasound scans, blood tests, and monitoring of blood pressure and weight to keep mother and baby safe at every stage.",
            "Keeping to the visit schedule helps catch any complications early and manage them safely.",
          ],
        },
        {
          slug: "endometriosis-diagnosis",
          tag: "Endometriosis",
          date: "Apr 20, 2026",
          title: "Endometriosis: why is diagnosis so often delayed?",
          excerpt: "Severe period pain is not always normal — when to suspect endometriosis and what the treatment options are.",
          body: [
            "Endometriosis is a chronic condition in which tissue similar to the uterine lining grows outside it, causing severe pain and sometimes fertility problems.",
            "Diagnosis is often delayed because symptoms are wrongly attributed to normal period pain. An accurate diagnosis requires experience and specialized testing.",
            "Treatment options range from medication to surgery, depending on severity and the patient's fertility goals.",
          ],
        },
        {
          slug: "tummy-tuck-cesarean",
          tag: "Cesarean",
          date: "Apr 2, 2026",
          title: "Tummy tuck with cesarean: is it right for you?",
          excerpt: "One procedure combining a safe delivery with regaining your figure — conditions, benefits, and what to know first.",
          body: [
            "A tummy tuck can be performed together with a cesarean in a single session, sparing the mother a separate operation and extra recovery time.",
            "This procedure suits women who have completed their family and wish to restore their abdominal shape after pregnancy.",
            "The decision is made after a careful assessment of the health of mother and baby to ensure the highest level of safety.",
          ],
        },
        {
          slug: "routine-gynecological-checkups",
          tag: "Women’s health",
          date: "Mar 15, 2026",
          title: "Routine gynecological checkups: when and what?",
          excerpt: "Prevention is better than cure — your guide to the essential routine screenings for every woman at every age.",
          body: [
            "The routine gynecological checkup is a cornerstone of prevention, helping detect problems early before they progress.",
            "The exam typically includes a clinical assessment, a cervical smear, and ultrasound depending on age and condition.",
            "Every woman is advised to have at least an annual checkup, with more frequent visits as recommended by her doctor.",
          ],
        },
      ];

  return raw.map((p, i) => ({ ...p, slotId: "post-" + (i + 1) }));
}

export function getBlogPost(lang: Lang, slug: string): BlogPost | undefined {
  return blogPosts(lang).find((p) => p.slug === slug);
}

// Slugs are language-independent — used for static generation.
export const BLOG_SLUGS = [
  "pain-free-delivery",
  "fibroids-symptoms-surgery",
  "pregnancy-month-by-month",
  "endometriosis-diagnosis",
  "tummy-tuck-cesarean",
  "routine-gynecological-checkups",
];

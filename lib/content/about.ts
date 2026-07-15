import type { Lang } from "@/lib/lang";

export function aboutContent(lang: Lang) {
  const isAr = lang === "ar";

  const t = isAr
    ? {
        pageTitle: "عن د. أحمد مرزوق",
        pageSub: "استشاري النساء والتوليد وجراحة الأورام، ومبتكر تجربة الولادة بدون ألم في مصر.",
        whoKicker: "من نحن",
        whoTitle: "رعاية إنسانية قبل أن تكون طبية",
        whoBody1:
          "يقود د. أحمد مرزوق فريقًا طبيًا متكاملًا يقدم مجموعة كاملة من خدمات الأمومة — من متابعة ما قبل الولادة إلى تجربة الولادة بدون ألم بنوعيها الطبيعية والقيصرية — إلى جانب مجموعة شاملة من خدمات أمراض النساء للمريضات من جميع الأعمار.",
        whoBody2:
          "كما يتميز برعاية متخصصة في حالات الأورام الليفية المعقدة وبطانة الرحم المهاجرة وجراحات التجميل النسائي، مع مهارة نادرة في الحفاظ على الرحم والقدرة على الإنجاب حتى في أصعب الحالات.",
        statBirths: "ولادة بدون ألم",
        vmKicker: "من نحن",
        vmTitle: "رسالتنا ورؤيتنا وقيمنا",
        whyKicker: "لماذا تختارنا؟",
        whyTitle: "أربعة أسباب تجعلنا اختيارك الأول",
        testiKicker: "تعليقات العملاء",
        testiTitle: "ماذا قالوا عنا؟",
        ctaTitle: "احجزي موعدك مع د. أحمد مرزوق",
      }
    : {
        pageTitle: "About Dr. Ahmed Marzouk",
        pageSub: "Consultant of obstetrics, gynecology & oncologic surgery — pioneer of the pain-free delivery experience in Egypt.",
        whoKicker: "Who we are",
        whoTitle: "Humane care before medical care",
        whoBody1:
          "Dr. Ahmed Marzouk leads a complete medical team offering a full range of maternity services — from prenatal follow-up to pain-free natural and cesarean delivery — alongside comprehensive gynecology services for patients of all ages.",
        whoBody2:
          "He is distinguished by specialized care for complex fibroids, endometriosis, and cosmetic gynecology, with rare skill in preserving the uterus and fertility even in the most difficult cases.",
        statBirths: "Pain-free deliveries",
        vmKicker: "Who we are",
        vmTitle: "Our Mission, Vision & Values",
        whyKicker: "Why choose us?",
        whyTitle: "Four reasons we are your first choice",
        testiKicker: "Testimonials",
        testiTitle: "What our patients say",
        ctaTitle: "Book your appointment with Dr. Ahmed Marzouk",
      };

  const facts = isAr
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
        { glyph: "♡", title: "ولادة بدون ألم", desc: "مبتكر تجربة الولادة بدون ألم في مصر بنوعيها." },
        { glyph: "❀", title: "استئصال الأورام المعقدة", desc: "مهارة نادرة مع الحفاظ على الرحم والإنجاب." },
        { glyph: "⏱", title: "رعاية في الطوارئ", desc: "استجابة سريعة في أي وقت — حتى الساعة 3 فجرًا." },
      ]
    : [
        { glyph: "⚕", title: "Professional Doctor", desc: "Long experience in the most delicate OB-GYN surgeries." },
        { glyph: "♡", title: "Pain-Free Delivery", desc: "Pioneer of pain-free birth in Egypt — natural and cesarean." },
        { glyph: "❀", title: "Complex Tumor Removal", desc: "Rare skill while preserving the uterus and fertility." },
        { glyph: "⏱", title: "Emergency Care", desc: "Rapid response at any hour — even 3 a.m." },
      ];

  const testimonials = isAr
    ? [
        { name: "Rana Sayed", text: "ربنا يباركلك ويكتر من أمثالك. بجد أنت راجل خلوق ومطمئن، بحمد ربنا دايمًا إنه حطك في طريقي عشان أولد معاك بدون ألم." },
        { name: "Ràbáb Zäkriá", text: "ما شاء الله عليك فعلًا. كفاية ضحكتك في وشنا، وفعلًا بجد ما حسيتش بحاجة وما شفتش مكان الجرح. بارك الله فيك وتسلم إيدك أنت والفريق كله." },
        { name: "Semsema Ali", text: "من شطارتك يا دكتوري خلتني أنزل أولد في مصر وأرجع تاني. كنت بسمع عن المعاناة، لكن لما ولدت معاك الموضوع اتغير تمامًا." },
      ]
    : [
        { name: "Rana Sayed", text: "God bless you. You are truly kind and reassuring — I always thank God He put you in my path so I could deliver with you without pain." },
        { name: "Ràbáb Zäkriá", text: "Honestly amazing. Your smile alone was enough — I truly felt nothing and never even noticed the scar. Bless you and the whole team." },
        { name: "Semsema Ali", text: "Your skill made me travel to Egypt just to deliver with you — and I would do it again. Everything I feared about birth changed completely." },
      ];

  return { t, facts, vm, why, testimonials };
}

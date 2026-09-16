import type { Lang } from "@/lib/lang";

export function aboutContent(lang: Lang) {
  const isAr = lang === "ar";

  const t = isAr
    ? {
        pageTitle: "عن د. أحمد مرزوق",
        pageSub: "استشاري النساء والتوليد وجراحة الأورام، ومبتكر تجربة الولادة بدون ألم في مصر.",
        whoKicker: "من نحن",
        whoTitle: "الدكتور أحمد مرزوق",
        whoBody1:
          "الدكتور أحمد مرزوق محمد حسين، استشاري جراحات النساء والتوليد، وُلد في القاهرة عام 1986. تخرج من كلية الطب جامعة عين شمس، وحصل على ماجستير أمراض النساء والتوليد والعقم (2015)، ودبلومة جراحة مناظير أمراض النساء من كليرمون – فرنسا، وعضوية الكلية الملكية لأمراض النساء والتوليد (MRCOG) بلندن (2011)، والزمالة في أمراض النساء التجميلية بدبي (أغسطس 2021).",
        whoBody2:
          "يتخصص في استئصال أورام الرحم الليفية المعقدة دون التأثير على الرحم، ويستقبل مريضات من جميع أنحاء العالم لإجراء أدق العمليات وأكثرها تعقيدًا. وهو أول من أدخل تقنية التاب بلوك (TAP Block) لولادة قيصرية بدون ألم في مصر والشرق الأوسط، وأول من أجرى ولادة طبيعية بدون ألم في مصر والوطن العربي — وقد طُبّقت تقنيته على أكثر من 10,000 أم دون أي آثار جانبية.",
        milestonesTitle: "محطات ومساهمات علمية",
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
        whoTitle: "Dr. Ahmed Marzouk",
        whoBody1:
          "Dr. Ahmed Marzouk Mohamed Hussein is a consultant of obstetrics and gynecologic surgery, born in Cairo in 1986. He graduated from the Faculty of Medicine at Ain Shams University, and holds a Master's degree in Obstetrics, Gynecology & Infertility (2015), a diploma in gynecologic endoscopic surgery from Clermont — France, the Membership of the Royal College of Obstetricians and Gynaecologists (MRCOG) in London (2011), and a Fellowship in cosmetic gynecology in Dubai (August 2021).",
        whoBody2:
          "He specializes in removing complex uterine fibroids without affecting the uterus, and receives patients from all over the world for the most precise and complex operations. He was the first to introduce the TAP Block technique for pain-free cesarean delivery in Egypt and the Middle East, and the first to perform a pain-free natural birth in Egypt and the Arab world — his technique has now been applied to more than 10,000 mothers with no side effects.",
        milestonesTitle: "Milestones & scientific contributions",
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
        { num: "عيادة", label: "التجمع الخامس — بولاريس مول" },
      ]
    : [
        { num: "10,000+", label: "Pain-free deliveries" },
        { num: "14 kg", label: "Largest tumor removed while preserving the fetus" },
        { num: "1 Clinic", label: "Fifth Settlement — Polaris Mall" },
      ];

  const milestones = isAr
    ? [
        { year: "2011", text: "الحصول على عضوية الكلية الملكية لأمراض النساء والتوليد (MRCOG) بلندن." },
        { year: "2015", text: "ماجستير أمراض النساء والتوليد والعقم، وإتمام دبلومة جراحة المناظير من كليرمون – فرنسا." },
        { year: "2017", text: "أول تطبيق لتقنية التاب بلوك (TAP Block) لولادة قيصرية بدون ألم في مصر والشرق الأوسط." },
        { year: "2019", text: "استئصال أكبر ورم ليفي (14 كجم) مع الحفاظ على الرحم والجنين." },
        { year: "2020", text: "الاحتفال بأكثر من 10,000 أم وُلدن بدون ألم، ومتابعة من أكثر من 45 دولة حول العالم." },
        { year: "2021", text: "الحصول على الزمالة في أمراض النساء التجميلية بدبي." },
      ]
    : [
        { year: "2011", text: "Awarded the Membership of the Royal College of Obstetricians and Gynaecologists (MRCOG) in London." },
        { year: "2015", text: "Master's degree in Obstetrics, Gynecology & Infertility, and completion of the endoscopic surgery diploma from Clermont — France." },
        { year: "2017", text: "First application of the TAP Block technique for pain-free cesarean delivery in Egypt and the Middle East." },
        { year: "2019", text: "Removed the largest uterine fibroid (14 kg) while preserving the uterus and the fetus." },
        { year: "2020", text: "Celebrated more than 10,000 mothers who delivered pain-free, followed by patients from over 45 countries worldwide." },
        { year: "2021", text: "Awarded the Fellowship in cosmetic gynecology in Dubai." },
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

  return { t, facts, milestones, vm, why, testimonials };
}

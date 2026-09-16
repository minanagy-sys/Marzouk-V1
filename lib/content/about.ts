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
          "يتخصص الدكتور أحمد مرزوق في استئصال أورام الرحم الليفية دون التأثير على الرحم، ويستقبل المريضات من جميع أنحاء العالم لإجراء أكثر العمليات الجراحية تعقيدًا. وينبع إقدامه على علاج الحالات المعقدة من إيمانه بأن الجنين روحٌ يجب أن نحارب من أجلها؛ لذا تسعى المريضات من كل مكان للاستفادة من خبرته.",
        whoBody3:
          "وللدكتور أحمد مرزوق العديد من الإضافات والتعديلات على تقنيات الولادة القيصرية والطبيعية، فهو أول من أدخل تعديلات تُجنّب السيدات الألم لمدة 36 ساعة بعد الولادة عبر تطبيق تخدير جدار البطن (TAP Block) وكذلك تقنية (QL Block) الأحدث، وأول من أجرى ولادة طبيعية بدون ألم في مصر والوطن العربي. وقد طُبّقت تقنيته الشهيرة على أكثر من 10,000 أم من جميع أنحاء العالم دون أي آثار جانبية، مما مكّنهن من العودة إلى حياتهن الطبيعية بعد الجراحة مباشرة.",
        milestonesTitle: "المشاركات والإنجازات العلمية",
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
          "Dr. Ahmed Marzouk specializes in removing uterine fibroids without affecting the uterus, and receives patients from all over the world for the most complex operations. His readiness to treat difficult cases stems from his belief that the fetus is a soul worth fighting for — which is why patients seek out his expertise from everywhere.",
        whoBody3:
          "He has introduced numerous refinements to cesarean and natural delivery techniques. He was the first to apply modifications that spare women pain for 36 hours after delivery using the abdominal-wall TAP Block and the newer QL Block, and the first to perform a pain-free natural birth in Egypt and the Arab world. His renowned technique has been applied to more than 10,000 mothers worldwide with no side effects, letting them return to normal life immediately after surgery.",
        milestonesTitle: "Scientific contributions & achievements",
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
        { year: "2017", text: "إدخال تقنية التاب بلوك (TAP Block) لتوفير ولادة قيصرية غير مؤلمة، لأول مرة في مصر والشرق الأوسط." },
        { year: "2017", text: "أول من أدخل تصوير جلسات الولادة (PhotoSessions) داخل غرفة العمليات." },
        { year: "2019", text: "استخراج ورم ليفي وزنه 14 كجم من رحم امرأة حامل في فبراير مع الحفاظ على الجنين والرحم وإنقاذ حياتها — لأول مرة في الشرق الأوسط." },
        { year: "2020", text: "الاحتفال بأكثر من 10,000 أم في مارس." },
        { year: "2020", text: "الوصول إلى 1,000,000 متابع من 45 دولة في يونيو." },
        { year: "2021", text: "الحصول على درجة الزمالة في أمراض النساء التجميلية بدبي." },
      ]
    : [
        { year: "2017", text: "Introduced the TAP Block technique for pain-free cesarean delivery — a first in Egypt and the Middle East." },
        { year: "2017", text: "First to bring PhotoSessions into the operating room." },
        { year: "2019", text: "Removed a 14 kg uterine fibroid from a pregnant woman in February while preserving the fetus and uterus and saving her life — a first in the Middle East." },
        { year: "2020", text: "Celebrated more than 10,000 mothers in March." },
        { year: "2020", text: "Reached 1,000,000 followers across 45 countries in June." },
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

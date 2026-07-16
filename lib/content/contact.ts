import type { Lang } from "@/lib/lang";

export function contactContent(lang: Lang) {
  const isAr = lang === "ar";

  const t = isAr
    ? {
        pageTitle: "اتصل بنا",
        pageSub: "احجزي موعدك الآن وتخلصي من آلام أمراض النساء نهائيًا — فريقنا في انتظارك.",
        mapKicker: "عياداتنا",
        mapTitle: "وصلي إلينا بسهولة",
        mapHint: "اضغطي على العلامة لعرض تفاصيل العيادة",
        directions: "الاتجاهات",
        formTitle: "احجزي موعدك",
        formSub: "املئي البيانات وسنتواصل معك لتأكيد الموعد في أقرب وقت.",
        fName: "الاسم",
        fPhone: "رقم الهاتف",
        fEmail: "البريد الإلكتروني (اختياري)",
        fService: "الخدمة المطلوبة",
        fServicePick: "اختر الخدمة",
        fMsg: "رسالتك (اختياري)",
        fSend: "إرسال طلب الحجز",
        sending: "جارٍ الإرسال...",
        sentTitle: "تم استلام طلبك بنجاح",
        sentSub: "سنتواصل معك خلال ساعات العمل لتأكيد الموعد.",
        errorMsg: "حدث خطأ، برجاء المحاولة مرة أخرى أو الاتصال بنا مباشرة.",
        reqName: "برجاء إدخال الاسم ورقم الهاتف.",
        reqPhone: "برجاء إدخال رقم هاتف صحيح (7 أرقام على الأقل).",
        callTitle: "أو اتصلي مباشرة",
        videoNote: "يمكن إجراء استشارة فيديو في حالات الأورام الليفية — توفيرًا للوقت وبُعد المسافات.",
      }
    : {
        pageTitle: "Contact Us",
        pageSub: "Book your appointment now and put gynecological pain behind you — our team is waiting for you.",
        mapKicker: "Our clinics",
        mapTitle: "Find us easily",
        mapHint: "Tap a pin to see clinic details",
        directions: "Directions",
        formTitle: "Book Your Appointment",
        formSub: "Fill in your details and we will contact you shortly to confirm.",
        fName: "Name",
        fPhone: "Phone number",
        fEmail: "Email (optional)",
        fService: "Requested service",
        fServicePick: "Select a service",
        fMsg: "Your message (optional)",
        fSend: "Send booking request",
        sending: "Sending...",
        sentTitle: "Your request was received",
        sentSub: "We will contact you during working hours to confirm your appointment.",
        errorMsg: "Something went wrong. Please try again or call us directly.",
        reqName: "Please enter your name and phone number.",
        reqPhone: "Please enter a valid phone number (at least 7 digits).",
        callTitle: "Or call directly",
        videoNote: "Video consultations are available for fibroid cases — saving you time and distance.",
      };

  const clinics = isAr
    ? [
        { name: "عيادة التجمع الخامس", address: "سيلفر ستار مول — فوق سوبر ماركت سعودي، الدور الأول.", hours: "يوميًا ما عدا الجمعة" },
        { name: "عيادة مدينة نصر", address: "شارع مصطفى النحاس — بعد المنهل وبجوار سنتر أنوار المدينة، عمارة 7، الدور الثاني.", hours: "يوميًا ما عدا الجمعة" },
      ]
    : [
        { name: "Fifth Settlement Clinic", address: "Silver Star Mall — above Saoudi Market, 1st floor.", hours: "Daily except Friday" },
        { name: "Nasr City Clinic", address: "Mostafa El-Nahas St. — next to Anwar El-Madina Center, Building 7, 2nd floor.", hours: "Daily except Friday" },
      ];

  const pins = [
    { name: clinics[0].name, address: clinics[0].address, area: isAr ? "التجمع الخامس" : "Fifth Settlement", phone: "01063337333", url: "https://maps.google.com/?q=Silver+Star+Mall,+New+Cairo,+Egypt" },
    { name: clinics[1].name, address: clinics[1].address, area: isAr ? "مدينة نصر" : "Nasr City", phone: "01022399994", url: "https://maps.google.com/?q=Mostafa+El-Nahas+Street,+Nasr+City,+Cairo,+Egypt" },
  ];

  return { t, clinics, pins };
}

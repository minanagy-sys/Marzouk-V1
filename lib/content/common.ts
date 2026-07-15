import type { Lang } from "@/lib/lang";

/**
 * Shared content used by the Navbar, Footer and floating buttons on every page.
 * Centralized here so it maps directly onto a Supabase `site_content` table later.
 */
export const COMMON = {
  ar: {
    brand: "د. أحمد مرزوق",
    brandSub: "استشاري النساء والتوليد وجراحة الأورام",
    navHome: "الرئيسية",
    navAbout: "عن الدكتور",
    navServices: "خدماتنا",
    navCases: "الحالات",
    navSuccess: "قصص نجاح",
    navCelebs: "المشاهير",
    navBlogs: "المدونة",
    navMedia: "الإعلام",
    navGallery: "الصور",
    navVideos: "فيديوهات",
    navContact: "اتصل بنا",
    book: "احجز الآن",
    langBtn: "English",
    footerLinks: "روابط سريعة",
    footerContact: "تواصل معنا",
    footerAbout:
      "كل امرأة تستحق ولادة بدون ألم، وأن تستمتع باليوم الذي تلتقي فيه بصغيرها وتعتز به مدى الحياة، ومن حقها الحفاظ على جنينها وقدرتها على الإنجاب حتى مع الأورام الليفية المعقدة.",
    clinic1: "عيادة التجمع الخامس: سيلفر ستار مول — فوق سوبر ماركت سعودي، الدور الأول.",
    clinic2: "عيادة مدينة نصر: شارع مصطفى النحاس — عمارة 7، الدور الثاني.",
    copyright: "© 2026 د. أحمد مرزوق — جميع الحقوق محفوظة",
  },
  en: {
    brand: "Dr. Ahmed Marzouk",
    brandSub: "Consultant of OB-GYN & Oncologic Surgery",
    navHome: "Home",
    navAbout: "About",
    navServices: "Our Services",
    navCases: "Cases",
    navSuccess: "Success Stories",
    navCelebs: "Celebrities",
    navBlogs: "Blogs",
    navMedia: "Media",
    navGallery: "Gallery",
    navVideos: "Videos",
    navContact: "Contact Us",
    book: "Book Now",
    langBtn: "عربي",
    footerLinks: "Quick Links",
    footerContact: "Contact",
    footerAbout:
      "Every woman deserves a pain-free delivery — to enjoy and cherish the day she meets her little one, and to preserve her pregnancy and fertility even with complex fibroids.",
    clinic1: "Fifth Settlement Clinic: Silver Star Mall — above Saoudi Market, 1st floor.",
    clinic2: "Nasr City Clinic: Mostafa El-Nahas St. — Building 7, 2nd floor.",
    copyright: "© 2026 Dr. Ahmed Marzouk — All rights reserved",
  },
} as const;

// Contact details are language-independent.
export const CONTACT_INFO = {
  phone1: "01063337333",
  phone2: "01022399994",
  whatsapp: "201063337333",
  email: "info@ahmedmarzouk.com",
  facebook: "https://www.facebook.com/Dr.AhmedMarzouk.official/",
  youtube: "https://www.youtube.com/channel/UCxxu2t7HkvFdMSOKTYUnrdQ",
  instagram: "https://www.instagram.com/dr.ahmed.marzok/",
};

export function common(lang: Lang) {
  return COMMON[lang];
}

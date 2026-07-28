// Central site config used for SEO/metadata, sitemap and structured data.
export const SITE = {
  // Update this to your production domain (or set NEXT_PUBLIC_SITE_URL in env).
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ahmedmarzouk.com",
  nameAr: "د. أحمد مرزوق",
  nameEn: "Dr. Ahmed Marzouk",
  phone: "01063337333",
  phone2: "01022399994",
  email: "info@ahmedmarzouk.com",
  clinics: [
    {
      nameEn: "Fifth Settlement Clinic",
      nameAr: "عيادة التجمع الخامس",
      addressEn: "Polaris Mall, Fifth Settlement, New Cairo",
      addressAr: "بولاريس مول، التجمع الخامس، القاهرة الجديدة",
      city: "New Cairo",
      region: "Cairo",
      country: "EG",
    },
  ],
};

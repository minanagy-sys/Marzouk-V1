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
      addressEn: "Silver Star Mall — above Saoudi Market, 1st floor, New Cairo",
      addressAr: "سيلفر ستار مول — فوق سوبر ماركت سعودي، الدور الأول، التجمع الخامس",
      city: "New Cairo",
      region: "Cairo",
      country: "EG",
    },
    {
      nameEn: "Nasr City Clinic",
      nameAr: "عيادة مدينة نصر",
      addressEn: "Mostafa El-Nahas St. — Building 7, 2nd floor, Nasr City",
      addressAr: "شارع مصطفى النحاس — عمارة 7، الدور الثاني، مدينة نصر",
      city: "Nasr City",
      region: "Cairo",
      country: "EG",
    },
  ],
};

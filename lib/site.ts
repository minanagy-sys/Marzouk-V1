// Central site config used for SEO/metadata, sitemap and structured data.
// The canonical host MUST match the host the site is actually served on
// (www vs apex). Set NEXT_PUBLIC_SITE_URL in the environment to the live
// https + www domain; the trailing slash is stripped so URLs never double up.
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.doctorahmedmarzouk.com").replace(/\/+$/, ""),
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
      addressAr: "بولاريس مول، القاهرة الجديدة",
      city: "New Cairo",
      region: "Cairo",
      country: "EG",
    },
  ],
};

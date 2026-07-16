// Config-driven admin. Every field renders as a friendly input (text, textarea,
// image upload, icon, dropdown, repeatable groups) — no code/JSON editing.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "icon"
  | "date"
  | "paragraphs" // stored as string[]; edited as one textarea (blank line = new paragraph)
  | "richtext"   // stored as HTML string; edited with a formatting toolbar
  | "repeater"   // stored as array of objects; edited as add/remove item cards
  | "reference"; // stored as an id; edited as a dropdown from another table

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  help?: string;
  group?: string;        // visual grouping in the form
  subfields?: Field[];   // for repeater
  itemLabel?: string;    // for repeater item heading
  refTable?: string;     // for reference
  refLabelColumn?: string; // column shown in the reference dropdown
};

export type Collection = {
  table: string;
  label: string;
  labelAr: string;
  singular: string;
  icon: string;
  group: "Pages" | "Content" | "Blog" | "System";
  listColumns: string[];
  titleColumn: string;
  defaultOrder: string;
  readOnly?: boolean;
  fields: Field[];
};

const publish: Field[] = [
  { name: "is_published", label: "Published (visible on site)", type: "boolean", group: "Settings" },
  { name: "sort_order", label: "Display order", type: "number", group: "Settings" },
];

export const COLLECTIONS: Record<string, Collection> = {
  services: {
    table: "services", label: "Services", labelAr: "الخدمات", singular: "Service", icon: "🩺", group: "Content",
    listColumns: ["title_ar", "tag_ar", "sort_order", "is_published"], titleColumn: "title_ar", defaultOrder: "sort_order",
    fields: [
      { name: "slug", label: "Page link (slug)", type: "text", help: "e.g. pain-free-cesarean", group: "Settings" },
      ...publish,
      { name: "glyph", label: "Icon", type: "icon", group: "Basics" },
      { name: "image_url", label: "Main image", type: "image", group: "Basics" },
      { name: "tag_ar", label: "Tag (Arabic)", type: "text", group: "Basics" },
      { name: "tag_en", label: "Tag (English)", type: "text", group: "Basics" },
      { name: "title_ar", label: "Title (Arabic)", type: "text", group: "Basics" },
      { name: "title_en", label: "Title (English)", type: "text", group: "Basics" },
      { name: "short_desc_ar", label: "Short description (Arabic)", type: "textarea", group: "Basics" },
      { name: "short_desc_en", label: "Short description (English)", type: "textarea", group: "Basics" },
      { name: "hero_sub_ar", label: "Hero subtitle (Arabic)", type: "textarea", group: "Detail page" },
      { name: "hero_sub_en", label: "Hero subtitle (English)", type: "textarea", group: "Detail page" },
      { name: "intro_ar", label: "Intro paragraph (Arabic)", type: "textarea", group: "Detail page" },
      { name: "intro_en", label: "Intro paragraph (English)", type: "textarea", group: "Detail page" },
      {
        name: "sections", label: "Content sections", type: "repeater", group: "Detail page", itemLabel: "Section",
        subfields: [
          { name: "heading_ar", label: "Heading (Arabic)", type: "text" },
          { name: "heading_en", label: "Heading (English)", type: "text" },
          { name: "body_ar", label: "Body (Arabic)", type: "textarea" },
          { name: "body_en", label: "Body (English)", type: "textarea" },
        ],
      },
      {
        name: "benefits", label: "Benefits", type: "repeater", group: "Detail page", itemLabel: "Benefit",
        subfields: [
          { name: "ar", label: "Benefit (Arabic)", type: "text" },
          { name: "en", label: "Benefit (English)", type: "text" },
        ],
      },
      {
        name: "faq", label: "FAQ", type: "repeater", group: "Detail page", itemLabel: "Question",
        subfields: [
          { name: "q_ar", label: "Question (Arabic)", type: "text" },
          { name: "q_en", label: "Question (English)", type: "text" },
          { name: "a_ar", label: "Answer (Arabic)", type: "textarea" },
          { name: "a_en", label: "Answer (English)", type: "textarea" },
        ],
      },
      { name: "meta_title_ar", label: "SEO title (Arabic)", type: "text", group: "SEO" },
      { name: "meta_title_en", label: "SEO title (English)", type: "text", group: "SEO" },
      { name: "meta_desc_ar", label: "SEO description (Arabic)", type: "textarea", group: "SEO" },
      { name: "meta_desc_en", label: "SEO description (English)", type: "textarea", group: "SEO" },
    ],
  },

  cases: {
    table: "cases", label: "Cases", labelAr: "الحالات", singular: "Case", icon: "⭐", group: "Content",
    listColumns: ["title_ar", "category", "sort_order", "is_published"], titleColumn: "title_ar", defaultOrder: "sort_order",
    fields: [
      { name: "slug", label: "Page link (slug)", type: "text", group: "Settings" },
      { name: "category", label: "Type", type: "select", options: ["success", "celebrity"], group: "Settings" },
      ...publish,
      { name: "image_url", label: "Image", type: "image", group: "Basics" },
      { name: "tag_ar", label: "Tag (Arabic)", type: "text", group: "Basics" },
      { name: "tag_en", label: "Tag (English)", type: "text", group: "Basics" },
      { name: "title_ar", label: "Title (Arabic)", type: "text", group: "Basics" },
      { name: "title_en", label: "Title (English)", type: "text", group: "Basics" },
      { name: "excerpt_ar", label: "Short summary (Arabic)", type: "textarea", group: "Basics" },
      { name: "excerpt_en", label: "Short summary (English)", type: "textarea", group: "Basics" },
      { name: "body_ar", label: "Full story (Arabic)", type: "textarea", group: "Story" },
      { name: "body_en", label: "Full story (English)", type: "textarea", group: "Story" },
    ],
  },

  blog_categories: {
    table: "blog_categories", label: "Blog categories", labelAr: "تصنيفات المدونة", singular: "Category", icon: "🏷️", group: "Blog",
    listColumns: ["name_ar", "name_en", "sort_order", "is_published"], titleColumn: "name_ar", defaultOrder: "sort_order",
    fields: [
      { name: "slug", label: "Link (slug)", type: "text", group: "Settings" },
      ...publish,
      { name: "name_ar", label: "Name (Arabic)", type: "text", group: "Basics" },
      { name: "name_en", label: "Name (English)", type: "text", group: "Basics" },
    ],
  },

  blog_posts: {
    table: "blog_posts", label: "Blog posts", labelAr: "مقالات المدونة", singular: "Post", icon: "📝", group: "Blog",
    listColumns: ["title_ar", "published_date", "is_published"], titleColumn: "title_ar", defaultOrder: "sort_order",
    fields: [
      { name: "slug", label: "Page link (slug)", type: "text", group: "Settings" },
      { name: "category_id", label: "Category", type: "reference", refTable: "blog_categories", refLabelColumn: "name_ar", group: "Settings" },
      ...publish,
      { name: "image_url", label: "Cover image", type: "image", group: "Basics" },
      { name: "published_date", label: "Date", type: "date", group: "Basics" },
      { name: "tag_ar", label: "Tag (Arabic)", type: "text", group: "Basics" },
      { name: "tag_en", label: "Tag (English)", type: "text", group: "Basics" },
      { name: "title_ar", label: "Title (Arabic)", type: "text", group: "Basics" },
      { name: "title_en", label: "Title (English)", type: "text", group: "Basics" },
      { name: "excerpt_ar", label: "Short summary (Arabic)", type: "textarea", group: "Basics" },
      { name: "excerpt_en", label: "Short summary (English)", type: "textarea", group: "Basics" },
      { name: "body_ar", label: "Article body (Arabic)", type: "richtext", group: "Article" },
      { name: "body_en", label: "Article body (English)", type: "richtext", group: "Article" },
      { name: "meta_title_ar", label: "SEO title (Arabic)", type: "text", group: "SEO" },
      { name: "meta_title_en", label: "SEO title (English)", type: "text", group: "SEO" },
      { name: "meta_desc_ar", label: "SEO description (Arabic)", type: "textarea", group: "SEO" },
      { name: "meta_desc_en", label: "SEO description (English)", type: "textarea", group: "SEO" },
    ],
  },

  media_items: {
    table: "media_items", label: "Media", labelAr: "الإعلام", singular: "Media item", icon: "🖼️", group: "Content",
    listColumns: ["title_ar", "type", "sort_order", "is_published"], titleColumn: "title_ar", defaultOrder: "sort_order",
    fields: [
      { name: "type", label: "Type", type: "select", options: ["gallery", "video"], group: "Settings" },
      ...publish,
      { name: "image_url", label: "Image / thumbnail", type: "image", group: "Basics" },
      { name: "video_url", label: "Video link (YouTube)", type: "text", group: "Basics" },
      { name: "title_ar", label: "Title (Arabic)", type: "text", group: "Basics" },
      { name: "title_en", label: "Title (English)", type: "text", group: "Basics" },
    ],
  },

  celebrities: {
    table: "celebrities", label: "Celebrities", labelAr: "المشاهير", singular: "Celebrity", icon: "🌟", group: "Content",
    listColumns: ["name_ar", "sort_order", "is_published"], titleColumn: "name_ar", defaultOrder: "sort_order",
    fields: [
      ...publish,
      { name: "image_url", label: "Photo", type: "image", group: "Basics" },
      { name: "name_ar", label: "Name (Arabic)", type: "text", group: "Basics" },
      { name: "name_en", label: "Name (English)", type: "text", group: "Basics" },
      { name: "caption_ar", label: "Caption (Arabic)", type: "textarea", group: "Basics" },
      { name: "caption_en", label: "Caption (English)", type: "textarea", group: "Basics" },
    ],
  },

  testimonials: {
    table: "testimonials", label: "Testimonials", labelAr: "آراء العملاء", singular: "Testimonial", icon: "💬", group: "Content",
    listColumns: ["name", "sort_order", "is_published"], titleColumn: "name", defaultOrder: "sort_order",
    fields: [
      ...publish,
      { name: "name", label: "Patient name", type: "text", group: "Basics" },
      { name: "text_ar", label: "Testimonial (Arabic)", type: "textarea", group: "Basics" },
      { name: "text_en", label: "Testimonial (English)", type: "textarea", group: "Basics" },
    ],
  },

  clinics: {
    table: "clinics", label: "Clinics", labelAr: "العيادات", singular: "Clinic", icon: "📍", group: "Content",
    listColumns: ["name_ar", "phone", "sort_order", "is_published"], titleColumn: "name_ar", defaultOrder: "sort_order",
    fields: [
      ...publish,
      { name: "phone", label: "Phone", type: "text", group: "Basics" },
      { name: "maps_url", label: "Google Maps link", type: "text", group: "Basics" },
      { name: "name_ar", label: "Name (Arabic)", type: "text", group: "Basics" },
      { name: "name_en", label: "Name (English)", type: "text", group: "Basics" },
      { name: "address_ar", label: "Address (Arabic)", type: "textarea", group: "Basics" },
      { name: "address_en", label: "Address (English)", type: "textarea", group: "Basics" },
      { name: "hours_ar", label: "Hours (Arabic)", type: "text", group: "Basics" },
      { name: "hours_en", label: "Hours (English)", type: "text", group: "Basics" },
      { name: "area_ar", label: "Area label (Arabic)", type: "text", group: "Map" },
      { name: "area_en", label: "Area label (English)", type: "text", group: "Map" },
    ],
  },

  site_content: {
    table: "site_content", label: "Site text", labelAr: "نصوص الموقع", singular: "Text block", icon: "🔤", group: "System",
    listColumns: ["key", "section"], titleColumn: "key", defaultOrder: "key",
    fields: [
      { name: "key", label: "Key", type: "text", help: "e.g. home.msgTitle", group: "Settings" },
      { name: "section", label: "Section", type: "text", group: "Settings" },
      { name: "value_ar", label: "Text (Arabic)", type: "textarea", group: "Basics" },
      { name: "value_en", label: "Text (English)", type: "textarea", group: "Basics" },
    ],
  },

  bookings: {
    table: "bookings", label: "Bookings", labelAr: "الحجوزات", singular: "Booking", icon: "📥", group: "System", readOnly: true,
    listColumns: ["name", "phone", "service", "status", "created_at"], titleColumn: "name", defaultOrder: "created_at",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "service", label: "Service", type: "text" },
      { name: "message", label: "Message", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: ["new", "contacted", "confirmed", "done", "cancelled"] },
    ],
  },
};

export const COLLECTION_KEYS = Object.keys(COLLECTIONS);

export const GROUPS: Collection["group"][] = ["Content", "Blog", "System"];

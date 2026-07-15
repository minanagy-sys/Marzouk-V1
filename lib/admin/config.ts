// Config-driven admin: each collection is described here and the generic
// list/edit UI + API render from it. Column names match the Supabase schema.

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "image" | "json" | "date";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[]; // for select
  help?: string;
};

export type Collection = {
  table: string;
  label: string;
  labelAr: string;
  singular: string;
  listColumns: string[]; // columns shown in the list view
  titleColumn: string; // used as row heading
  defaultOrder: string; // order column
  readOnly?: boolean;
  fields: Field[];
};

const publishFields: Field[] = [
  { name: "is_published", label: "Published", type: "boolean" },
  { name: "sort_order", label: "Sort order", type: "number" },
];

export const COLLECTIONS: Record<string, Collection> = {
  services: {
    table: "services",
    label: "Services",
    labelAr: "الخدمات",
    singular: "Service",
    listColumns: ["title_ar", "tag_ar", "sort_order", "is_published"],
    titleColumn: "title_ar",
    defaultOrder: "sort_order",
    fields: [
      { name: "slug", label: "Slug (URL)", type: "text", help: "lowercase-with-dashes" },
      ...publishFields,
      { name: "glyph", label: "Icon glyph", type: "text" },
      { name: "image_url", label: "Image URL", type: "image" },
      { name: "span_gc", label: "Grid column span", type: "text" },
      { name: "span_gr", label: "Grid row span", type: "text" },
      { name: "tag_ar", label: "Tag (AR)", type: "text" },
      { name: "tag_en", label: "Tag (EN)", type: "text" },
      { name: "title_ar", label: "Title (AR)", type: "text" },
      { name: "title_en", label: "Title (EN)", type: "text" },
      { name: "short_desc_ar", label: "Short description (AR)", type: "textarea" },
      { name: "short_desc_en", label: "Short description (EN)", type: "textarea" },
      { name: "hero_sub_ar", label: "Hero subtitle (AR)", type: "textarea" },
      { name: "hero_sub_en", label: "Hero subtitle (EN)", type: "textarea" },
      { name: "intro_ar", label: "Intro (AR)", type: "textarea" },
      { name: "intro_en", label: "Intro (EN)", type: "textarea" },
      { name: "sections", label: "Sections (JSON)", type: "json", help: '[{"heading_ar","heading_en","body_ar","body_en"}]' },
      { name: "benefits", label: "Benefits (JSON)", type: "json", help: '[{"ar","en"}]' },
      { name: "faq", label: "FAQ (JSON)", type: "json", help: '[{"q_ar","q_en","a_ar","a_en"}]' },
      { name: "meta_title_ar", label: "Meta title (AR)", type: "text" },
      { name: "meta_title_en", label: "Meta title (EN)", type: "text" },
      { name: "meta_desc_ar", label: "Meta description (AR)", type: "textarea" },
      { name: "meta_desc_en", label: "Meta description (EN)", type: "textarea" },
    ],
  },
  cases: {
    table: "cases",
    label: "Cases",
    labelAr: "الحالات",
    singular: "Case",
    listColumns: ["title_ar", "category", "sort_order", "is_published"],
    titleColumn: "title_ar",
    defaultOrder: "sort_order",
    fields: [
      { name: "slug", label: "Slug (URL)", type: "text" },
      { name: "category", label: "Category", type: "select", options: ["success", "celebrity"] },
      ...publishFields,
      { name: "image_url", label: "Image URL", type: "image" },
      { name: "tag_ar", label: "Tag (AR)", type: "text" },
      { name: "tag_en", label: "Tag (EN)", type: "text" },
      { name: "title_ar", label: "Title (AR)", type: "text" },
      { name: "title_en", label: "Title (EN)", type: "text" },
      { name: "excerpt_ar", label: "Excerpt (AR)", type: "textarea" },
      { name: "excerpt_en", label: "Excerpt (EN)", type: "textarea" },
      { name: "body_ar", label: "Body (AR)", type: "textarea" },
      { name: "body_en", label: "Body (EN)", type: "textarea" },
    ],
  },
  blog_posts: {
    table: "blog_posts",
    label: "Blog posts",
    labelAr: "المدونة",
    singular: "Post",
    listColumns: ["title_ar", "tag_ar", "published_date", "is_published"],
    titleColumn: "title_ar",
    defaultOrder: "sort_order",
    fields: [
      { name: "slug", label: "Slug (URL)", type: "text" },
      ...publishFields,
      { name: "image_url", label: "Image URL", type: "image" },
      { name: "published_date", label: "Date", type: "date" },
      { name: "tag_ar", label: "Tag (AR)", type: "text" },
      { name: "tag_en", label: "Tag (EN)", type: "text" },
      { name: "title_ar", label: "Title (AR)", type: "text" },
      { name: "title_en", label: "Title (EN)", type: "text" },
      { name: "excerpt_ar", label: "Excerpt (AR)", type: "textarea" },
      { name: "excerpt_en", label: "Excerpt (EN)", type: "textarea" },
      { name: "body_ar", label: "Body paragraphs (JSON array, AR)", type: "json", help: '["para 1","para 2"]' },
      { name: "body_en", label: "Body paragraphs (JSON array, EN)", type: "json", help: '["para 1","para 2"]' },
      { name: "meta_title_ar", label: "Meta title (AR)", type: "text" },
      { name: "meta_title_en", label: "Meta title (EN)", type: "text" },
      { name: "meta_desc_ar", label: "Meta description (AR)", type: "textarea" },
      { name: "meta_desc_en", label: "Meta description (EN)", type: "textarea" },
    ],
  },
  media_items: {
    table: "media_items",
    label: "Media",
    labelAr: "الإعلام",
    singular: "Media item",
    listColumns: ["title_ar", "type", "sort_order", "is_published"],
    titleColumn: "title_ar",
    defaultOrder: "sort_order",
    fields: [
      { name: "type", label: "Type", type: "select", options: ["gallery", "video"] },
      ...publishFields,
      { name: "image_url", label: "Image URL", type: "image" },
      { name: "video_url", label: "Video URL (YouTube)", type: "text" },
      { name: "span_gc", label: "Grid column span", type: "text" },
      { name: "span_gr", label: "Grid row span", type: "text" },
      { name: "title_ar", label: "Title (AR)", type: "text" },
      { name: "title_en", label: "Title (EN)", type: "text" },
    ],
  },
  celebrities: {
    table: "celebrities",
    label: "Celebrities",
    labelAr: "المشاهير",
    singular: "Celebrity",
    listColumns: ["name_ar", "sort_order", "is_published"],
    titleColumn: "name_ar",
    defaultOrder: "sort_order",
    fields: [
      ...publishFields,
      { name: "image_url", label: "Image URL", type: "image" },
      { name: "name_ar", label: "Name (AR)", type: "text" },
      { name: "name_en", label: "Name (EN)", type: "text" },
      { name: "caption_ar", label: "Caption (AR)", type: "textarea" },
      { name: "caption_en", label: "Caption (EN)", type: "textarea" },
    ],
  },
  testimonials: {
    table: "testimonials",
    label: "Testimonials",
    labelAr: "آراء العملاء",
    singular: "Testimonial",
    listColumns: ["name", "sort_order", "is_published"],
    titleColumn: "name",
    defaultOrder: "sort_order",
    fields: [
      ...publishFields,
      { name: "name", label: "Name", type: "text" },
      { name: "text_ar", label: "Text (AR)", type: "textarea" },
      { name: "text_en", label: "Text (EN)", type: "textarea" },
    ],
  },
  clinics: {
    table: "clinics",
    label: "Clinics",
    labelAr: "العيادات",
    singular: "Clinic",
    listColumns: ["name_ar", "phone", "sort_order", "is_published"],
    titleColumn: "name_ar",
    defaultOrder: "sort_order",
    fields: [
      ...publishFields,
      { name: "phone", label: "Phone", type: "text" },
      { name: "maps_url", label: "Google Maps URL", type: "text" },
      { name: "latitude", label: "Latitude", type: "number" },
      { name: "longitude", label: "Longitude", type: "number" },
      { name: "name_ar", label: "Name (AR)", type: "text" },
      { name: "name_en", label: "Name (EN)", type: "text" },
      { name: "address_ar", label: "Address (AR)", type: "textarea" },
      { name: "address_en", label: "Address (EN)", type: "textarea" },
      { name: "hours_ar", label: "Hours (AR)", type: "text" },
      { name: "hours_en", label: "Hours (EN)", type: "text" },
      { name: "area_ar", label: "Area label (AR)", type: "text" },
      { name: "area_en", label: "Area label (EN)", type: "text" },
    ],
  },
  site_content: {
    table: "site_content",
    label: "Site text",
    labelAr: "نصوص الموقع",
    singular: "Text block",
    listColumns: ["key", "section"],
    titleColumn: "key",
    defaultOrder: "key",
    fields: [
      { name: "key", label: "Key", type: "text", help: "page.field e.g. home.msgTitle" },
      { name: "section", label: "Section", type: "text" },
      { name: "value_ar", label: "Value (AR)", type: "textarea" },
      { name: "value_en", label: "Value (EN)", type: "textarea" },
    ],
  },
  bookings: {
    table: "bookings",
    label: "Bookings",
    labelAr: "الحجوزات",
    singular: "Booking",
    listColumns: ["name", "phone", "service", "status", "created_at"],
    titleColumn: "name",
    defaultOrder: "created_at",
    readOnly: true,
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

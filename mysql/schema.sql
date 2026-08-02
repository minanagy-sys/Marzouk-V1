-- ============================================================================
-- Dr. Ahmed Marzouk — MySQL schema (Hostinger build)
-- MySQL 8.0+ / MariaDB 10.4+. Run once in phpMyAdmin or the MySQL client.
--
-- Notes vs the old Postgres/Supabase schema:
--   uuid          -> CHAR(36)      (the app/scripts always supply a UUID)
--   jsonb         -> JSON
--   boolean       -> TINYINT(1)    (adapter casts 0/1 <-> true/false)
--   timestamptz   -> TIMESTAMP     (updated_at auto-updates; replaces triggers)
--   Row-Level Security -> enforced in the app (all DB access is server-side)
--
-- Unique text columns use VARCHAR(191) so they fit utf8mb4 indexes.
-- ============================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------------
-- SITE CONTENT (editable text blocks; key = "<page>.<field>")
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_content (
  id          CHAR(36) NOT NULL PRIMARY KEY,
  `key`       VARCHAR(191) NOT NULL UNIQUE,
  value_ar    TEXT,
  value_en    TEXT,
  section     VARCHAR(191),
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- SERVICE CATEGORIES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_categories (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  slug         VARCHAR(191) NOT NULL UNIQUE,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  name_ar      TEXT,
  name_en      TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- SERVICES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id            CHAR(36) NOT NULL PRIMARY KEY,
  slug          VARCHAR(191) NOT NULL UNIQUE,
  slug_ar       VARCHAR(191),
  slug_en       VARCHAR(191),
  category_id   CHAR(36),
  parent_id     CHAR(36),
  sort_order    INT NOT NULL DEFAULT 0,
  is_published  TINYINT(1) NOT NULL DEFAULT 1,
  show_on_home  TINYINT(1) NOT NULL DEFAULT 1,
  glyph         TEXT,
  image_url     TEXT,
  span_gc       VARCHAR(32) DEFAULT 'auto',
  span_gr       VARCHAR(32) DEFAULT 'auto',
  tag_ar        TEXT, tag_en        TEXT,
  title_ar      TEXT, title_en      TEXT,
  short_desc_ar TEXT, short_desc_en TEXT,
  hero_sub_ar   TEXT, hero_sub_en   TEXT,
  intro_ar      TEXT, intro_en      TEXT,
  sections      JSON,
  benefits      JSON,
  faq           JSON,
  meta_title_ar TEXT, meta_title_en TEXT,
  meta_desc_ar  TEXT, meta_desc_en  TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_services_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- CASES (category: 'success' | 'celebrity')
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cases (
  id            CHAR(36) NOT NULL PRIMARY KEY,
  slug          VARCHAR(191) NOT NULL UNIQUE,
  slug_ar       VARCHAR(191),
  slug_en       VARCHAR(191),
  category      VARCHAR(32) NOT NULL DEFAULT 'success',
  sort_order    INT NOT NULL DEFAULT 0,
  is_published  TINYINT(1) NOT NULL DEFAULT 1,
  show_on_home  TINYINT(1) NOT NULL DEFAULT 1,
  image_url     TEXT,
  image_url_2   TEXT,
  tag_ar        TEXT, tag_en        TEXT,
  title_ar      TEXT, title_en      TEXT,
  excerpt_ar    TEXT, excerpt_en    TEXT,
  body_ar       TEXT, body_en       TEXT,
  meta_title_ar TEXT, meta_title_en TEXT,
  meta_desc_ar  TEXT, meta_desc_en  TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- BLOG CATEGORIES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_categories (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  slug         VARCHAR(191) NOT NULL UNIQUE,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  name_ar      TEXT,
  name_en      TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- BLOG POSTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id            CHAR(36) NOT NULL PRIMARY KEY,
  slug          VARCHAR(191) NOT NULL UNIQUE,
  slug_ar       VARCHAR(191),
  slug_en       VARCHAR(191),
  category_id   CHAR(36),
  sort_order    INT NOT NULL DEFAULT 0,
  is_published  TINYINT(1) NOT NULL DEFAULT 1,
  show_on_home  TINYINT(1) NOT NULL DEFAULT 1,
  image_url     TEXT,
  published_date DATE,
  tag_ar        TEXT, tag_en        TEXT,
  title_ar      TEXT, title_en      TEXT,
  excerpt_ar    TEXT, excerpt_en    TEXT,
  body_ar       JSON,
  body_en       JSON,
  meta_title_ar TEXT, meta_title_en TEXT,
  meta_desc_ar  TEXT, meta_desc_en  TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_blog_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- MEDIA (type: 'gallery' | 'video')
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_items (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  type         VARCHAR(32) NOT NULL DEFAULT 'gallery',
  sort_order   INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  image_url    TEXT,
  video_url    TEXT,
  span_gc      VARCHAR(32) DEFAULT 'auto',
  span_gr      VARCHAR(32) DEFAULT 'auto',
  title_ar     TEXT, title_en     TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- CELEBRITIES (legacy home strip; kept for compatibility)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS celebrities (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  show_on_home TINYINT(1) NOT NULL DEFAULT 1,
  image_url    TEXT,
  name_ar      TEXT, name_en      TEXT,
  caption_ar   TEXT, caption_en   TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- TESTIMONIALS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  show_on_home TINYINT(1) NOT NULL DEFAULT 1,
  rating       INT NOT NULL DEFAULT 5,
  name         TEXT,
  text_ar      TEXT, text_en      TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- CLINICS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clinics (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  phone        TEXT,
  maps_url     TEXT,
  latitude     DOUBLE,
  longitude    DOUBLE,
  name_ar      TEXT, name_en      TEXT,
  address_ar   TEXT, address_en   TEXT,
  hours_ar     TEXT, hours_en     TEXT,
  area_ar      TEXT, area_en      TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- BOOKINGS (contact form submissions)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id         CHAR(36) NOT NULL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT,
  service    TEXT,
  message    TEXT,
  lang       VARCHAR(8) DEFAULT 'ar',
  status     VARCHAR(32) DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- HERO SLIDES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_slides (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  image_url    TEXT,
  image_url_ar TEXT,
  kicker_ar    TEXT, kicker_en    TEXT,
  title1_ar    TEXT, title1_en    TEXT,
  title2_ar    TEXT, title2_en    TEXT,
  sub_ar       TEXT, sub_en       TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- HERO STATS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_stats (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  num_ar       TEXT, num_en       TEXT,
  label_ar     TEXT, label_en     TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- VALUE ITEMS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS value_items (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  num          TEXT,
  title_ar     TEXT, title_en     TEXT,
  body_ar      TEXT, body_en      TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- FEATURE ITEMS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feature_items (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  glyph        TEXT,
  title_ar     TEXT, title_en     TEXT,
  desc_ar      TEXT, desc_en      TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- INSTAGRAM POSTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS instagram_posts (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  external_id  VARCHAR(191) UNIQUE,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  image_url    TEXT,
  permalink    TEXT,
  is_video     TINYINT(1) NOT NULL DEFAULT 0,
  caption_ar   TEXT, caption_en   TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- ADMIN USERS (replaces Supabase Auth) — role: 'admin' | 'editor'
-- Create accounts with:  npm run create-admin
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id            CHAR(36) NOT NULL PRIMARY KEY,
  email         VARCHAR(191) NOT NULL UNIQUE,
  name          VARCHAR(191),
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'editor',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

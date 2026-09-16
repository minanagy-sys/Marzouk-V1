-- Recovery follow-ups: (1) fix the broken photo on the endometriosis-diagnosis
-- blog card, (2) categorize the 5 original launch blogs so the category filter
-- is complete (the 30 recovered blogs are handled in recovery_blog_categories.sql).
-- Idempotent: category set only when empty; image only replaces the broken file.
START TRANSACTION;

-- (1) Broken image: 1788367794604-19f9ae32.webp is not on the server. Reuse the
-- endometriosis-care service image (a valid file, same topic).
UPDATE `blog_posts`
   SET `image_url`='/uploads/1787755100034-82ac48cf.webp',
       `image_alt_ar`='بطانة الرحم المهاجرة — د. أحمد مرزوق',
       `image_alt_en`='Endometriosis — Dr. Ahmed Marzouk'
 WHERE `slug`='endometriosis-diagnosis';

-- (2) Categorize the original launch blogs (category filter completeness).
UPDATE `blog_posts` SET `category_id`='e2aa7a58-7428-4a68-9fb6-33f0c639d0c7' WHERE `slug`='pregnancy-month-by-month'       AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='7e525533-0853-4e27-9bdd-66872a456aad' WHERE `slug`='endometriosis-diagnosis'         AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='7f50bf4d-4c29-4385-b5a6-b93ca5db9ee1' WHERE `slug`='fibroids-symptoms-surgery'        AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `slug`='routine-gynecological-checkups'   AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='2d4dfa9c-e618-4133-953a-0e5d059cc7a1' WHERE `slug`='tummy-tuck-cesarean'              AND (`category_id` IS NULL OR `category_id`='');

COMMIT;

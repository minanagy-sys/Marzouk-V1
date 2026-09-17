-- Recovery: focus keywords for the remaining seed blog(s) that were still empty.
-- Columns already exist; matched by slug, only when empty. Idempotent.
START TRANSACTION;
UPDATE `blog_posts` SET `keywords_ar`='الولادة بدون ألم, الولادة القيصرية بدون ألم, الولادة الطبيعية بدون ألم, ما هي الولادة بدون ألم', `keywords_en`='pain-free delivery, painless cesarean, painless natural birth, what is pain-free delivery' WHERE `slug`='pain-free-delivery' AND (`keywords_ar` IS NULL OR `keywords_ar`='');
COMMIT;

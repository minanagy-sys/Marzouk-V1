-- Recovery: focus keywords for the 5 original LAUNCH blogs (created 2026-07-15,
-- not part of the recovered set). Columns already exist; matched by slug. Idempotent.
ALTER TABLE `blog_posts` ADD COLUMN IF NOT EXISTS `keywords_ar` TEXT NULL, ADD COLUMN IF NOT EXISTS `keywords_en` TEXT NULL;
START TRANSACTION;
UPDATE `blog_posts` SET `keywords_ar`='مراحل الحمل, الحمل شهر بشهر, أعراض الحمل, تطور الجنين أثناء الحمل', `keywords_en`='pregnancy month by month, stages of pregnancy, pregnancy symptoms, fetal development' WHERE `slug`='pregnancy-month-by-month' AND (`keywords_ar` IS NULL OR `keywords_ar`='');
UPDATE `blog_posts` SET `keywords_ar`='بطانة الرحم المهاجرة, تشخيص بطانة الرحم المهاجرة, اعراض بطانة الرحم المهاجرة, هل بطانة الرحم المهاجرة تظهر في السونار', `keywords_en`='endometriosis diagnosis, endometriosis symptoms, endometriosis on ultrasound' WHERE `slug`='endometriosis-diagnosis' AND (`keywords_ar` IS NULL OR `keywords_ar`='');
UPDATE `blog_posts` SET `keywords_ar`='الورم الليفي, اعراض الورم الليفي, عملية استئصال الورم الليفي, علاج الأورام الليفية', `keywords_en`='fibroid symptoms, fibroid surgery, fibroid treatment, uterine fibroids' WHERE `slug`='fibroids-symptoms-surgery' AND (`keywords_ar` IS NULL OR `keywords_ar`='');
UPDATE `blog_posts` SET `keywords_ar`='الكشف الدوري النسائي, فحص النساء الدوري, أهمية الكشف عند طبيب النساء', `keywords_en`='routine gynecological checkups, gynecology exam, women''s health screening' WHERE `slug`='routine-gynecological-checkups' AND (`keywords_ar` IS NULL OR `keywords_ar`='');
UPDATE `blog_posts` SET `keywords_ar`='شد البطن مع الولادة القيصرية, شد البطن بعد القيصرية, عملية شد البطن مع القيصري', `keywords_en`='tummy tuck with cesarean, abdominoplasty after c-section, mommy makeover' WHERE `slug`='tummy-tuck-cesarean' AND (`keywords_ar` IS NULL OR `keywords_ar`='');
COMMIT;

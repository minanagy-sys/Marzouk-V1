-- Recovery Phase 3: wire blog hero images to /uploads. Run AFTER uploading
-- the recovery image files into UPLOAD_DIR (/home/u865517546/uploads).
-- Idempotent (matches by row id). Alt text = generated DRAFTS (review needed).
START TRANSACTION;
UPDATE `blog_posts` SET `image_url`='/uploads/rec-e9170f7b.jpg', `image_alt_ar`='هل التهاب الثدي خطير — د. أحمد مرزوق', `image_alt_en`='Causes of mastitis and methods of treatment — Dr. Ahmed Marzouk' WHERE `id`='96dd8880-1d95-52c2-b0c5-af844faab788';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-9681d39c.jpg', `image_alt_ar`='الحمل الكيميائي — د. أحمد مرزوق', `image_alt_en`='Find out all about chemical pregnancy — Dr. Ahmed Marzouk' WHERE `id`='3440ab6d-44b5-5b8c-8573-3de70f652db3';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-d6105f0d.jpg', `image_alt_ar`='انقطاع الطمث — د. أحمد مرزوق', `image_alt_en`='Menopause — Dr. Ahmed Marzouk' WHERE `id`='0e1eb956-fd14-56f0-9fca-d851b00d6ff8';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-d4ee6158.jpg', `image_alt_ar`='حمى النفاس — د. أحمد مرزوق', `image_alt_en`='Postpartum fever — Dr. Ahmed Marzouk' WHERE `id`='c82fe0e4-efab-589c-b855-a841c7313ae8';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-b445844f.jpg', `image_alt_ar`='ارتفاع ضغط الدم وتسمم الحمل — د. أحمد مرزوق', `image_alt_en`='Hypertension and Preeclampsia — Dr. Ahmed Marzouk' WHERE `id`='a7eef3d3-024e-5baf-8927-767d329a4573';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-5e92ce9b.jpg', `image_alt_ar`='أسباب القيء المستعصي للحامل — د. أحمد مرزوق', `image_alt_en`='Ways to control intractable vomiting during pregnancy — Dr. Ahmed Marzouk' WHERE `id`='4ac6c686-9367-504b-8281-8e79598b61b3';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-794be60b.jpg', `image_alt_ar`='الاحتفال بعشرة آلاف حالة من الولادة بدون ألم — د. أحمد مرزوق', `image_alt_en`='Celebrating ten thousand Moms who enjoyed painless childbirth — Dr. Ahmed Marzouk' WHERE `id`='fe9dba6c-4454-565e-883e-d57ad43de7bf';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-0fa289d7.jpg', `image_alt_ar`='الزمالة في أمراض النساء التجميلية، دبي، أغسطس 2021 — د. أحمد مرزوق', `image_alt_en`='Fellowship in Aesthetic Gynecology — Dr. Ahmed Marzouk' WHERE `id`='de6446d0-4f1d-5339-bbf6-eb24fd76689d';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-f14d14d0.jpg', `image_alt_ar`='دكتور احمد مرزوق — د. أحمد مرزوق', `image_alt_en`='Nasr City Clinic Opening — Dr. Ahmed Marzouk' WHERE `id`='023bae7b-9b4c-55db-b5d6-f3342d73860d';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-77f33887.jpg', `image_alt_ar`='dr ahmed marzouk — د. أحمد مرزوق', `image_alt_en`='Opening of the Fifth Settlement Branch — Dr. Ahmed Marzouk' WHERE `id`='7f128106-d649-501d-8947-239229e63ade';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-03ad74f8.jpg', `image_alt_ar`='نصائح قبل عملية الولادة القيصرية — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='d939db12-25b8-5e79-92f3-f5b6ddfef6b8';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-0c8090b4.jpg', `image_alt_ar`='علاج الورم الليفي في الرحم — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='b828ea52-c4aa-5277-be64-3c8f85e03054';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-55f03f88.jpg', `image_alt_ar`='أضرار تجميد البويضات — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='0726bf7a-c819-5e37-bf9c-448af6e5238c';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-8de3a3e2.jpg', `image_alt_ar`='أعراض حاجز الرحم — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='36707b39-19ae-5848-b868-b1873ad7e79b';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-c3e4491a.jpg', `image_alt_ar`='وجع ووخز بالجانب الأيمن بعد العملية القيصرية — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='7002bc53-f260-5fe4-8bf8-35a974682816';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-ff237c5d.jpg', `image_alt_ar`='كل ما تريدين معرفته عن الأورام الليفية — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='a8966dbd-d32a-51d7-bb8d-84e667a53752';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-5eba109e.jpg', `image_alt_ar`='تجربتي مع إبرة الظهر للولادة القيصرية — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='e178550c-d7c4-50cd-89c9-3655b4448a45';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-f5dbe431.jpg', `image_alt_ar`='تجربتي مع انسداد قناة فالوب — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='67475b9c-0978-53c7-9571-49473ecb9f05';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-a3be4e13.jpg', `image_alt_ar`='علاج التهابات المهبل — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='c8212000-f67e-5e44-a6f9-d1c4df08b9d0';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-160dcab1.jpg', `image_alt_ar`='توقف دم النفاس بعد أسبوع من الولادة القيصرية — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='1be32ae3-55b1-571a-8689-600f784c7dc9';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-4ace8bdc.jpg', `image_alt_ar`='قبل العملية القيصرية بيوم — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='53a11a69-3257-5f26-ae25-72a4d81716e4';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-43a188c2.jpg', `image_alt_ar`='هل يحدث تبويض مع تكيس المبايض — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='7fc1a2bb-332b-52d5-af31-5ee435c390c9';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-5ddd3067.jpg', `image_alt_ar`='تحليل السائل المنوى للرجل — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='4ee5a60f-d75b-53c8-935c-1765073df51a';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-60ddc9ec.jpg', `image_alt_ar`='تجربتي مع شد البطن بعد الولادة القيصرية — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='7ec779f5-0d2d-51c9-b18b-f68ea96c6922';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-7b52224b.jpg', `image_alt_ar`='الحمل بعد عملية الولادة القيصرية — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='f0837ae0-7862-5f21-b3ad-5f8f768b5ea5';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-29ae09af.jpg', `image_alt_ar`='الورم الليفي والحمل — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='e9a0c89d-b332-5e2c-bace-567e34f1570f';
-- SKIPPED (no hero on disk): الحقن-المجهري
UPDATE `blog_posts` SET `image_url`='/uploads/rec-bc6f1711.jpg', `image_alt_ar`='تجربتي مع التاب بلوك — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='941791c1-7956-51c9-ad73-a8ce1acf60d1';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-7337b865.jpg', `image_alt_ar`='علاج تحجر الثدي بعد الولادة القيصرية — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='855a89c4-9414-5b83-8b5b-4ae18ac7903e';
UPDATE `blog_posts` SET `image_url`='/uploads/rec-6dd4e6ba.jpg', `image_alt_ar`='تحديد نوع الجنين — د. أحمد مرزوق', `image_alt_en`=NULL WHERE `id`='7dd3709a-686a-5e53-b3f5-1efb6ffb1aed';
COMMIT;

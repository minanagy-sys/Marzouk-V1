-- recovery_champion_boost.sql
-- ---------------------------------------------------------------------------
-- Goal: push the #1 money page (علاج التهابات المهبل) back to the top-3 SERP.
-- After the migration it slipped ~2 positions on its biggest query
-- "علاج التهابات المهبل للمتزوجات" (pos 3.6 -> 5.3, impressions halved), which
-- alone accounts for the whole gap to the pre-migration peak.
--
-- This adds the missing ranking signals the page never had:
--   1) a recent modified date (freshness -> re-crawl / re-evaluation)
--   2) keywords (the row had none)
--   3) a dedicated "للمتزوجات" section targeting the exact losing query
--   4) an FAQ block (FAQPage schema + long-tail capture; the row had none)
--   5) keyword-anchored internal links from relevant articles
--
-- SAFE & IDEMPOTENT: append-only. Never overwrites existing body content.
-- Guards (NOT LIKE / IS NULL / JSON_LENGTH) make it safe to run twice.
--
-- HOW TO APPLY (same as the other recovery files):
--   1. Import this file into the LIVE (hostinger) database via phpMyAdmin.
--   2. Redeploy the app (or wait ~1h for ISR revalidate) so the page rebuilds.
-- ---------------------------------------------------------------------------

-- 1) Freshness signal (the row currently has no published_date at all).
UPDATE `blog_posts`
  SET `published_date` = '2026-09-25'
  WHERE `slug` = 'علاج-التهابات-المهبل'
    AND (`published_date` IS NULL OR `published_date` = '');

-- 2) Keywords (the row had none) — cover the losing query + real variants.
UPDATE `blog_posts`
  SET `keywords_ar` = 'علاج التهابات المهبل, علاج التهابات المهبل للمتزوجات, علاج الالتهابات المهبلية, التهابات المهبل, علاج التهاب المهبل, أفضل علاج لالتهابات المهبل, علاج حرقان المهبل من الداخل, علاج الفطريات المهبلية',
      `keywords_en` = 'vaginal infection treatment, vaginal infection treatment for married women, vaginal infections treatment, bacterial vaginosis treatment, vaginal yeast infection treatment, vaginal itching and burning treatment'
  WHERE `slug` = 'علاج-التهابات-المهبل'
    AND (`keywords_ar` IS NULL OR `keywords_ar` = '');

-- 3) Targeted section for "علاج التهابات المهبل للمتزوجات".
--    Appended to the end of body_ar, guarded so it is added only once.
UPDATE `blog_posts`
  SET `body_ar` = CONCAT(`body_ar`,
    '<h2 id="married-women">علاج التهابات المهبل للمتزوجات</h2>',
    '<p>تُعد التهابات المهبل من أكثر المشكلات شيوعًا بين السيدات المتزوجات، إذ تلعب العلاقة الزوجية والتغيرات الهرمونية دورًا في زيادة فرص الإصابة بها. ولأن العلاج قد يحتاج إلى بعض الاعتبارات الإضافية في هذه الحالة، نوضح فيما يلي أهم ما تحتاج المتزوجة معرفته.</p>',
    '<h3>لماذا تكثر التهابات المهبل عند المتزوجات؟</h3>',
    '<ul>',
    '<li>اختلال التوازن الطبيعي للبكتيريا النافعة بعد العلاقة الزوجية أو نتيجة الإفراط في استخدام الغسول المهبلي.</li>',
    '<li>انتقال بعض أنواع العدوى مثل داء المشعرات من الطرف الآخر.</li>',
    '<li>التغيرات الهرمونية المرتبطة بالحمل أو وسائل منع الحمل مثل اللولب والحبوب.</li>',
    '<li>ارتفاع الرطوبة والحرارة نتيجة الملابس الضيقة أو غير القطنية.</li>',
    '</ul>',
    '<h3>كيف يتم علاج التهابات المهبل للمتزوجات؟</h3>',
    '<p>يعتمد العلاج على نوع الالتهاب تمامًا كما أوضحنا سابقًا (بكتيري أو فطري أو داء المشعرات)، مع مراعاة نقطتين مهمتين للسيدة المتزوجة:</p>',
    '<ul>',
    '<li><strong>علاج الطرفين معًا:</strong> في حالات العدوى المنقولة جنسيًا مثل داء المشعرات يجب علاج الزوج في الوقت نفسه لتجنب عودة العدوى مرة أخرى.</li>',
    '<li><strong>تجنب العلاقة الحميمة مؤقتًا:</strong> يُفضل الامتناع عن العلاقة أثناء فترة العلاج النشط حتى تختفي الأعراض تمامًا، لتقليل فرص انتقال العدوى أو زيادة التهيج.</li>',
    '</ul>',
    '<h3>نصائح للوقاية من تكرار الالتهابات بعد الزواج</h3>',
    '<ul>',
    '<li>الاهتمام بالنظافة الشخصية قبل العلاقة الزوجية وبعدها مباشرة.</li>',
    '<li>استخدام الماء أو الغسول الطبي المناسب فقط، وتجنب الدش المهبلي.</li>',
    '<li>ارتداء الملابس القطنية وتغيير الملابس الداخلية يوميًا.</li>',
    '<li>مراجعة الطبيب عند تكرار الالتهابات أكثر من أربع مرات في العام لاستبعاد أي سبب مزمن.</li>',
    '</ul>',
    '<p>ننصح دائمًا باستشارة الدكتور أحمد مرزوق قبل استخدام أي علاج، لتحديد نوع الالتهاب بدقة ووصف العلاج المناسب لحالتك دون التسبب في أي مضاعفات.</p>')
  WHERE `slug` = 'علاج-التهابات-المهبل'
    AND `body_ar` NOT LIKE '%id="married-women"%';

-- 4) FAQ (the row had none) — high-intent questions matching real GSC queries.
UPDATE `blog_posts`
  SET `faq` = '[{"q_ar":"ما هو أفضل علاج لالتهابات المهبل للمتزوجات؟","q_en":"What is the best treatment for vaginal infections in married women?","a_ar":"يعتمد أفضل علاج على نوع الالتهاب: مضاد حيوي للالتهاب البكتيري، ومضاد للفطريات للعدوى الفطرية، وميترونيدازول لداء المشعرات مع علاج الزوج. يجب تحديد النوع عبر الفحص قبل بدء العلاج.","a_en":"The best treatment depends on the type of infection: antibiotics for bacterial vaginosis, antifungals for yeast infections, and metronidazole for trichomoniasis with the partner treated too. The type should be confirmed by examination first."},{"q_ar":"كيف أعالج حرقان المهبل من الداخل؟","q_en":"How do I treat internal vaginal burning?","a_ar":"حرقان المهبل غالبًا عرض لالتهاب بكتيري أو فطري. العلاج يكون بالكريمات واللبوس المهبلي المناسب لنوع الالتهاب، مع تجنب الغسول المعطر والدش المهبلي حتى تختفي الأعراض.","a_en":"Vaginal burning is usually a symptom of a bacterial or fungal infection. Treatment uses the appropriate vaginal cream or suppository for the infection type, while avoiding scented washes and douching until symptoms clear."},{"q_ar":"هل التهابات المهبل تمنع الحمل؟","q_en":"Can vaginal infections prevent pregnancy?","a_ar":"الالتهابات المزمنة غير المعالجة قد تغيّر حموضة المهبل وتؤثر على الحيوانات المنوية وفرص الإخصاب، كما قد تسبب مضاعفات أثناء الحمل. لذا يُنصح بعلاجها قبل محاولة الحمل.","a_en":"Chronic untreated infections can change vaginal acidity and affect sperm and fertilization, and may cause complications during pregnancy, so it is best to treat them before trying to conceive."},{"q_ar":"متى يجب زيارة الطبيب بسبب التهابات المهبل؟","q_en":"When should I see a doctor for a vaginal infection?","a_ar":"راجعي الطبيب عند وجود إفرازات كريهة الرائحة أو ملونة، أو حكة وحرقان شديد، أو ألم أثناء العلاقة، أو تكرار الالتهاب أكثر من أربع مرات سنويًا، أو إذا كنتِ حاملًا.","a_en":"See a doctor if you have foul-smelling or coloured discharge, severe itching or burning, pain during intercourse, more than four infections a year, or if you are pregnant."}]'
  WHERE `slug` = 'علاج-التهابات-المهبل'
    AND (`faq` IS NULL OR `faq` = '' OR JSON_LENGTH(`faq`) = 0);

-- 5) Keyword-anchored internal links to the champion from relevant articles.
--    Match on both slug and slug_ar so it works whichever column holds the AR slug.
UPDATE `blog_posts`
  SET `body_ar` = CONCAT(`body_ar`,
    '<p>اقرأ أيضًا: <a href="/ar/blogs/علاج-التهابات-المهبل">علاج التهابات المهبل</a> وطرق الوقاية منها.</p>')
  WHERE (`slug` IN ('chemical-pregnancy','control-intractable-vomiting-during-pregnancy')
      OR `slug_ar` IN ('تعرف-على-كل-ما-يخص-الحمل-الكيميائي','طرق-التحكم-في-القيء-المستعصي-أثناء-الحمل','نصائح-بعد-عملية-الولادة-القيصرية'))
    AND `body_ar` NOT LIKE '%/ar/blogs/علاج-التهابات-المهبل%';

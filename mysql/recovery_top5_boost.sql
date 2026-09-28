-- recovery_top5_boost.sql
-- ---------------------------------------------------------------------------
-- Optimize the top 5 "striking-distance" pages (pos 6-8, high impressions,
-- low CTR) up toward the top-3 SERP, by adding the intent-matched sections,
-- FAQ, keywords and freshness dates they are currently missing.
--
-- Targets (from GSC query analysis):
--   1) نصائح بعد عملية الولادة القيصرية  — 9.3k imp, pos 7.4 (biggest upside)
--   2) طرق التحكم في القيء المستعصي أثناء الحمل — 6.7k imp, pos 8.2
--   3) الولادة بدون ألم / تاب لوك — 6.4k imp, pos 6.8 (+ price intent)
--   4) تعرف على كل ما يخص الحمل الكيميائي — 4.8k imp, pos 7.2
--   5) دليلك الشامل قبل الولادة القيصرية بيوم — 3.6k imp, pos 5.8
--
-- SAFE & IDEMPOTENT: append-only. Each body section is guarded by a unique
-- id="..." NOT LIKE check; keywords/faq/date are guarded by IS NULL / empty
-- checks. Safe to run more than once. No existing content is overwritten.
--
-- HOW TO APPLY: import into the LIVE (hostinger) DB via phpMyAdmin, then
-- redeploy (or wait ~1h for ISR) so the pages rebuild.
-- ---------------------------------------------------------------------------


-- =========================================================================
-- PAGE 1: نصائح بعد عملية الولادة القيصرية
-- Intents: الاستحمام (pos 4.7), النفاس (7.6), النوم (6.2), الأعراض (8.4)
-- =========================================================================
UPDATE `blog_posts` SET `published_date`='2026-09-26'
  WHERE (`slug`='نصائح-بعد-عملية-الولادة-القيصرية' OR `slug_ar`='نصائح-بعد-عملية-الولادة-القيصرية')
    AND (`published_date` IS NULL OR `published_date`='');

UPDATE `blog_posts` SET
  `keywords_ar`='نصائح بعد الولادة القيصرية, متى الاستحمام بعد الولادة القيصرية, النفاس بعد الولادة القيصرية, النوم بعد الولادة القيصرية, اعراض ما بعد الولادة القيصرية, العناية بجرح القيصرية',
  `keywords_en`='tips after cesarean, bathing after c-section, postpartum period after cesarean, sleeping position after c-section, symptoms after cesarean'
  WHERE (`slug`='نصائح-بعد-عملية-الولادة-القيصرية' OR `slug_ar`='نصائح-بعد-عملية-الولادة-القيصرية')
    AND (`keywords_ar` IS NULL OR `keywords_ar`='');

UPDATE `blog_posts` SET `body_ar`=CONCAT(`body_ar`,
  '<h2 id="bathing-after-cs">متى يمكن الاستحمام بعد الولادة القيصرية؟</h2>',
  '<p>يُسمح عادةً بالاستحمام بالدش (الوقوف تحت الماء) بعد مرور 24 إلى 48 ساعة من الولادة القيصرية، بشرط تغطية الجرح وتجفيفه جيدًا بعد الانتهاء. أما نقع الجرح في البانيو فيُفضل تأجيله حتى التئامه تمامًا (بعد أسبوعين إلى ثلاثة أسابيع) لتقليل خطر العدوى. استخدمي ماءً فاترًا وصابونًا لطيفًا، وتجنبي فرك منطقة الجرح مباشرةً.</p>',
  '<h2 id="nifas-after-cs">النفاس بعد الولادة القيصرية</h2>',
  '<p>تستمر فترة النفاس بعد القيصرية عادةً من أربعة إلى ستة أسابيع، وتتضمن نزول إفرازات (الهلابة) تبدأ حمراء غامقة ثم تتحول تدريجيًا إلى البني فالأصفر الفاتح. راجعي الطبيب فورًا إذا عادت الإفرازات حمراء غزيرة بعد أن خفّت، أو صاحبتها رائحة كريهة أو حمى، فقد تشير إلى التهاب.</p>',
  '<h2 id="sleep-after-cs">أفضل وضعية للنوم بعد الولادة القيصرية</h2>',
  '<p>أفضل وضعية للنوم بعد القيصرية هي الاستلقاء على الظهر أو على الجانب مع وضع وسادة أسفل البطن لدعم الجرح وتقليل الشد عليه. تجنبي النوم على البطن في الأسابيع الأولى، واستعيني بيديكِ لدعم البطن عند تغيير وضعيتك أو النهوض من السرير.</p>',
  '<h2 id="symptoms-after-cs">الأعراض الطبيعية والتحذيرية بعد القيصرية</h2>',
  '<p>من الطبيعي الشعور بألم خفيف حول الجرح وتقلصات وإمساك مؤقت في الأيام الأولى. لكن راجعي الطبيب فورًا عند ظهور أي من هذه الأعراض:</p>',
  '<ul>',
  '<li>ارتفاع درجة الحرارة عن 38 درجة مئوية.</li>',
  '<li>احمرار الجرح أو خروج إفرازات أو صديد منه.</li>',
  '<li>ألم شديد أو متزايد لا يخف مع المسكنات.</li>',
  '<li>تورم أو ألم في الساق (قد يشير إلى جلطة).</li>',
  '<li>نزيف مهبلي غزير أو إفرازات كريهة الرائحة.</li>',
  '</ul>')
  WHERE (`slug`='نصائح-بعد-عملية-الولادة-القيصرية' OR `slug_ar`='نصائح-بعد-عملية-الولادة-القيصرية')
    AND `body_ar` NOT LIKE '%id="bathing-after-cs"%';

UPDATE `blog_posts` SET `faq`='[{"q_ar":"متى يمكنني الاستحمام بعد الولادة القيصرية؟","q_en":"When can I bathe after a cesarean?","a_ar":"يمكن الاستحمام بالدش بعد 24 إلى 48 ساعة مع تغطية الجرح وتجفيفه، وتأجيل نقع الجرح في البانيو حتى التئامه تمامًا.","a_en":"You can shower after 24 to 48 hours while covering and drying the wound, and delay soaking the wound in a bath until it fully heals."},{"q_ar":"كم تستمر فترة النفاس بعد القيصرية؟","q_en":"How long does the postpartum period last after a cesarean?","a_ar":"تستمر فترة النفاس عادةً من أربعة إلى ستة أسابيع مع تغيّر لون الإفرازات تدريجيًا.","a_en":"The postpartum period usually lasts four to six weeks with the discharge changing colour gradually."},{"q_ar":"ما أفضل وضعية للنوم بعد الولادة القيصرية؟","q_en":"What is the best sleeping position after a cesarean?","a_ar":"النوم على الظهر أو على الجانب مع وسادة أسفل البطن لدعم الجرح.","a_en":"Sleeping on the back or side with a pillow under the abdomen to support the wound."},{"q_ar":"متى يجب مراجعة الطبيب بعد القيصرية؟","q_en":"When should I see a doctor after a cesarean?","a_ar":"عند الحمى أو احمرار الجرح أو خروج صديد أو ألم الساق أو النزيف الغزير أو الإفرازات كريهة الرائحة.","a_en":"With fever, wound redness or pus, leg pain, heavy bleeding, or foul-smelling discharge."}]'
  WHERE (`slug`='نصائح-بعد-عملية-الولادة-القيصرية' OR `slug_ar`='نصائح-بعد-عملية-الولادة-القيصرية')
    AND (`faq` IS NULL OR `faq`='' OR JSON_LENGTH(`faq`)=0);


-- =========================================================================
-- PAGE 2: طرق التحكم في القيء المستعصي أثناء الحمل
-- Ranks #1-2 for "المستعصي" but ~8 for broad "غثيان/قيء الحمل" terms.
-- =========================================================================
UPDATE `blog_posts` SET `published_date`='2026-09-26'
  WHERE (`slug`='control-intractable-vomiting-during-pregnancy' OR `slug_ar`='طرق-التحكم-في-القيء-المستعصي-أثناء-الحمل')
    AND (`published_date` IS NULL OR `published_date`='');

UPDATE `blog_posts` SET
  `keywords_ar`='القيء المستعصي أثناء الحمل, غثيان الحمل, علاج القيء المستعصي, فرط غثيان الحمل, متى يكون قيء الحمل خطيرًا, علاج غثيان الحامل',
  `keywords_en`='hyperemesis gravidarum, morning sickness treatment, severe vomiting in pregnancy, nausea in pregnancy'
  WHERE (`slug`='control-intractable-vomiting-during-pregnancy' OR `slug_ar`='طرق-التحكم-في-القيء-المستعصي-أثناء-الحمل')
    AND (`keywords_ar` IS NULL OR `keywords_ar`='');

UPDATE `blog_posts` SET `body_ar`=CONCAT(`body_ar`,
  '<h2 id="morning-sickness-vs">الفرق بين غثيان الحمل الطبيعي والقيء المستعصي</h2>',
  '<p>يُعد غثيان الحمل من الأعراض الشائعة في الأشهر الأولى ويصيب معظم الحوامل، وعادةً يكون خفيفًا ويتحسن مع الراحة وتقسيم الوجبات. أما القيء المستعصي (فرط غثيان الحمل) فهو حالة أشد تتميز بقيء متكرر وشديد يمنع الحامل من تناول الطعام أو الشراب، وقد يؤدي إلى الجفاف ونقص الوزن ويحتاج إلى تدخل طبي. فإذا تجاوز القيء ثلاث إلى أربع مرات يوميًا مع عدم القدرة على الاحتفاظ بالسوائل، فالأمر يتجاوز الغثيان الطبيعي.</p>',
  '<h2 id="when-dangerous">متى يصبح قيء الحمل خطيرًا؟</h2>',
  '<p>راجعي الطبيب فورًا عند ظهور أي من هذه العلامات:</p>',
  '<ul>',
  '<li>عدم القدرة على شرب الماء أو الاحتفاظ به لأكثر من 12 ساعة.</li>',
  '<li>علامات الجفاف مثل قلة التبول أو لون البول الداكن أو الدوخة.</li>',
  '<li>فقدان ملحوظ في الوزن خلال فترة قصيرة.</li>',
  '<li>وجود دم في القيء أو ارتفاع في درجة الحرارة.</li>',
  '</ul>',
  '<p>قد تستدعي هذه الحالات إعطاء المحاليل الوريدية وأدوية مضادة للقيء تحت إشراف الطبيب لحماية الأم والجنين.</p>')
  WHERE (`slug`='control-intractable-vomiting-during-pregnancy' OR `slug_ar`='طرق-التحكم-في-القيء-المستعصي-أثناء-الحمل')
    AND `body_ar` NOT LIKE '%id="morning-sickness-vs"%';

UPDATE `blog_posts` SET `faq`='[{"q_ar":"ما الفرق بين غثيان الحمل والقيء المستعصي؟","q_en":"What is the difference between morning sickness and hyperemesis?","a_ar":"غثيان الحمل خفيف ويتحسن مع الراحة، أما القيء المستعصي فشديد ومتكرر يمنع الأكل والشرب وقد يسبب الجفاف ويحتاج تدخلًا طبيًا.","a_en":"Morning sickness is mild and improves with rest, while hyperemesis is severe and frequent, prevents eating and drinking, can cause dehydration, and needs medical care."},{"q_ar":"متى يكون القيء أثناء الحمل خطيرًا؟","q_en":"When is vomiting during pregnancy dangerous?","a_ar":"عند عدم القدرة على شرب الماء لأكثر من 12 ساعة، أو ظهور علامات الجفاف، أو فقدان الوزن، أو وجود دم في القيء.","a_en":"When you cannot keep water down for over 12 hours, or with signs of dehydration, weight loss, or blood in the vomit."},{"q_ar":"هل القيء المستعصي يؤثر على الجنين؟","q_en":"Does hyperemesis affect the baby?","a_ar":"عند علاجه مبكرًا لا يؤثر غالبًا، والخطر يأتي من الجفاف ونقص التغذية عند إهماله.","a_en":"When treated early it usually does not affect the baby; the risk comes from dehydration and poor nutrition if neglected."},{"q_ar":"كيف أتحكم في غثيان الحمل في المنزل؟","q_en":"How do I control morning sickness at home?","a_ar":"وجبات صغيرة متكررة، تناول الزنجبيل، تجنب الروائح المحفزة، وشرب السوائل تدريجيًا على مدار اليوم.","a_en":"Small frequent meals, ginger, avoiding trigger smells, and sipping fluids gradually through the day."}]'
  WHERE (`slug`='control-intractable-vomiting-during-pregnancy' OR `slug_ar`='طرق-التحكم-في-القيء-المستعصي-أثناء-الحمل')
    AND (`faq` IS NULL OR `faq`='' OR JSON_LENGTH(`faq`)=0);


-- =========================================================================
-- PAGE 3: الولادة بدون ألم / تاب لوك
-- Head "ولادة بدون ألم" at pos 14; price intent "سعر حقنة التاب بلوك" open.
-- =========================================================================
UPDATE `blog_posts` SET `published_date`='2026-09-26'
  WHERE (`slug`='الولادة-بدون-ألم-تاب-لوك' OR `slug_ar`='الولادة-بدون-ألم-تاب-لوك')
    AND (`published_date` IS NULL OR `published_date`='');

UPDATE `blog_posts` SET
  `keywords_ar`='الولادة بدون ألم, تاب بلوك, حقنة التاب بلوك, الولادة القيصرية بدون ألم, ابرة الظهر للولادة, تكلفة الولادة بدون ألم, الفرق بين التاب بلوك و pca',
  `keywords_en`='painless delivery, TAP block, TAP block injection, epidural for cesarean, painless cesarean'
  WHERE (`slug`='الولادة-بدون-ألم-تاب-لوك' OR `slug_ar`='الولادة-بدون-ألم-تاب-لوك')
    AND (`keywords_ar` IS NULL OR `keywords_ar`='');

UPDATE `blog_posts` SET `body_ar`=CONCAT(`body_ar`,
  '<h2 id="what-is-painless-birth">ما هي الولادة بدون ألم وما طرقها؟</h2>',
  '<p>الولادة بدون ألم تعني استخدام تقنيات تخدير حديثة تتيح للأم خوض تجربة الولادة (الطبيعية أو القيصرية) مع تخفيف الألم إلى أدنى درجة. ومن أشهر طرقها: إبرة الظهر (Epidural) التي تُستخدم في الولادة الطبيعية والقيصرية، وتقنية التاب بلوك (TAP Block) التي تُستخدم بعد القيصرية للتحكم في ألم ما بعد العملية. ويحدد الطبيب الطريقة الأنسب حسب حالة كل سيدة لتحقيق تعافٍ أسرع وحركة مبكرة.</p>',
  '<h2 id="tab-vs-pca">الفرق بين التاب بلوك وجهاز PCA لتسكين الألم</h2>',
  '<p>التاب بلوك (TAP Block) حقنة تُعطى في جدار البطن لتخدير الأعصاب المسؤولة عن ألم الجرح بعد القيصرية، ويستمر مفعولها لساعات طويلة تساعد الأم على الحركة والتعافي المبكر. أما جهاز PCA فهو جهاز يتحكم فيه المريض لضخ جرعات مسكن محسوبة عند الحاجة. وكثيرًا ما يجمع الطبيب بين التقنيتين للحصول على أفضل تحكم في الألم بعد العملية.</p>',
  '<h2 id="tab-block-cost">تكلفة الولادة بدون ألم وحقنة التاب بلوك</h2>',
  '<p>تختلف تكلفة الولادة بدون ألم وحقنة التاب بلوك حسب نوع الولادة وحالة السيدة والخدمات المصاحبة. وللحصول على تفاصيل دقيقة عن التكلفة وحجز موعد، يمكنك التواصل مباشرةً مع عيادة الدكتور أحمد مرزوق عبر الواتساب أو الهاتف.</p>')
  WHERE (`slug`='الولادة-بدون-ألم-تاب-لوك' OR `slug_ar`='الولادة-بدون-ألم-تاب-لوك')
    AND `body_ar` NOT LIKE '%id="what-is-painless-birth"%';

UPDATE `blog_posts` SET `faq`='[{"q_ar":"ما هي الولادة بدون ألم؟","q_en":"What is painless delivery?","a_ar":"هي استخدام تقنيات تخدير حديثة مثل إبرة الظهر والتاب بلوك لتخفيف ألم الولادة الطبيعية أو القيصرية إلى أدنى درجة.","a_en":"It is the use of modern anaesthesia techniques such as the epidural and TAP block to minimise the pain of natural or cesarean birth."},{"q_ar":"ما الفرق بين إبرة الظهر والتاب بلوك؟","q_en":"What is the difference between the epidural and the TAP block?","a_ar":"إبرة الظهر تُستخدم أثناء الولادة لتسكين الألم، بينما التاب بلوك يُستخدم بعد القيصرية للتحكم في ألم ما بعد العملية.","a_en":"The epidural is used during labour for pain relief, while the TAP block is used after a cesarean to control post-operative pain."},{"q_ar":"هل الولادة بدون ألم آمنة على الأم والجنين؟","q_en":"Is painless delivery safe for mother and baby?","a_ar":"نعم، عند إجرائها على يد طبيب متخصص وفريق تخدير مؤهل تكون آمنة على الأم والجنين.","a_en":"Yes, when performed by a specialist doctor and a qualified anaesthesia team it is safe for both mother and baby."},{"q_ar":"كم تستمر فاعلية حقنة التاب بلوك؟","q_en":"How long does the TAP block last?","a_ar":"يمتد مفعولها لساعات طويلة تغطي أصعب فترات ألم ما بعد العملية وتساعد على الحركة المبكرة.","a_en":"Its effect lasts for many hours, covering the hardest post-operative pain period and helping early movement."}]'
  WHERE (`slug`='الولادة-بدون-ألم-تاب-لوك' OR `slug_ar`='الولادة-بدون-ألم-تاب-لوك')
    AND (`faq` IS NULL OR `faq`='' OR JSON_LENGTH(`faq`)=0);


-- =========================================================================
-- PAGE 4: تعرف على كل ما يخص الحمل الكيميائي
-- Content-rich already; needs explicit "ما هو" definition + FAQ + freshness.
-- =========================================================================
UPDATE `blog_posts` SET `published_date`='2026-09-26'
  WHERE (`slug`='chemical-pregnancy' OR `slug_ar`='تعرف-على-كل-ما-يخص-الحمل-الكيميائي')
    AND (`published_date` IS NULL OR `published_date`='');

UPDATE `blog_posts` SET
  `keywords_ar`='الحمل الكيميائي, ما هو الحمل الكيميائي, اسباب الحمل الكيميائي, اعراض الحمل الكيميائي, متى تنزل الدورة بعد الحمل الكيميائي, معنى الحمل الكيميائي',
  `keywords_en`='chemical pregnancy, what is chemical pregnancy, chemical pregnancy causes, chemical pregnancy symptoms'
  WHERE (`slug`='chemical-pregnancy' OR `slug_ar`='تعرف-على-كل-ما-يخص-الحمل-الكيميائي')
    AND (`keywords_ar` IS NULL OR `keywords_ar`='');

UPDATE `blog_posts` SET `body_ar`=CONCAT(
  '<h2 id="what-is-chemical-pregnancy">ما هو الحمل الكيميائي؟ (تعريف مبسط)</h2>',
  '<p>الحمل الكيميائي هو إجهاض مبكر جدًا يحدث بعد انغراس البويضة المخصبة بفترة قصيرة، وغالبًا قبل أن يتمكن الطبيب من رؤية كيس الحمل في السونار. تظهر نتيجة اختبار الحمل إيجابية في البداية بسبب ارتفاع هرمون الحمل (HCG)، ثم تتحول إلى سلبية وتنزل الدورة في موعدها تقريبًا أو بتأخير بسيط، لذلك قد لا تدرك بعض السيدات حدوثه من الأساس.</p>',
  `body_ar`)
  WHERE (`slug`='chemical-pregnancy' OR `slug_ar`='تعرف-على-كل-ما-يخص-الحمل-الكيميائي')
    AND `body_ar` NOT LIKE '%id="what-is-chemical-pregnancy"%';

UPDATE `blog_posts` SET `faq`='[{"q_ar":"ما معنى الحمل الكيميائي؟","q_en":"What does chemical pregnancy mean?","a_ar":"هو إجهاض مبكر جدًا يحدث بعد انغراس البويضة بفترة قصيرة وقبل ظهور كيس الحمل في السونار، مع تحول اختبار الحمل من إيجابي إلى سلبي.","a_en":"It is a very early miscarriage that happens shortly after implantation and before the gestational sac appears on ultrasound, with the pregnancy test turning from positive to negative."},{"q_ar":"ما أسباب الحمل الكيميائي؟","q_en":"What causes a chemical pregnancy?","a_ar":"غالبًا خلل كروموسومي في البويضة المخصبة، وأحيانًا اضطرابات هرمونية أو مشاكل في بطانة الرحم.","a_en":"Usually a chromosomal problem in the fertilised egg, and sometimes hormonal issues or problems in the uterine lining."},{"q_ar":"متى تنزل الدورة بعد الحمل الكيميائي؟","q_en":"When does the period return after a chemical pregnancy?","a_ar":"عادةً في موعدها المتوقع أو بتأخير أيام قليلة فقط.","a_en":"Usually at the expected time or with only a few days delay."},{"q_ar":"هل الحمل الكيميائي يؤثر على فرص الحمل مستقبلًا؟","q_en":"Does a chemical pregnancy affect future fertility?","a_ar":"لا، معظم السيدات يحملن بشكل طبيعي بعده، وهو لا يدل على مشكلة دائمة في الخصوبة.","a_en":"No, most women conceive normally afterwards, and it does not indicate a permanent fertility problem."}]'
  WHERE (`slug`='chemical-pregnancy' OR `slug_ar`='تعرف-على-كل-ما-يخص-الحمل-الكيميائي')
    AND (`faq` IS NULL OR `faq`='' OR JSON_LENGTH(`faq`)=0);


-- =========================================================================
-- PAGE 5: دليلك الشامل قبل عملية الولادة القيصرية بيوم
-- Intents: الصيام/عدد الساعات (pos 3.9), نصائح/تعليمات قبل القيصرية (3.8)
-- =========================================================================
UPDATE `blog_posts` SET `published_date`='2026-09-26'
  WHERE (`slug`='دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم' OR `slug_ar`='دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم')
    AND (`published_date` IS NULL OR `published_date`='');

UPDATE `blog_posts` SET
  `keywords_ar`='التجهيزات قبل الولادة القيصرية, نصائح قبل الولادة القيصرية, تعليمات قبل الولادة القيصرية, الصيام قبل القيصرية, كم ساعة صيام قبل القيصرية',
  `keywords_en`='before cesarean tips, fasting before c-section, cesarean preparation, instructions before cesarean'
  WHERE (`slug`='دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم' OR `slug_ar`='دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم')
    AND (`keywords_ar` IS NULL OR `keywords_ar`='');

UPDATE `blog_posts` SET `body_ar`=CONCAT(`body_ar`,
  '<h2 id="fasting-hours">كم عدد ساعات الصيام قبل الولادة القيصرية؟</h2>',
  '<p>يُنصح عادةً بالصيام التام عن الطعام لمدة ثماني ساعات على الأقل قبل الولادة القيصرية، مع إمكانية تناول رشفات من الماء الصافي حتى ساعتين قبل العملية حسب تعليمات طبيب التخدير. والهدف من الصيام هو تفريغ المعدة لتقليل مخاطر التخدير. التزمي دائمًا بالمدة التي يحددها لكِ طبيبك تحديدًا.</p>',
  '<h2 id="tips-before-cs">أهم النصائح والتعليمات قبل الولادة القيصرية</h2>',
  '<ul>',
  '<li>إجراء التحاليل والفحوصات التي يطلبها الطبيب قبل الموعد.</li>',
  '<li>الصيام حسب التعليمات (عادةً 8 ساعات عن الطعام).</li>',
  '<li>الاستحمام قبل الذهاب للمستشفى وتجنب وضع المكياج وطلاء الأظافر.</li>',
  '<li>إخبار الطبيب بأي أدوية تتناولينها أو أي حساسية لديكِ.</li>',
  '<li>تجهيز حقيبة المستشفى لكِ وللمولود مسبقًا.</li>',
  '<li>ترتيب من يرافقك ويساعدك بعد العملية.</li>',
  '</ul>')
  WHERE (`slug`='دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم' OR `slug_ar`='دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم')
    AND `body_ar` NOT LIKE '%id="fasting-hours"%';

UPDATE `blog_posts` SET `faq`='[{"q_ar":"كم ساعة صيام قبل الولادة القيصرية؟","q_en":"How many hours of fasting before a cesarean?","a_ar":"8 ساعات عن الطعام على الأقل، مع رشفات ماء صافٍ حتى ساعتين قبل العملية حسب تعليمات طبيب التخدير.","a_en":"At least 8 hours from food, with sips of clear water allowed up to two hours before, per the anaesthetist instructions."},{"q_ar":"ماذا أحضر معي قبل الولادة القيصرية؟","q_en":"What should I bring before a cesarean?","a_ar":"التحاليل والفحوصات المطلوبة، وحقيبة المستشفى لكِ وللمولود، وأوراقك الطبية.","a_en":"The required tests, a hospital bag for you and the baby, and your medical papers."},{"q_ar":"هل أضع مكياج قبل القيصرية؟","q_en":"Can I wear makeup before a cesarean?","a_ar":"لا يُفضل، لأن مراقبة لون البشرة والأظافر أثناء العملية مهمة لطبيب التخدير.","a_en":"It is better not to, because monitoring skin and nail colour during surgery is important for the anaesthetist."},{"q_ar":"هل يمكن شرب الماء قبل القيصرية؟","q_en":"Can I drink water before a cesarean?","a_ar":"رشفات من الماء الصافي فقط حتى ساعتين قبل العملية، حسب تعليمات طبيب التخدير.","a_en":"Only sips of clear water up to two hours before, per the anaesthetist instructions."}]'
  WHERE (`slug`='دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم' OR `slug_ar`='دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم')
    AND (`faq` IS NULL OR `faq`='' OR JSON_LENGTH(`faq`)=0);


-- =========================================================================
-- Internal links — cross-link the cesarean cluster (guarded, append-only).
-- =========================================================================
-- On "نصائح بعد القيصرية" -> before-guide + painless birth.
UPDATE `blog_posts` SET `body_ar`=CONCAT(`body_ar`,
  '<p>اقرأ أيضًا: <a href="/ar/blogs/دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم">دليلك الشامل قبل عملية الولادة القيصرية</a> و<a href="/ar/blogs/الولادة-بدون-ألم-تاب-لوك">الولادة بدون ألم (تاب بلوك)</a>.</p>')
  WHERE (`slug`='نصائح-بعد-عملية-الولادة-القيصرية' OR `slug_ar`='نصائح-بعد-عملية-الولادة-القيصرية')
    AND `body_ar` NOT LIKE '%/ar/blogs/دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم%';

-- On "دليلك قبل القيصرية" -> after-tips + painless birth.
UPDATE `blog_posts` SET `body_ar`=CONCAT(`body_ar`,
  '<p>اقرأ أيضًا: <a href="/ar/blogs/نصائح-بعد-عملية-الولادة-القيصرية">نصائح بعد عملية الولادة القيصرية</a> و<a href="/ar/blogs/الولادة-بدون-ألم-تاب-لوك">الولادة بدون ألم (تاب بلوك)</a>.</p>')
  WHERE (`slug`='دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم' OR `slug_ar`='دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم')
    AND `body_ar` NOT LIKE '%/ar/blogs/نصائح-بعد-عملية-الولادة-القيصرية%';

-- On "الولادة بدون ألم" -> before-guide + after-tips.
UPDATE `blog_posts` SET `body_ar`=CONCAT(`body_ar`,
  '<p>اقرأ أيضًا: <a href="/ar/blogs/دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم">دليلك الشامل قبل عملية الولادة القيصرية</a> و<a href="/ar/blogs/نصائح-بعد-عملية-الولادة-القيصرية">نصائح بعد عملية الولادة القيصرية</a>.</p>')
  WHERE (`slug`='الولادة-بدون-ألم-تاب-لوك' OR `slug_ar`='الولادة-بدون-ألم-تاب-لوك')
    AND `body_ar` NOT LIKE '%/ar/blogs/دليلك-الشامل-قبل-عملية-الولادة-القيصرية-بيوم%';

-- Recovery: assign the new blogs to their category filter. Idempotent by id.
-- Only sets category when currently NULL (won't override manual choices).
START TRANSACTION;
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='96dd8880-1d95-52c2-b0c5-af844faab788' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='e2aa7a58-7428-4a68-9fb6-33f0c639d0c7' WHERE `id`='3440ab6d-44b5-5b8c-8573-3de70f652db3' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='0e1eb956-fd14-56f0-9fca-d851b00d6ff8' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='c82fe0e4-efab-589c-b855-a841c7313ae8' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='e2aa7a58-7428-4a68-9fb6-33f0c639d0c7' WHERE `id`='a7eef3d3-024e-5baf-8927-767d329a4573' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='e2aa7a58-7428-4a68-9fb6-33f0c639d0c7' WHERE `id`='4ac6c686-9367-504b-8281-8e79598b61b3' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='2d4dfa9c-e618-4133-953a-0e5d059cc7a1' WHERE `id`='fe9dba6c-4454-565e-883e-d57ad43de7bf' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='de6446d0-4f1d-5339-bbf6-eb24fd76689d' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='023bae7b-9b4c-55db-b5d6-f3342d73860d' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='7f128106-d649-501d-8947-239229e63ade' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='2d4dfa9c-e618-4133-953a-0e5d059cc7a1' WHERE `id`='d939db12-25b8-5e79-92f3-f5b6ddfef6b8' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='7f50bf4d-4c29-4385-b5a6-b93ca5db9ee1' WHERE `id`='b828ea52-c4aa-5277-be64-3c8f85e03054' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='0726bf7a-c819-5e37-bf9c-448af6e5238c' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='36707b39-19ae-5848-b868-b1873ad7e79b' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='2d4dfa9c-e618-4133-953a-0e5d059cc7a1' WHERE `id`='7002bc53-f260-5fe4-8bf8-35a974682816' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='7f50bf4d-4c29-4385-b5a6-b93ca5db9ee1' WHERE `id`='a8966dbd-d32a-51d7-bb8d-84e667a53752' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='2d4dfa9c-e618-4133-953a-0e5d059cc7a1' WHERE `id`='e178550c-d7c4-50cd-89c9-3655b4448a45' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='67475b9c-0978-53c7-9571-49473ecb9f05' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='c8212000-f67e-5e44-a6f9-d1c4df08b9d0' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='2d4dfa9c-e618-4133-953a-0e5d059cc7a1' WHERE `id`='1be32ae3-55b1-571a-8689-600f784c7dc9' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='2d4dfa9c-e618-4133-953a-0e5d059cc7a1' WHERE `id`='53a11a69-3257-5f26-ae25-72a4d81716e4' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='7fc1a2bb-332b-52d5-af31-5ee435c390c9' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='4ee5a60f-d75b-53c8-935c-1765073df51a' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='2d4dfa9c-e618-4133-953a-0e5d059cc7a1' WHERE `id`='7ec779f5-0d2d-51c9-b18b-f68ea96c6922' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='2d4dfa9c-e618-4133-953a-0e5d059cc7a1' WHERE `id`='f0837ae0-7862-5f21-b3ad-5f8f768b5ea5' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='7f50bf4d-4c29-4385-b5a6-b93ca5db9ee1' WHERE `id`='e9a0c89d-b332-5e2c-bace-567e34f1570f' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='fb312254-3da4-4b9a-91ce-792b0a3141d1' WHERE `id`='e86db0db-526c-50cd-83ba-8a92b8057677' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='2d4dfa9c-e618-4133-953a-0e5d059cc7a1' WHERE `id`='941791c1-7956-51c9-ad73-a8ce1acf60d1' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='2d4dfa9c-e618-4133-953a-0e5d059cc7a1' WHERE `id`='855a89c4-9414-5b83-8b5b-4ae18ac7903e' AND (`category_id` IS NULL OR `category_id`='');
UPDATE `blog_posts` SET `category_id`='e2aa7a58-7428-4a68-9fb6-33f0c639d0c7' WHERE `id`='7dd3709a-686a-5e53-b3f5-1efb6ffb1aed' AND (`category_id` IS NULL OR `category_id`='');
COMMIT;

-- Photo for the one blog with no archived image (ICSI/الحقن المجهري):
-- reuse the topically-related semen-analysis image so it isn't a blank placeholder.
UPDATE `blog_posts` SET `image_url`='/uploads/rec-5ddd3067.jpg', `image_alt_ar`='الحقن المجهري', `image_alt_en`='Microscopic injection (ICSI)' WHERE `id`='e86db0db-526c-50cd-83ba-8a92b8057677' AND (`image_url` IS NULL OR `image_url`='' OR `image_url` LIKE '/images/%');

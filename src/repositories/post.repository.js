import db from "../database/database.connection.js";

function insertPost(link, description, info) {
  const idPost = db.query(
    `INSERT INTO posts ("userId", link, description) VALUES ($1,$2,$3)
    RETURNING id`,
    [info.id, link, description]
  );
  return idPost;
}

function insertHashTags(element, idPost) {
  return db.query(
    `WITH "insertTry" AS (
        INSERT INTO hashtags (hashtag) VALUES ($1)
        ON CONFLICT DO NOTHING
        RETURNING id
    )
    INSERT INTO "hashPost" ("hashtagId", "postId")
    SELECT COALESCE(it.id, h.id), ${idPost}
    FROM "insertTry" it
    LEFT JOIN hashtags h ON h.hashtag = $1
    WHERE it.id IS NOT NULL
    UNION
    SELECT id, ${idPost}
    FROM hashtags WHERE hashtag = $1;`,
    [element]
  );
}

function selectLinkrs(id) {
  return db.query(`
  SELECT 
    JSONB_BUILD_OBJECT(
        'username', author.username,
        'id', author.id,
        'image', author.image
    ) AS user, posts.id, posts.link, posts.description,
    COALESCE(reposts.timestamp, posts.timestamp) AS timestamp,
    ARRAY_AGG("usersLikes".username ORDER BY likes.id) AS "postLikes",
	CASE
	WHEN comments.id IS NOT NULL THEN
	ARRAY_AGG(
		JSONB_BUILD_OBJECT(
			'id', "userComment".id,
			'username', "userComment".username,
			'image', "userComment".image,
		'comment',comments.comment
		)
   )END AS "postComments",
    CASE 
        WHEN reposts.id IS NOT NULL THEN
            JSONB_BUILD_OBJECT(
                'username', "userRepost".username,
                'id', "userRepost".id
            )
    END AS "repostedBy",
    (SELECT COUNT(*) FROM reposts AS subReposts WHERE subReposts."postId" = posts.id) AS "repostCount"
FROM 
    (
    SELECT
        id, "userId", link, description, timestamp,
        NULL AS repost_id
    FROM posts

    UNION ALL

    SELECT
        posts.id, posts."userId", posts.link, posts.description,reposts.timestamp,
        reposts.id AS repost_id
    FROM reposts
    JOIN posts ON reposts."postId" = posts.id
    ) AS posts
JOIN users AS author ON posts."userId" = author.id
LEFT JOIN reposts ON posts.repost_id = reposts.id
LEFT JOIN users AS "userRepost" ON reposts."userId" = "userRepost".id
LEFT JOIN likes ON posts.id = likes."postId"
LEFT JOIN users AS "usersLikes" ON likes."userId" = "usersLikes".id
LEFT JOIN comments ON posts.id= comments."postId"
LEFT JOIN users AS "userComment" ON comments."userId" = "userComment".id
JOIN follows ON "followedId"=author.id
WHERE "followerId"=$1  
GROUP BY 
    author.username, author.id, author.image, 
    posts.id, posts.link, posts.description, 
    reposts.id, "userRepost".id, posts.repost_id,posts.timestamp,comments.id
ORDER BY timestamp DESC, id DESC
LIMIT 10;
  `, [id]);
}
function getPostById(id) {
  const post = db.query(
    `
        SELECT *
        FROM posts
        WHERE id=$1;
    `,
    [id]
  );
  return post;
}

function updatePost(id, newDescription) {
  const resp = db.query(
    `
        UPDATE posts
        SET description=$1
        WHERE id=$2;
    `,
    [newDescription, id]
  );
  return resp;
}

function getPostsByUserId(userId) {
  const posts = db.query(
    `
      SELECT JSON_BUILD_OBJECT(
        'username', author.username,
        'id', author.id,
        'image', author.image
      ) AS user, posts.id, link, description, 
      ARRAY_AGG( "usersLikes".username ORDER BY likes.id ) AS "postLikes"
      FROM posts
      JOIN users AS author ON posts."userId"=author.id
      LEFT JOIN likes ON posts.id=likes."postId"
      LEFT JOIN users AS "usersLikes" ON likes."userId"="usersLikes".id
      WHERE posts."userId"=$1
      GROUP BY author.username, author.id, author.image, posts.id, link, description
      ORDER BY posts.id DESC
      LIMIT 20;
    `,
    [userId]
  );
  return posts;
}

function insertLike(userId, postId) {
  db.query(`INSERT INTO likes ("userId", "postId") VALUES ($1,$2)`, [
    userId,
    postId,
  ]);
  return true;
}

function deleteLike(userId, postId) {
  db.query(`DELETE FROM likes WHERE likes."userId"=$1 AND likes."postId"=$2`, [
    userId,
    postId,
  ]);
  return false;
}

function deleteHashPost(postId) {
  return db.query(`DELETE FROM "hashPost" WHERE "postId"=$1`, [postId]);
}

function deletePostById(id) {
  return db.query(`DELETE FROM posts WHERE id=$1;`, [id]);
}

function sharePostById(postId, userId) {
  return db.query(`INSERT INTO reposts ("postId", "userId") VALUES ($1, $2);`, [
    postId,
    userId,
  ]);
}

export {
  insertPost,
  insertHashTags,
  selectLinkrs,
  getPostById,
  updatePost,
  getPostsByUserId,
  insertLike,
  deleteLike,
  deleteHashPost,
  deletePostById,
  sharePostById,
};

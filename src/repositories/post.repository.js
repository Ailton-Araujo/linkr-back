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

function selectLinkrs(id, query) {
  let sql = "";
  let values = [id];
  if (query.after) {
    values.push(query.after);
    sql += `AND posts.timestamp >$2`;
  } else if (query.before) {
    values.push(query.before);
    sql += `AND posts.timestamp <$2`;
  }
  return db.query(
    `
    WITH "LikesCount" AS (
      SELECT "postId", ARRAY_AGG("usersLikes".username ORDER BY likes.id) AS "postLikes"
      FROM likes
      LEFT JOIN users AS "usersLikes" ON likes."userId" = "usersLikes".id
      GROUP BY "postId"
  ),
  "DeduplicatedComments" AS (
      SELECT
          c."postId",
          ARRAY_AGG(
              JSONB_BUILD_OBJECT(
                  'id', c."userId",
                  'username', "userComment".username,
                  'image', "userComment".image,
                  'comment', c.comment
              ) ORDER BY c.id
          ) AS "comments"
      FROM comments c
      LEFT JOIN users AS "userComment" ON c."userId" = "userComment".id
      GROUP BY c."postId"
  )
  SELECT 
      JSONB_BUILD_OBJECT(
          'username', author.username,
          'id', author.id,
          'image', author.image
      ) AS user, 
      posts.id, 
      posts.link, 
      posts.description,
      COALESCE(reposts.timestamp, posts.timestamp) AS timestamp,
      "LikesCount"."postLikes" AS "postLikes",
      "DeduplicatedComments"."comments" AS "postComments",
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
      JOIN follows ON reposts."userId" = follows."followedId"
      WHERE "followerId"=$1 OR reposts."userId"=$1
      ) AS posts
  JOIN users AS author ON posts."userId" = author.id
  LEFT JOIN reposts ON posts.repost_id = reposts.id
  LEFT JOIN users AS "userRepost" ON reposts."userId" = "userRepost".id
  LEFT JOIN "LikesCount" ON posts.id = "LikesCount"."postId"
  LEFT JOIN "DeduplicatedComments" ON posts.id = "DeduplicatedComments"."postId"
  JOIN follows ON "followedId"=author.id
  WHERE ("followerId"=$1 OR posts."userId" = $1) ${sql}
  GROUP BY 
      author.username, author.id, author.image, 
      posts.id, posts.link, posts.description, 
      reposts.id, "userRepost".id, posts.repost_id,posts.timestamp, "LikesCount"."postLikes", "DeduplicatedComments"."comments"
  ORDER BY timestamp DESC, id DESC
  LIMIT 10;
  `,
    values
  );
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

function getPostsByUserId(userId, offset) {
  const posts = db.query(
    `
    WITH "LikesCount" AS (
      SELECT "postId", ARRAY_AGG("usersLikes".username ORDER BY likes.id) AS "postLikes"
      FROM likes
      LEFT JOIN users AS "usersLikes" ON likes."userId" = "usersLikes".id
      GROUP BY "postId"
  ),
  "DeduplicatedComments" AS (
      SELECT
          c."postId",
          ARRAY_AGG(
              JSONB_BUILD_OBJECT(
                  'id', c."userId",
                  'username', "userComment".username,
                  'image', "userComment".image,
                  'comment', c.comment
              ) ORDER BY c.id
          ) AS "comments"
      FROM comments c
      LEFT JOIN users AS "userComment" ON c."userId" = "userComment".id
      GROUP BY c."postId"
  )
    SELECT 
    JSONB_BUILD_OBJECT(
        'username', author.username,
        'id', author.id,
        'image', author.image
    ) AS user, posts.id, posts.link, posts.description,
    COALESCE(reposts.timestamp, posts.timestamp) AS timestamp,
    "LikesCount"."postLikes" AS "postLikes",
    "DeduplicatedComments"."comments" AS "postComments",
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
      JOIN follows ON reposts."userId" = follows."followedId"
        WHERE reposts."userId"=$1
    ) AS posts
  JOIN users AS author ON posts."userId" = author.id
  LEFT JOIN reposts ON posts.repost_id = reposts.id
  LEFT JOIN users AS "userRepost" ON reposts."userId" = "userRepost".id
  LEFT JOIN "LikesCount" ON posts.id = "LikesCount"."postId"
  LEFT JOIN "DeduplicatedComments" ON posts.id = "DeduplicatedComments"."postId"
  JOIN follows ON "followedId"=author.id
  WHERE (posts."userId"=$1 OR reposts."userId"=$1)
  GROUP BY 
      author.username, author.id, author.image, 
      posts.id, posts.link, posts.description, 
      reposts.id, "userRepost".id, posts.repost_id,posts.timestamp, "LikesCount"."postLikes", "DeduplicatedComments"."comments"
  ORDER BY timestamp DESC, id DESC
  LIMIT 10 OFFSET $2;
    `,
    [userId, offset]
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

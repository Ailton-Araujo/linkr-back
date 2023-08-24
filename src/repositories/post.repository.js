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
  SELECT JSON_BUILD_OBJECT(
    'username', author.username,
    'id', author.id,
    'image', author.image
  ) AS user, posts.id, link, description, 
  ARRAY_AGG( "usersLikes".username ORDER BY likes.id ) AS "postLikes"
  FROM posts
  JOIN users AS author ON posts."userId"=author.id
  JOIN follows ON "followedId"=author.id
  LEFT JOIN likes ON posts.id=likes."postId"
  LEFT JOIN users AS "usersLikes" ON likes."userId"="usersLikes".id
  WHERE "followerId"=$1  
  GROUP BY author.username, author.id, author.image, posts.id, link, description
  ORDER BY posts.id DESC
  LIMIT 20
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
};

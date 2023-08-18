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
function selectLinkrs() {
  return db.query(`
  SELECT JSON_BUILD_OBJECT(
    'username', users.username,
    'id', users.id,
    'image', users.image
  ) AS user, posts.id, link, description
  FROM posts
  JOIN users ON posts."userId"=users.id
  ORDER BY posts.id DESC
  LIMIT 20
  `);
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

function getPostsByUserId(userId){
    const posts = db.query(`
      SELECT JSON_BUILD_OBJECT(
        'username', users.username,
        'id', users.id,
        'image', users.image
      ) AS user, posts.id, link, description
      FROM posts
      JOIN users ON posts."userId"=users.id
      WHERE posts."userId"=$1
      ORDER BY posts.id DESC
      LIMIT 20;
    `, [userId]);
    return posts;
}

export { insertPost, insertHashTags, selectLinkrs, getPostById, updatePost, getPostsByUserId };

import db from "../database/database.connection.js";

export async function getPostsByHashtag(hashtag) {
  return db.query(
    `SELECT JSON_BUILD_OBJECT(
      'username', users.username,
      'id', users.id,
      'image', users.image
    ) AS user, posts.id, link, description
    FROM posts
    JOIN "hashPost" ON posts.id = "hashPost"."postId"
    JOIN hashtags ON "hashPost"."hashtagId" = hashtags.id
    JOIN users ON users.id = posts."userId"
    LEFT JOIN likes ON likes."postId" = posts.id
    WHERE hashtags.hashtag = $1;`,
    [hashtag]
  );
}

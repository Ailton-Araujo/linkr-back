import db from "../database/database.connection.js";

export async function getPostsByHashtag(hashtag) {
  return db.query(
    `SELECT posts.*
    FROM posts
    JOIN hashPost ON posts.id = hashPost."postId"
    JOIN hashtags ON hashPost."hashtagId" = hashtags.id
    WHERE hashtags.hashtag = $1;`,
    [hashtag]
  );
}

export { getUserByAll };

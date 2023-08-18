import db from "../database/database.connection.js";

export async function getPostsByHashtag(hashtag) {
  return db.query(
    `SELECT 
      posts.*, 
      users.image AS "userImage",
      users.username AS "userName",
      COUNT(likes.id) AS "likeCount"
    FROM posts
    JOIN "hashPost" ON posts.id = "hashPost"."postId"
    JOIN hashtags ON "hashPost"."hashtagId" = hashtags.id
    JOIN users ON users.id = posts."userId"
    JOIN likes ON likes."postId" = posts.id
    WHERE hashtags.hashtag = $1
    GROUP BY posts.id, "userImage", "userName";`,
    [hashtag]
  );
}

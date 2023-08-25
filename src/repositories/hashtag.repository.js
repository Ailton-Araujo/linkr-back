import db from "../database/database.connection.js";

export async function getPostsByHashtag(hashtag, offset) {
  return db.query(
    `SELECT JSON_BUILD_OBJECT(
      'username', author.username,
      'id', author.id,
      'image', author.image
    ) AS user, posts.id, link, description, 
    ARRAY_AGG( "usersLikes".username ORDER BY likes.id ) AS "postLikes"
    FROM posts
    JOIN users AS author ON posts."userId"=author.id
    LEFT JOIN likes ON posts.id=likes."postId"
    LEFT JOIN users AS "usersLikes" ON likes."userId"="usersLikes".id
    LEFT JOIN comments ON posts.id= comments."postId"
    LEFT JOIN users AS "userComment" ON comments."userId" = "userComment".id
    JOIN "hashPost" ON posts.id = "hashPost"."postId"
    JOIN hashtags ON "hashPost"."hashtagId" = hashtags.id
    WHERE hashtags.hashtag = $1
    GROUP BY author.username, author.id, author.image, posts.id, link, description
    ORDER BY timestamp DESC, id DESC
    LIMIT 10 OFFSET $2;`,
    [hashtag, offset]
  );
}

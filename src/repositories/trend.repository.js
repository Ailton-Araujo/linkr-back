import db from "../database/database.connection.js";

export function getTopTemTrending() {
  return db.query(
    `SELECT 
      hashtags.hashtag, 
      COUNT(*) AS count
    FROM hashtags
    JOIN "hashPost" ON hashtags.id = "hashPost"."hashtagId"
    GROUP BY hashtags.hashtag
    ORDER BY count DESC
    LIMIT 10;`
  );
}

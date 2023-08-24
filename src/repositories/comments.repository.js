import db from "../database/database.connection.js";

function insertComment(postId, userId, comment) {
  return db.query(
    `INSERT INTO comments ("postId", "userId", comment) VALUES ($1, $2, $3)`,
    [postId, userId, comment]
  );
}

export { insertComment };

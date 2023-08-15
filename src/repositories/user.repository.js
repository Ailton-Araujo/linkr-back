import db from "../database/database.connection.js";

async function getUserByAll(id, name, email) {
  return db.query(
    `SELECT * FROM users WHERE users.id= $1 AND users.name=$2 AND users.email= $3;`,
    [id, name, email]
  );
}

export { getUserByAll };

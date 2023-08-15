import db from "../database/database.connection.js";
import bcrypt from "bcrypt";

async function getUserByAll(id, name, email) {
  return db.query(
    `SELECT * FROM users WHERE users.id= $1 AND users.name=$2 AND users.email= $3;`,
    [id, name, email]
  );
}

async function registerNewUser({username, email, password, pictureUrl}) {
    const hashPassword = bcrypt.hashSync(password, 10);
    const result = await db.query(`INSERT INTO users (username, email, password, image) VALUES ($1, $2, $3, $4)`, [username, email, hashPassword, pictureUrl]);
    return result;
  };

export { getUserByAll, registerNewUser };

import db from "../database/database.connection.js";
import bcrypt from "bcrypt";

async function getUserByAll(id, username, email) {
  return db.query(
    `SELECT * FROM users WHERE users.id= $1 AND users.username=$2 AND users.email= $3;`,
    [id, username, email]
  );
}

async function registerNewUser({username, email, password, pictureUrl}) {
    const hashPassword = bcrypt.hashSync(password, 10);
    const result = await db.query(`INSERT INTO users (username, email, password, image) VALUES ($1, $2, $3, $4)`, [username, email, hashPassword, pictureUrl]);
    return result;
  };

async function getPasswordByEmail (email) {
    const result = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
    return result;
};

function getUserById(id){
  return db.query(
    `SELECT * FROM users WHERE users.id=$1;`,
    [id]
  );
}

function getUserByUsername(username){
  return db.query(
    `SELECT * FROM users WHERE username ILIKE $1;`, [`%${username}%`]
  );
}

function getAllUsers(){
  return db.query(`
    SELECT * FROM users;
  `)
}

export { getUserByAll, getPasswordByEmail, registerNewUser, getUserById, getUserByUsername, getAllUsers };

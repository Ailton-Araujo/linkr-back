import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  getAllUsers,
  getPasswordByEmail,
  getUserById,
  getUserByUsername,
  registerNewUser,
} from "../repositories/user.repository.js";

dotenv.config();

const registerUser = async (req, res) => {
  try {
    await registerNewUser(req.body);
    res.status(201).send();
  } catch (error) {
    if (error.code === "23505")
      return res.status(409).send({ message: "Email já cadastrado!" });
    res.status(500).send(error.message);
  }
};

const logInUser = async (req, res) => {
  const { email, password } = req.body;
  const secretKey = process.env.SECRET_KEY;

  try {
    const userData = await getPasswordByEmail(email);

    if (userData.rowCount === 0)
      return res
        .status(401)
        .send({ message: "Verifique os dados informados!" });

    const verifyPassword = bcrypt.compareSync(
      password,
      userData.rows[0].password
    );
    if (!verifyPassword)
      return res
        .status(401)
        .send({ message: "Verifique os dados informados!" });

    const userInfo = {
      id: userData.rows[0].id,
      username: userData.rows[0].username,
      email: userData.rows[0].email,
      image: userData.rows[0].image,
    };

    jwt.sign(userInfo, secretKey, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "JWT generation failed" });
      }

      res.status(200).send({ token });
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const sendBackInfo = (req, res) => {
  const info = res.locals.user;
  res.status(200).send(info);
};

async function getUsers(req, res) {
  const { username } = req.query;
  const loggedId = res.locals.user.id;
  
  let users;
  try {
    if (!username) users = await getAllUsers(loggedId);
    else users = await getUserByUsername(username, loggedId);
    res.send(users.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function getUsernameById(req, res) {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (user.rows.length === 0) res.sendStatus(404);
    res.send(user.rows[0].username);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export { logInUser, registerUser, sendBackInfo, getUsers, getUsernameById };

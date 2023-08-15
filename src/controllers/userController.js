import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerNewUser } from "../repositories/user.repository.js";

const registerUser = async (req, res) => {
    try {
        await registerNewUser(req.body);
        res.status(201).send();
    } catch (error) {
        if(error.code === "23505") return res.status(409).send({message: "Email já cadastrado!"});
        res.status(500).send(error.message);
    };
};

export { registerUser };

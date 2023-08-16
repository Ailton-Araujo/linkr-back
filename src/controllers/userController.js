import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getPasswordByEmail } from "../repositories/user.repository.js";

dotenv.config();

const logInUser = async (req, res) => {
    const {email, password} = req.body;
    const secretKey = process.env.JWT_SECRET;

    try {
            const userData = await getPasswordByEmail(email);
    
                if(userData.rowCount === 0) return res.status(401).send({message: "Verifique os dados informados!"})
                
                

                const verifyPassword = bcrypt.compareSync(password, userData.rows[0].password);
                if(!verifyPassword) return res.status(401).send({message: "Verifique os dados informados!"});

                const userInfo = {
                    username: userData.rows[0].username,
                    email: userData.rows[0].email,
                    image: userData.rows[0].image
                };
                
                jwt.sign(userInfo, secretKey, (err, token) => {
                    if (err) {
                         return res
                            .status(500)
                            .json({ message: "JWT generation failed" });
                    }

                    res.status(200).send({token});
                });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export { logInUser };

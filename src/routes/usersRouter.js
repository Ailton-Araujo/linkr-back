import { Router } from "express";
import schemaSignUp from "../schemas/signUp.js";
import schemaSignIn from "../schemas/signIn.js";
import validateSchema from "../middlewares/validateSchema.js";
import { registerUser, logInUser, sendBackInfo, getUsers, getUsernameById } from "../controllers/userController.js";
import validateAuth from "../middlewares/validateAuth.js";

const usersRouter = Router();

usersRouter.post("/signup", validateSchema(schemaSignUp), registerUser);

usersRouter.post("/login", validateSchema(schemaSignIn), logInUser);

usersRouter.get("/userinfo", validateAuth, sendBackInfo);

usersRouter.get("/users", validateAuth, getUsers);

usersRouter.get("/users/:id", validateAuth, getUsernameById);

export default usersRouter;

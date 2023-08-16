import { Router } from "express";
import schemaSignUp from "../schemas/signUp.js";
import schemaSignIn from "../schemas/signIn.js";
import validateSchema from "../middlewares/validateSchema.js";
import { registerUser, logInUser } from "../controllers/userController.js";

const usersRouter = Router();

usersRouter.post("/signup", validateSchema(schemaSignUp), registerUser);

usersRouter.post("/login", validateSchema(schemaSignIn), logInUser);

export default usersRouter;

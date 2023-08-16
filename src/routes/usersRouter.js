import { Router } from "express";
import schemaSignUp from "../schemas/signUp.js";
import schemaSignIn from "../schemas/signIn.js";
import validateSchema from "../middlewares/validateSchema.js";
import { registerUser, logInUser, sendBackInfo } from "../controllers/userController.js";
import validateAuth from "../middlewares/validateAuth.js";

const usersRouter = Router();

usersRouter.post("/signup", validateSchema(schemaSignUp), registerUser);

usersRouter.post("/login", validateSchema(schemaSignIn), logInUser);

usersRouter.get("/userinfo", validateAuth, sendBackInfo)

export default usersRouter;

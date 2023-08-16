import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.js";
import schemaSignIn from "../schemas/signIn.js";
import { logInUser } from "../controllers/userController.js";

const usersRouter = Router();

usersRouter.post("/login", validateSchema(schemaSignIn), logInUser);

export default usersRouter;

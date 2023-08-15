import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.js";
import schemaSignUp from "../schemas/signUp.js";
import { registerUser } from "../controllers/userController.js";

const usersRouter = Router();

usersRouter.post("/signup", validateSchema(schemaSignUp), registerUser);

export default usersRouter;

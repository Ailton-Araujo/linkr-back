import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.js";
import validateAuth from "../middlewares/validateAuth.js";

import {} from "../controllers/userController.js";

const usersRouter = Router();

export default usersRouter;

import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.js";

const postsRouter = Router();

postsRouter.patch("/posts/:id", validateAuth);

export default postsRouter;

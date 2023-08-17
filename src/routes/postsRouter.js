import { Router } from "express";
import validateAuth from "../middlewares/validateAuth";

const postsRouter = Router();

postsRouter.patch("/posts/:id", validateAuth, patchPost);

postsRouter.get("/posts/users/:userId", validateAuth, getPostsByUser);

export default postsRouter;

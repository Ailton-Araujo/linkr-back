import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.js";
import { getPostsByUser, patchPost } from "../controllers/postController.js";

const postsRouter = Router();

postsRouter.patch("/posts/:id", validateAuth, patchPost);

postsRouter.get("/posts/users/:userId", validateAuth, getPostsByUser);

export default postsRouter;
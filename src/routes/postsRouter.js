import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.js";
import validateSchema from "../middlewares/validateSchema.js";
import schemaLinkr from "../schemas/linkr.js";
import schemaLike from "../schemas/like.js";
import {
  postLinkr,
  getLinkrs,
  getPostsByUser,
  patchPost,
  postLike,
  deletePost,
  sharePost,
} from "../controllers/postController.js";

const postsRouter = Router();

postsRouter.post(
  "/timeline",
  validateAuth,
  validateSchema(schemaLinkr),
  postLinkr
);

postsRouter.get("/timeline", validateAuth, getLinkrs);

postsRouter.patch("/posts/:id", validateAuth, patchPost);

postsRouter.get("/posts", validateAuth, getPostsByUser);

postsRouter.post("/likes", validateAuth, validateSchema(schemaLike), postLike);

postsRouter.delete("/posts/:id", validateAuth, deletePost);

postsRouter.post("/posts/share/:id", validateAuth, sharePost);

export default postsRouter;

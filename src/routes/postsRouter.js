import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.js";
import validateSchema from "../middlewares/validateSchema.js";
import schemaLinkr from "../schemas/linkr.js";
import { postLinkr, getLinkrs, getPostsByUser, patchPost } from "../controllers/postController.js";

const postsRouter = Router();

postsRouter.post(
  "/timeline",
  validateAuth,
  validateSchema(schemaLinkr),
  postLinkr
);

postsRouter.get("/timeline", validateAuth, getLinkrs);

postsRouter.patch("/posts/:id", validateAuth, patchPost);

postsRouter.get("/posts/users/:userId", validateAuth, getPostsByUser);

export default postsRouter;
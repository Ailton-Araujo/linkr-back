import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.js";
import validateSchema from "../middlewares/validateSchema.js";
import schemaLinkr from "../schemas/linkr.js";
import { postLinkr } from "../controllers/postController.js";

const postsRouter = Router();

postsRouter.post(
  "/timeline",
  validateAuth,
  validateSchema(schemaLinkr),
  postLinkr
);
postsRouter.patch("/posts/:id", validateAuth);

export default postsRouter;

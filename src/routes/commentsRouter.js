import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.js";
import validateSchema from "../middlewares/validateSchema.js";
import schemaComment from "../schemas/comment.js";
import { addComment } from "../controllers/commentController.js";

const commentsRouter = Router();

commentsRouter.post(
  "/comments",
  validateAuth,
  validateSchema(schemaComment),
  addComment
);

export default commentsRouter;

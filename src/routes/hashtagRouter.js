import { Router } from "express";
import { getPostsByHashtagRoute } from "../controllers/hashtagController.js";
import validateAuth from "../middlewares/validateAuth.js";

const hashtagRouter = Router();

hashtagRouter.get("/hashtag/:hashtag", getPostsByHashtagRoute);

export default hashtagRouter;

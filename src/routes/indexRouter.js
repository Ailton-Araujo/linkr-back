import { Router } from "express";
import usersRouter from "./usersRouter.js";
import hashtagRouter from "./hashtagRouter.js";
import postsRouter from "./postsRouter.js";
import trendRouter from "./trendRouter.js";

const router = Router();

router.use(usersRouter);
router.use(hashtagRouter);
router.use(postsRouter);
router.use(trendRouter);

export default router;

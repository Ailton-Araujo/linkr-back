import { Router } from "express";
import usersRouter from "./usersRouter.js";
import hashtagRouter from "./hashtagRouter.js";
import postsRouter from "./postsRouter.js";
import trendRouter from "./trendRouter.js";
import followRouter from "./followRouter.js";

const router = Router();

router.use(usersRouter);
router.use(hashtagRouter);
router.use(postsRouter);
router.use(trendRouter);
router.use(followRouter);

export default router;

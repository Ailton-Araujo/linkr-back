import { Router } from "express";
import usersRouter from "./usersRouter.js";
import hashtagRouter from "./hashtagRouter.js";
import postsRouter from "./postsRouter.js";

const router = Router();

router.use(usersRouter);
router.use(hashtagRouter);
router.use(postsRouter);

export default router;

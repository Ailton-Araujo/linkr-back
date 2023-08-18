import { Router } from "express";
import usersRouter from "./usersRouter.js";
import postsRouter from "./postsRouter.js";
import trendRouter from "./trendRouter.js";

const router = Router();

router.use(usersRouter);
router.use(postsRouter);
router.use(trendRouter);

export default router;

import { Router } from "express";
import usersRouter from "./usersRouter.js";
import hashtagRouter from "./hashtagRouter.js";

const router = Router();

router.use(usersRouter);
router.use(hashtagRouter);

export default router;

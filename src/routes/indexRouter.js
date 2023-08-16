import { Router } from "express";
import usersRouter from "./usersRouter.js";
<<<<<<< HEAD
import hashtagRouter from "./hashtagRouter.js";
=======
import postsRouter from "./postsRouter.js";
>>>>>>> main

const router = Router();

router.use(usersRouter);
<<<<<<< HEAD
router.use(hashtagRouter);
=======
router.use(postsRouter);
>>>>>>> main

export default router;

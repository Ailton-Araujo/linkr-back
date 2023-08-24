import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.js";
import { follow, isFollowing, unfollow, hasFollows } from "../controllers/followControllers.js";

const followRouter = Router();

followRouter.get("/allfollows", validateAuth, hasFollows)
followRouter.get("/follow/:id", validateAuth, isFollowing);
followRouter.post("/follow/:id", validateAuth, follow);
followRouter.delete("/follow/:id", validateAuth, unfollow);

export default followRouter;
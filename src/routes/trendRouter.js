import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.js";
import { getTrending } from "../controllers/trendController.js";

const trendRouter = Router();

trendRouter.get("/trending", validateAuth, getTrending);

export default trendRouter;

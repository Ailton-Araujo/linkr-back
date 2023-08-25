import express from "express";
import cors from "cors";
import router from "./routes/indexRouter.js";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.utc();


// Server Create
const app = express();

// Server config
app.use(cors());
app.use(express.json());
app.use(router);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Server Listener
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});

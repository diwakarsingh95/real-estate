import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";

// Routers
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import listingRouter from "./routes/listing.route";
import errorMiddleware from "./middlewares/error.middleware";

const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(compression());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(3000, () => {
  console.log(`Server is running on port ${port}!`);
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

app.use(errorMiddleware);

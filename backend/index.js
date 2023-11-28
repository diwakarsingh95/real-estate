import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const port = process.env.PORT || 3000;
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(3000, () => {
  console.log(`Server is running on port ${port}!`);
});

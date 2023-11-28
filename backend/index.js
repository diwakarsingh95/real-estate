import express from "express";

const port = process.env.PORT || 3000;
const app = express();

app.listen(3000, () => {
  console.log(`Server is running on port ${port}!`);
});

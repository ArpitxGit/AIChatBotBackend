const express = require("express");
const env = require("dotenv");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

env.config();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/chat", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

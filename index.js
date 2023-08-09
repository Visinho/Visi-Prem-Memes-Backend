const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

//Routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

  app.use(express.json());
  app.use(helmet());
  app.use(morgan("common"));

  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);

app.listen(8080, () => {
    console.log("Server is running on port 8080...")
})
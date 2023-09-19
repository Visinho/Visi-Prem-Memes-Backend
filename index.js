// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const cors = require("cors");
// const multer = require("multer");
// const path = require('path');

// //Routes
// const userRoutes = require("./routes/users");
// const authRoutes = require("./routes/auth");
// const postRoutes = require("./routes/posts");

// dotenv.config();

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("Connected to MongoDB!");
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
//   });

//   app.use(express.json());
//   app.use(helmet());
//   app.use(morgan("common"));
//   app.use(cors()); 


//   //Multer picture upload
//   const storage = multer.diskStorage({
//     destination:(req, file, cb) => {
//       cb(null, "public/images");
//     },
//     filename: (req, file, cb) => {
//       cb(null, req.body.name);
//     },
//   });

//   const upload = multer({storage});

//   // app.use("/images", express.static(path.join(__dirname, "public/images")));
//   app.use("/images", express.static(path.join(__dirname, 'public', 'images')));

//   app.post("/api/upload", upload.single("file"), (req, res) => {
//     try {
//       // Log the uploaded file details
//       console.log(req.file);
//       return res.status(200).json("File uploaded successfully");
//     } catch (error) {
//       // Log and handle the error
//       console.error(error);
//       res.status(500).json("Error uploading file");
//     }
//   });

//   app.use("/api/users", userRoutes);
//   app.use("/api/auth", authRoutes);
//   app.use("/api/posts", postRoutes);

// app.listen(8080, () => {
//     console.log("Server is running on port 8080...")
// })

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require('path');

// Routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

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
app.use(cors()); 

// Multer picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using a timestamp and the original file extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use("/images", express.static(path.join(__dirname, 'public', 'images')));

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    // Log the uploaded file details
    console.log(req.file);
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    // Log and handle the error
    console.error(error);
    res.status(500).json("Error uploading file");
  }
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(8080, () => {
  console.log("Server is running on port 8080...");
});

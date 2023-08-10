const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

// REGISTER
router.post("/register", async (req, res) => {
try {
  const { username, email, password } = req.body;

  if(!username || !email || !password){
    res.status(400);
    throw new Error("All fields are mandatory!")
}

    // Validate password strength using regex
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({
          message:
            "Password must contain at least 6 characters including at least one number, one uppercase letter, one lowercase letter, and one special character.",
        });
    }

    // Generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    // Handle different types of errors
    if (error.code === 11000) {
      // Duplicate key error (unique constraint)
      res.status(400).json({ message: "Username or email already exists." });
    } else if (error.name === "ValidationError") {
      // Validation error
      res.status(400).json({ message: error.message });
    } else {
      // Other unexpected errors
      console.error("Error during user registration:", error);
      res
        .status(500)
        .json({ message: "An error occurred during registration." });
    }
  }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Wrong password.' });
        }

         // Generate access token
         const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

         // Generate refresh token
         const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        // Send JWT along with user data
        res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
});


module.exports = router;


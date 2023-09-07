const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


//Update User
router.put("/:id", async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
    const isAdmin = req.body && req.body.isAdmin ? req.body.isAdmin : false;
  
    try {
      // Check if the user has permission to update the account
      if (userId !== id && !isAdmin) {
        return res.status(403).json("You can only update your account!");
      }
  
      // Update Password
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
  
      // Update User Account
      const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body });
  
      // Respond with success message
      res.status(200).json("Account Updated Successfully!");
    } catch (error) {
      console.error('Error during user account update:', error);
      res.status(500).json("An error occurred during account update!");
    }
  });
  

//Delete User
router.delete("/:id", async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
    const isAdmin = req.body && req.body.isAdmin ? req.body.isAdmin : false;
  
    try {
      // Check if the user has permission to delete the account
      if (userId !== id && !isAdmin) {
        return res.status(403).json("You can only delete your account!");
      }
  
      // delete User Account
      const deletedUser = await User.findByIdAndDelete(id);

      // Check if the user was found and deleted
      if (!deletedUser) {
        return res.status(404).json("User not found!");
      }
  
      // Respond with success message
      res.status(200).json("Account deleted Successfully!");
    } catch (error) {
      console.error('Error during user account delete:', error);
      res.status(500).json("Something went wrong!!!");
    }
  });


// Get Single User
router.get("/", async (req, res) => {
  // const { id } = req.query; // Change this to req.query to match your usage
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    let user;

    if (userId) {
      user = await User.findById(userId);
    } else if (username) {
      user = await User.findOne({ username: username }); 
    } else {
      return res.status(400).json({ message: "You must provide either userId or username." });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const { password, createdAt, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "An error occurred while fetching the user." });
  }
});


//Follow a User
router.put("/:id/follow", async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (userId !== id) {
    try {
      // Find the user to follow and the current user
      const userToFollow = await User.findById(id);
      const currentUser = await User.findById(userId);

      // Check if the current user is not already following the target user
      if (!userToFollow.followers.includes(userId)) {
        // Update the user being followed (add current user to their followers)
        await userToFollow.updateOne({ $push: { followers: userId } });

        // Update the current user (add target user to their following list)
        await currentUser.updateOne({ $push: { following: id } });

        res.status(200).json("You are now following this user!");
      } else {
        res.status(403).json("You already follow this user!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cannot follow yourself!");
  }
});


//Unfollow a User
router.put("/:id/unfollow", async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (userId !== id) {
    try {
      // Find the user to follow and the current user
      const userToUnfollow = await User.findById(id);
      const currentUser = await User.findById(userId);

      // Check if the current user is not already following the target user
      if (userToUnfollow.followers.includes(userId)) {
        // Update the user being followed (add current user to their followers)
        await userToUnfollow.updateOne({ $pull: { followers: userId } });

        // Update the current user (add target user to their following list)
        await currentUser.updateOne({ $pull: { following: id } });

        res.status(200).json("You have now followed this user!");
      } else {
        res.status(403).json("You already unfollow this user!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cannot unfollow yourself!");
  }
});

module.exports = router;

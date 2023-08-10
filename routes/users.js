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
      res.status(500).json("An error occurred during account update.");
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
        return res.status(404).json("User not found.");
      }
  
      // Respond with success message
      res.status(200).json("Account deleted Successfully!");
    } catch (error) {
      console.error('Error during user account delete:', error);
      res.status(500).json("Something went wrong!!!");
    }
  });

//get a user

//follow a user

//unfollow a user

module.exports = router;

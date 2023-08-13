const router = require("express").Router();
const Post = require("../models/Post");

//Create Post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "An error occurred while creating the post." });
  }
});

//Update Post
router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
  
      const post = await Post.findById(id);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }
  
      if (post.userId === userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("Your post has been updated successfully!");
      } else {
        res.status(403).json("You can update only your post!");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "An error occurred while updating the post." });
    }
  });


module.exports = router;

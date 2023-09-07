const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const validateToken = require("../middlewares/validateToken");

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

  //Delete Post
router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
  
      const post = await Post.findById(id);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }
  
      if (post.userId === userId) {
        await post.deleteOne();
        res.status(200).json("Your post has been deleted successfully!");
      } else {
        res.status(403).json("You can delete only your post!");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "An error occurred while updating the post." });
    }
  });

  //Like or Dislike Post
  router.put("/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
  
      const post = await Post.findById(id);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }
  
      if (!post.likes.includes(userId)) {
        await post.updateOne({ $push: { likes: userId } });
        res.status(200).json("This post has been liked!");
      } else {
        await post.updateOne({ $pull: { likes: userId } });
        res.status(200).json("This post has been unliked!");
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      res.status(500).json({ message: "An error occurred while liking/unliking the post." });
    }
  });

  //Get Single Post
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const post = await Post.findById(id);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }
  
      res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "An error occurred while fetching the post." });
    }
  });

  //Get All Posts
  router.get("/", async (req, res) => {
    try {
      const posts = await Post.find(); 
  
      res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "An error occurred while fetching the posts." });
    }
  });
  
  //Get Timeline Posts
router.get("/timeline/:userId", async (req, res) => {
    try {
      const currentUser = await User.findById(req.params.userId);
  
      if (!currentUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const userPosts = await Post.find({ userId: currentUser._id });
  
      const friendPostsPromises = currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      });
  
      const friendPosts = await Promise.all(friendPostsPromises);
  
      const allPosts = userPosts.concat(...friendPosts);
      res.json(allPosts);
    } catch (error) {
      console.error("Error fetching timeline posts:", error);
      res.status(500).json({ message: "An error occurred while fetching timeline posts." });
    }
  });

  // Get all posts by a particular user
router.get("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "An error occurred while fetching user posts." });
  }
});

  
  


module.exports = router;

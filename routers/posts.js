const express  = require('express');
const { upload, getPosts, vote, getPostsById, deletePost ,updatePost} = require('../controllers/post');
const { Auth } = require('../middleware/authorize');
const router = express.Router();
router
.post("/upload",Auth, upload())
.get("/content", getPosts())
.post("/vote", vote())
.get("/me",Auth,getPostsById())
.delete("/:id",deletePost())
.put("/update/:id",Auth,updatePost())

module.exports.post = router;
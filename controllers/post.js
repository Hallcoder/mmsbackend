const { Post } = require("../models/post");
const { User } = require("../models/user");
const { cloudinary } = require("../utils/cloudinary");
module.exports.upload = () => {
  return async (req, res) => {
    try {
      const {content,status} = req.body;
      console.log("Status",status);
      if (!req.user)
        return res
          .status(401)
          .json({ message: "Not Authorized", status: "failed" });
      const uploadedContent = await cloudinary.uploader.upload_large(content, {
        folder: "mms",
        use_filename: true,
        resource_type: "auto",
        chunk_size: 5000,
      })
      const user1 = await User.findOneAndUpdate(
        { _id: req.user._id }
      );
      const post = new Post({
        uploadedBy: user1,
        status:status,
        content: uploadedContent,
      });
      await post.save();
      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            posts: post,
          },
        }
      );
      if (!user)
        return res
          .status(404)
          .json({ message: "User is not found", status: "failed" });
      await user.save();
      res
        .status(200)
        .json({ message: "Content uploaded successfully", status: "success" });
    }catch(error) {
      console.log(error);
      res.status(500).json({message:error})
    }
  };
};

module.exports.getPosts = () => {
  return async (req, res) => {
    const posts = await Post.find({status: "public"});
    res.status(200).json({ data: posts, status: "success" });
  };
};
module.exports.getPostsById = () => {
return async(req,res) => {
  const id = req.user._id;
  console.log(id)
  const user = await User.findById(id);
  if(!user) return res.status(404).json({message:"User not found",status:"failed!"});
  let posts = user.posts;
  return res.status(200).json({ data: posts, status: "success" ,message:"Posts received"});
}
}
module.exports.vote = () => {
  return async(req,res) => {
    let post;
    try {
      if(req.body.action === 'like'){
        post = await Post.findByIdAndUpdate(req.body.post,{
         $push:{likes:req.body.user}
       });
     }else{
       post = await Post.findByIdAndUpdate(req.body.post,{
         $pull:{likes:req.body.user}
       })
     }
    await post.save();
    return res.status(200).json({message:`${req.body.action} successfully done`,status:'success'});
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'internal server error'})
    }
    
  }
}
// module.exports.comment = () => {
//   return async(req,res) =>{
//     const post = await Post.findByIdAndUpdate(req.body.post,{
//       $push:{comments:{user:req.body.user,replies:[],content:req.body.comment,date:new Date()}}
//     })
//     await post.save();
//     return res.status(200).json({message:'commented successfully',status:'sucess'})
//   }
// }
module.exports.deletePost = () =>{
  return async(req,res) => {
    try {
      console.log(req.params.id);
      const post = await Post.findByIdAndDelete(req.params.id);
      const user = await User.findByIdAndUpdate(post.uploadedBy._id,{
        $pull:{posts:post}
      })
      await user.save();
      return res.status(201).json({message:"Deleted successfully",status:"success"})
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Something Went Wrong , Try again",status:"failed"})
    }
  }
}

module.exports.updatePost = () => {
return async(req,res) => {
  try {
    const uploadedContent = await cloudinary.uploader.upload_large(req.body.content, {
      folder: "mms",
      use_filename: true,
      resource_type: "auto",
      chunk_size: 5000,
    })
    let post = await Post.findByIdAndUpdate(req.params.id,{
      status:req.body.status,
      content:uploadedContent
    });
    await post.save();
    res
    .status(200)
    .json({ message: "Content updated successfully", status: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error})
  }
}
}
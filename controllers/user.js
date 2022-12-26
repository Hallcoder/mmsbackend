const lodash = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const { cloudinary } = require("../utils/cloudinary");
module.exports.signup = () => {
  return async (req, res) => {
    try {
      console.log("formData",req.body)
      const { error } = validate(req.body);
      if (error) return  res.status(401).json({ message: error.message, status: "failed!" });
      let userExist = await User.find({email: req.body.email});
      console.log(userExist);
      if(userExist[0]) return res.status(401).json({message:"An account with this email already exists", status: "failed!"});
      let userExist2 = await User.find({username: req.body.username});
      if(userExist2[0]) return res.status(401).json({message:"username is taken", status: "failed!"});
      const user = new User(
        lodash.pick(req.body, ["username", "password", "email"])
      );
      console.log(user.password)
      const salt = await bcrypt.genSalt(10);
      let hashed = await bcrypt.hash(user.password,salt);
      user.password  = hashed;
      await user.save();
      return res.status(200).json({data:lodash.pick(user, ["username","email","profilePicture"]),message:"User registered successfully",status:"success"});
    } catch (error) {
     console.error(error);
     return  res.status(500).json({message:"internal server error",status:"failed"});
    }
  };
};
module.exports.login = () => {
  return async (req, res) => {
    try {
        console.log(req.body)
        const { error } = validate(lodash.pick(req.body,["email","password"]),'login');
        console.log(error);
        if (error) return res.status(401).json({ message: error.message, status: "failed!" });
        const user = await User.findOne({email:req.body.email});
        console.log(user)
        if(!user) return res.status(401).json({message:"wrong emailor password", status: "failed!"});
        let isPasswordValid = await bcrypt.compare(req.body.password,user.password);
        console.log("Passwords eqaul? :", isPasswordValid);
        if(!isPasswordValid) return res.status(401).json({ message:"wrong email or password", status: "failed!"});
        const token = user.generateAuthToken();
        res.cookie("token",token,{
            secure:true,
            httpOnly:false,
            sameSite:'none',
        })
        await user.save();
        res.status(200).json({data:lodash.pick(user,["username","_id","email","profilePicture"]),message:"Login successfully",status: "success"});
      } catch (error) {
        console.log(error)
       return res.status(500).json({ message: 'internal server error', status: "failed!" });
      }
  };
};
module.exports.uploadImage = ()=>{
  return async(req,res)=>{
    const image = req.body.image;
    const token = req.cookies.token;
    const user  = await User.findOne({email:req.user.email})
    if(!token) return res.status(403).json({message:"Not authorized"})
    try {
      const uploadedImage =  await cloudinary.uploader.upload_large(image.file,{
        folder:'tiktok/users',
        use_filename:true
      });
      user.profilePicture = uploadedImage.secure_url;
      await user.save();
      return res.status(200).json({data:user,message:'Video successfull posted',status:"success"})
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:'internal server Error'})
    }
   
  }
}
module.exports.resetPassword = () => {
  return async (req, res) => {};
};

module.exports.updateUser = () => {
  return async (req, res) => {
    const image = req.body.data.profilePicture;
    const token = req.cookies.token;
    // if(!token) return res.status(403).json({message:"Not authorized"})
    try {
      const uploadedImage =  await cloudinary.uploader.upload_large(image,{
        folder:'tiktok/users',
        use_filename:true
      });
      const user = await User.findByIdAndUpdate(req.body.user._id,
        lodash.pick(req.body.data, ["username","bio"])
      )
      user.profilePicture = uploadedImage.secure_url;
      await user.save();
      return res.status(200).json({message:"User updated successfully",data:lodash.pick(user,['username','_id','profilePicture','bio']),status: "success"})
    } catch (error) {
      console.log(error)
      return  res.status(500).json({message:'internal server error'})
    }
    
  }
}

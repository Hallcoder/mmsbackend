require('dotenv').config();
const jwt = require('jsonwebtoken');
module.exports.Auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(403).json({message:'Unauthorized',status:'failed'});
        const payLoad = jwt.verify(token,process.env.JWT_PRIVATE_KEY);
        req.user = payLoad;
        next();
    } catch (error) {
         console.log(error);
         return res.status(500).json({message:"Internal Server Error"});
    }
}
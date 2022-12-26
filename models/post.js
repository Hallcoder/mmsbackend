const mongoose = require('mongoose');
const Joi = require('joi');
const postSchema=  new mongoose.Schema({
    uploadedBy:{
        type:Object,
        required:true
    },
    dateUploaded:{
        type:Date,
        default:Date.now(),
    },
    status:{
        type:String,
        default:"private"
    },
    votes:{
        type:Array,
    },
    shares:{
        type:Array,
        //default:[{user:'Foo'}],
    },  
    content:{
        type:Object,
        required:true
    },
    isVotedByCurrentUser:{
        type:Boolean,
        default:false
    }
    });

// function validatePost(post){
//     const schema  = Joi.object({
//         uploadedBy:Joi.object().
//     })
// }

module.exports.Post = mongoose.model('Posts',postSchema);
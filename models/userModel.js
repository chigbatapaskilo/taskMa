const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
   
    email:{
        type:String,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        trim:true
    },
    isVerified:{ 
        type:Boolean, 
        default:false 
    },

},{timestamps:true})
const userModel=mongoose.model('taskma', userSchema)
module.exports=userModel
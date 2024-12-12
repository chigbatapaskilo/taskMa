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

},{timestamps:true})
const User=mongoose.model('user',userSchema)
module.exports=User;
const mongoose=require("mongoose");

const prioritySchema=new mongoose.Schema({
    priorityName:{
    type:String,
    required:true,
},
priorityImage:{
    type:String,
    required:true,
},
},{timestamps:true});
const Priority=mongoose.model("priority",prioritySchema);
module.exports=Priority
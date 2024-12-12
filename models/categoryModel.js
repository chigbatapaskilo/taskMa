const mongoose=require("mongoose");

const categorySchema=new mongoose.Schema({
categoryName:{
    type:String,
    required:true,
    unique:true
},
categoryImage:{
    type:String,
    required:true,
},
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"taskma"
}
},{timestamps:true});
const Category=mongoose.model("categories",categorySchema);
module.exports=Category
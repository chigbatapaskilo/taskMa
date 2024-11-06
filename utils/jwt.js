const jwt=require("jsonwebtoken");
require('dotenv').config()

exports.generateToken=(_id,email)=>{
  const userToken=jwt.sign({_id,email},process.env.JWT_SECRET,{expiresIn:"24h"})
  return userToken
}
const { forgetPassword, resetPassword } = require("../controllers/password");
const { createUser, loginUser, getOneUser } = require("../controllers/user");
const { authorize } = require("../middleware/auth");

const route=require("express").Router();

route.post("/user",createUser);
route.post("/login",loginUser);
route.get("/user/:id",authorize,getOneUser);
route.post("/user/password",forgetPassword);
route.post("/user/password/:token",resetPassword);

module.exports=route;
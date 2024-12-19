const { createCategory, getOneCategory, getOneUsersCategory, deleteAcategory } = require("../controllers/category");
const { authorize } = require("../middleware/auth");
const route=require("express").Router()
route.post("/category",createCategory);
route.get("/category/:categoryId",getOneCategory);
route.get("/category/:user",getOneUsersCategory);
route.delete("/category/delete/:categoryId",deleteAcategory);
module.exports=route

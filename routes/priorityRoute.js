const { createPriority, getpriority } = require("../controllers/priority");
const { authorize } = require("../middleware/auth");
const route=require("express").Router()
route.post("/priority",createPriority);
route.get("/priority/priorities",getpriority)
module.exports=route
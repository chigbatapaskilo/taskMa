const { createTask, getOneTask, getTasksByPriorityAscending } = require("../controllers/task");
const { authorize } = require("../middleware/auth");
const route=require("express").Router()
route.post("/task/new/user",createTask)
route.get("/task/:taskId",getOneTask)
route.get("/task/priorities",getTasksByPriorityAscending)

module.exports=route
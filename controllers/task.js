const Priority = require("../models/priority");
const Task = require("../models/taskModel");

exports.createTask = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({
        message: `user not found.`,
      });
    }
    const { taskName, description, time, date, priority, category } = req.body;
    if (!taskName || !description) {
      return res.status(400).json({
        message: `please enter all fields.`,
      });
    }
    const checkPriority = await Priority.findOne({ priorityName: priority });
    if (!checkPriority) {
      return res.status(404).json({
        message: `priority not found.`,
      });
    }
    const checkCategory = await Priority.findOne({ categoryName: category });
    if (!checkCategory) {
      return res.status(404).json({
        message: `category not found.`,
      });
    }
    const task = new Task({
      taskName,
      description,
      time,
      date,
      Priorities:checkPriority._id,
      category:checkCategory._id,
      user:userId
    });
    await task.save()
    res.status(201).json({
        message:`task created successfully.`,
        data:task
    })
  } catch (error) {
    res.status(500).json({
      message: `server error`,
      errorMessage: error.message,
    });
  }
};
exports.getOneTask = async (req, res) => {
  try {
    const {taskId}=req.params
    const findTask=await Task.findById(taskId);
    if(!findTask){
return res.status(404).json({
  message:`task not found.`
})
    }
res.status(200).json({
  message:`task found.`,
  data:findTask
})

  } catch (error) {
    res.status(500).json({
      message: `server error`,
      errorMessage: error.message,
    });
  }
};
exports.getTasksByPriorityAscending = async (req, res) => {
    try {
        const userId = req.user._id
      // Find all tasks in ascending order of priority (1-10) using the `Priorities` field
      const tasks = await Task.find({user:userId})
        .sort({ Priorities: 1 }); // Sort by 'Priorities' field in ascending order
  
      if (!tasks.length) {
        return res.status(200).json({
          message: 'No tasks found.',
        });
      }
  
      res.status(200).json({
        message: 'Tasks retrieved successfully.',
        data: tasks,
      });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).json({
        message: 'Server error.',
        errorMessage: error.message,
      });
    }
  };
exports.getAllTask=async(req,res)=>{
    try {
        const userId = req.user._id
     const task=await Task.find({user:userId})   
    } catch (error) {
        res.status(500).json({
            message: `server error`,
            errorMessage: error.message,
          })  
    }
}
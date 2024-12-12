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
      priority,
      category,
    });
    await task.save()
  } catch (error) {
    res.status(500).json({
      message: `server error`,
      errorMessage: error.message,
    });
  }
};
exports.getOneTask = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: `server error`,
      errorMessage: error.message,
    });
  }
};

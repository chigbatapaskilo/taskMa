const cloudinary = require("../config/cloudinary");
const Priority = require("../models/priority");

exports.createPriority = async (req, res) => {
  try {
    const { priorityName } = req.body;
    if (!priorityName) {
      return res.status(400).json({
        message: `please enter prioty name.`,
      });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Please upload a image." });
    }

    const filePath = file.path;

    const image = await cloudinary.uploader.upload(filePath);

    fs.unlink(filePath, (error) => {
      if (error) {
        console.error(`Failed to delete local file: ${error}`);
      } else {
        console.log(`Local file deleted: ${filePath}`);
      }
    });
    const prior = new Priority({
      priorityName,
      priorityImage: image.secure_url,
    });
    await prior.save();
    res.status(201).json({
      message: `created successfully.`,
      data: prior,
    });
  } catch (error) {
    res.status(500).json({
      message: "error trying to process your request",
      errorMessage: error.message,
    });
  }
};
exports.getpriority = async (req, res) => {
  try {
    const findPriority = await Priority.find();
    if (findPriority === 0) {
      return res.status(400).json({
        message: `no priority found.`
      });
    }
    res.status(200).json({
        message:`here are all the priority.`,
        data:findPriority
    })
  } catch (error) {
    res.status(500).json({
      message: "error trying to process your request",
      errorMessage: error.message,
    });
  }
};

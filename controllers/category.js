const cloudinary=require("../config/cloudinary")
const Category = require("../models/categoryModel");
const User = require("../models/userModel");

exports.createCategory = async (req, res) => {
  try {
    const userId = req.params.id;
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return res.status(404).json({
        message: `user not found.`,
      });
    }
    const { categoryName } = req.body;
    if (!categoryName) {
      return res.status(400).json(`please input categoryName`);
    }
    const checkCatName = await Category.findOne(categoryName);
    if (checkCatName) {
      return res.status(400).json({
        message: `please use another name a category with the same name exists.`,
      });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Please upload a file." });
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
    const cat=new Category({
      categoryName,
      categoryImage:image.secure_url,
      user:userId
    })

    await cat.save()
    res.status(201).json({
      message:`new category created`,
      data:cat
    })
  } catch (error) {
    res.status(500).json({
      message: "error trying to process your request",
      errorMessage: error.message,
    });
  }
};

exports.getOneCategory=async(req,res)=>{
  try{
    const {categoryId}=req.params.categoryId;
    const category=await Category.findById(categoryId);
    if(!category){
      return res.status(404).json({
        message:`category not found`
      })
    }
    res.status(200).json({
      message:`here is the category ${category.categoryName}`,
      data:category
    })

  }catch(error){
    res.status(500).json({
      message: "error trying to process your request",
      errorMessage: error.message,
    });
  }
  exports.getCategory = async (req, res) => {
    try {
      const findCategory = await Category.find();
      if (findCategory.length <= 0) {
        return res.status(400).json({
          message: `no category found`,
        });
      }
     
      res.status(200).json({
        message:`here are all the ${findCategory.length}categories`,
       data: findCategory
      });
    } catch (error) {
      res.status(500).json({
        message: `error trying to process your request`,
        errorMessage: error.message,
      });
    }
  };
  exports.getOneUsersCategory=async(req,res)=>{
    try {
      const userId=req.params.user;
      const checkUser=await User.findById(userId);
      if(!checkUser){
        return res.status(404).json({
          message:`user not found.`
        })
      }
      const categories=await Category.find({user:userId});
      if(categories.length ===0){
        return res.status(404).json({
          message:`no category  not found.`
        })
      }
      res.status(200).json({
        message:`here are all your ${categories.length}categories`,
       data: categories
      });

    } catch (error) {
      res.status(500).json({
        message: `error trying to process your request`,
        errorMessage: error.message,
      });
    }
  }

exports.deleteAcategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const checkCat = await Category.findById(categoryId);
    if (!checkCat) {
      return res.status(404).json({
        message: "category not found",
      });
    }
    const deleteCat = await Category.findByIdAndDelete(categoryId);
    res.status(200).json({
      message: `deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: `error trying to process your request`,
      errorMessage: error.message,
    });
  }}}
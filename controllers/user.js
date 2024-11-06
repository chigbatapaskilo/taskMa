const userModel=require('../models/userModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
exports.createUser=async(req,res)=>{
    try {
        const {email,password,confirmPassword}=req.body
        if(!email||!password||!confirmPassword){
            return res.status(400).json({
                message:`please enter all fields`
            })
        }
        const checkEmail=await userModel.findOne({email:email.toLowerCase()})
        if(checkEmail){
            return res.status(400).json({
                message:`a user with this email already exist`
            })
        }
        if(confirmPassword !== password){
         return res.status(400).json({
            message:`password does not match`
         })
        }
        const saltPassword=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,saltPassword)
        const user=new userModel({
            email:email.toLowerCase(),
            password:hashPassword
        })
        console.log(user)
        await user.save()
        res.status(201).json({
            message:`welcome ${user.email}`,
            data:user
        })
    } catch (error) {
        if (error.code === 11000) {
            const whatWentWrong = Object.keys(error.keyValue)[0];
            return res.status(500).json({ message: `A user with this ${whatWentWrong} already exists. Please use a different one.` });
          }else{
            res.status(500).json({
                message:'error trying to process your request',
                errorMessage:error.message
            })
          }  
    }
}

exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate email and password presence (early return)
      if (!email || !password) {
        return res.status(400).json({
          message: 'Please enter email and password',
        });
      }
  
      // Find the user by email, handle potential errors (early return)
      const checkUser = await userModel.findOne({ email: email.toLowerCase() });
      if (!checkUser) {
        return res.status(404).json({
          message: 'User with the email not found',
        });
      }
  
      // Validate password using bcrypt, handle incorrect password (early return)
      const checkPassword = await bcrypt.compare(password, checkUser.password);
      if (!checkPassword) {
        return res.status(400).json({
          message:    'Incorrect password. Try again.',
        });
      }
  
      // Generate JWT token on successful login
      const token = jwt.sign({ email: checkUser.email, userId: checkUser._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
  
      // Send successful login response with token and user data
      res.status(200).json({
        message: 'Login successful',
        data: checkUser,
        token,
      });
    } catch (error) {
      // Handle unexpected errors during login process
      console.error('Error during login:', error);
      res.status(500).json({
        message: 'Error trying to process your request',
        errorMessage:error.message
      });
    }
  };
exports.getOneUser=async(req,res)=>{
 try {
    const {userId}=req.user
    const user=await userModel.findById(userId)
    if(!user){
        return res.status(404).json({
            message:`user not found`
        })
    }
    res.status(200).json({
       message:`welcome back `,
       data:user 
    })
    
 } catch (error) {
    res.status(500).json({
        message:'error trying to process your request',
        errorMessage:error.message
    })
 }   
}
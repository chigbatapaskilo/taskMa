const userModel=require('../models/userModel')
const bcryptjs = require('bcryptjs')
const jwt=require('jsonwebtoken')
const nodeMailer = require ("nodemailer")
const sendMail = require('../helper/sendMail')
const signUpTemplate = require('../helper/html')

exports.signUp = async(req,res)=>{
  try {
      const {email,password} = req.body
      if(!email|| !password){
          return res.status(400).json({
              message: `Please enter all details`
          })
      }        
      const existingUser = await userModel.findOne({email})
      if (existingUser) {
          return res.status(400).json({
              message: `User with email already exist`
          })
      } 
      const saltedPassword = await bcryptjs.genSaltSync(12)
      const hashedPassword = await bcryptjs.hashSync(password, saltedPassword) 
      
      const user = new userModel({
          email:email.toLowerCase().trim(),
          password:hashedPassword
          
      })
          const Token = jwt.sign({
              id:user._id,
              email:user.email
              },process.env.JWT_SECRET || taskma,
              {expiresIn:"30 minutes"}
          )
          const verifyLink =  `http://localhost:2200/api/v1/verify/${user._id}/${Token}`
           await user.save()
          await sendMail({
              subject:`Verification email`,
              email:user.email,
              html:signUpTemplate(verifyLink,user.email)
          })
          res.status(200).json({
              message: `User created successfully`,
              data:user,
              Token
          })
      
  } catch (error) {
      if (error.code === 11000) {
          const duplicateField = Object.keys(error.keyValue)[0]; 
          const duplicateValue = error.keyValue[duplicateField];
  
          return res.status(400).json({
              error: `This ${duplicateField} has already been used, Please use another one.`,
          });
      }
  res.status(500).json("internal server error " + error.message)
  }
}




exports.verifyEmail = async (req, res) => {
    try {
        // Extract the token from the request params
        const { Token } = req.params;
        // Extract the email from the verified token
        const { email } = jwt.verify(Token, process.env.JWT_SECRET);
        // Find the user with the extracted email
        const user = await userModel.findOne({email});

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // Check if the user has already been verified
        if (user.isVerified) {
            return res.status(400).json({
                message: 'User already verified',
            });
        }

        // Verify the user
        user.isVerified = true;
        // Save the user data
        await user.save();

        // Send a success response
        return res.status(200).json({
            message: 'User verified successfully',
        });

    } catch (err) {
        // Handle JWT expiration or verification errors
        if (err instanceof jwt.JsonWebTokenError) {
            return res.json({message: 'Link expired.'})
        }

        // Handle other errors
        return res.status(500).json({ message: err.message });
    }
};



exports.login = async(req,res)=>{
  try {
      const {email,password} = req.body
      if(!email || !password){
          return res.status(400).json({
              message:`Please enter all details`
          })
      }
      const checkMail = await userModel.findOne({email:email.toLowerCase()})
      if(!checkMail){
          return res.status(400).json({
              message:`User with email not found`
          })
      }
      const confirmPassword = await bcryptjs.compare(password,checkMail.password)
      if(!confirmPassword){
          return res.status(400).json({
              message:`Incorrect password`
          })
      }

      if(!checkMail.isVerified){
          return res.status(400).json({
              message:`User not verified,Please check your mail to verify your account`
          })
      }
      const Token = await jwt.sign({
          userId:checkMail._id,
          Email:checkMail.email,
      },process.env.JWT_SECRET,{expiresIn:'1h'})

      res.status(200).json({
          message:`Login succssfully`,
          data:checkMail,
          Token
      })
  } catch (err) {
      res.status(500).json(err.message)
  }
}

exports.resendVerificationEmail = async (req, res) => {
    try {
        const {email} = req.body;
        // Find the user with the email
        const user = await userModel.findOne({email});
        // Check if the user is still in the database
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        // Check if the user has already been verified
        if (user.isVerified) {
            return res.status(400).json({
                message: 'User already verified'
            })
        }

        const Token = jwt.sign({
        Email: user.Email 
       }, process.env.JWT_SECRET, 
       { expiresIn: '20mins' 
       });
        const verifyLink = `http://localhost:2200/api/v1/verify/${user._id}/${Token}`

        let mailOptions = {
            email: user.Email,
            subject: 'Verification email',
            html: verifyTemplate(verifyLink, user.Name),
        }
        // Send the the email
        await sendMail(mailOptions);
        // Send a success message
        res.status(200).json({
            message: 'Verification email resent successfully'
        })

    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.forgetPassword = async(req,res) =>{
    try {
        const {Email} = req.body
        // Find the user with the email
        const user = await userModel.findOne({email});
        // Check if the user is still in the database
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const resetToken = jwt.sign({
        email: user.email 
        }, process.env.JWT_SECRET,
        { expiresIn: '20mins' 
        });

        const resetLink = `http://localhost:2200/api/v1/verify/${user._id}/${resetToken}`
        const mailOptions = {
            email: user.Email,
            subject: 'Reset password',
            html:forgotPasswordTemplate(resetLink,user.Name)
        }

        await sendMail(mailOptions)

        res.status(200).json({
            message:`Email for reset password sent successfully`
        })
    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.resetPassword = async (req,res)=>{
    try {
        //get the token from params
        const {Token} = req.params
        const {password} = req.body

        //confirm the new password
        const {email} = jwt.verify(Token,process.env.JWT_SECRET)
        // Find the user with the email
        const user = await userModel.findOne({email});
        // Check if the user is still in the database
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const saltedeRounds = await bcryptjs.genSalt(12);
        const hashedPassword = await bcryptjs.hash(password, saltedeRounds);

        user.password = hashedPassword
        // console.log(hashedPassword)
        
        await user.save()

        res.status(200).json({
            message:`Reset password successfully`
        })
    } catch (err) {
        // Handle JWT expiration or verification errors
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(400).json({ message: 'Token has expired, please request for another link' });
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        res.status(500).json(err.message)
    }
}

exports.changePassword = async(req,res)=>{
    try {
       const Token = req.params
       const {password,OldPassword} = req.body
       const {email} = jwt.verify(Token,process.env.JWT_SECRET) 
       //check for user
       const user = await userModel.findOne({email})
       if(!user){
        return res.status(400).json('User not found')
    }
       const verifyPassword = await bcryptjs.compare(OldPassword,user.password)
       if(!verifyPassword){
        return res.status(400).json('Password does not correspond with the previous password')
    }
       const saltedeRounds = await bcryptjs.genSalt(12)
       const hashedPassword = await bcryptjs.hash(password,saltedeRounds)
       user.password = hashedPassword

       await user.save()
       res.status(200).json('Password changed successfully')

    } catch (err) {
       res.status(500).json(err.message) 
    }
}

exports.updateUser = async (req, res) => {
    try {
         const { id } = req.params; // Assuming the user's ID is passed as a URL parameter
         const {email,password} = req.body

        if (!id) {
            return res.status(400).json(`User ID is required.`);
        }

        // Find the user by ID
        const user = await userModel.findByIdAndUpdate(id);

        if (!user) {
            return res.status(404).json(`User not found.`);
        }

        // Update the user's details
       
        user.password = Password || user.password;
        user.email = email || user.email;

        // Save the updated user
        await user.save();

        res.status(200).json({
            message: 'User updated successfully.',
            data: user,
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.getAll = async(req,res)=>{
    try {
        const all = await userModel.find()
        res.status(200).json({
            message:`kindly find below all ${all.length}`,
            data:all})
    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.oneUser = async (req, res) => {
    try {
        const  {id}  = req.params;
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({
            message: 'User retrieved successfully.',
            data: user,
        });
    } catch (err) {
        res.status(500).json(err.message);      
    }
};


exports.deleteUser = async (req,res)=>{
    try {
        const {Id} = req.params
        const user = await userModel.findById(Id)
        if(!user){
            return res.status(404).json({
                message: `User not found`
            })
        }

        const deletedUser = await userModel.findByIdAndDelete(Id)
      res.status(200).json({
        message: `User deleted successfully`
      })

    } catch (err) {
        res.status(500).json(err.message)
    }
}

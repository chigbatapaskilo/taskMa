const joiValidation = require('@hapi/joi');

exports.signUpValidator = async (req, res, next) => {
    const Schema = joiValidation.object({
    

        email: joiValidation.string().email().min(7).required().messages({
          "any.required": "please kindly fill your email address",
          "string.empty": "email cannot be empty",
          "string.email":"invalid email format. please enter a valid email address",
        }),
    
        password: joiValidation.string().required().min(8).max(50).pattern(new RegExp("^(?=.*[!@#$%^&*.])(?=.*[A-Z]).{8,}$")).messages({
            "string.pattern.base":"Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "string.empty": "Password cannot be empty",
            "string.min":"password length must be at least 8 characters long"
          }),
    
         PhoneNumber:joiValidation.string().pattern(/^\d+$/).message({
          "any.required":"Phone number is not allowed to be empty",
          "string.empty":"Phone number cannot be empty",
          "string.pattern.base":"Phone number must be exactly 11 digits"
          
         }) 
          });
            const { error } = Schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
      next();
    };


exports.loginValidator = async (req, res, next) => {
    const Schema = joiValidation.object({
        email: joiValidation
        .string()
        .email()
        .min(7)
        .required()
        .messages({
          "any.required": "please kindly fill your email address",
          "string.empty": "email cannot be empty",
          "string.email":
            "invalid email format. please enter a valid email address",
        }),
    
        password: joiValidation
          .string()
          .required()
          .min(8)
          .max(50)
          // .regex(
          //   /^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%^&(),.?":{}|<>])[A-Za-z0-9!@#$%^&(),.?":{}|<>]{8,50}$/
          // )
          .messages({
            "string.pattern.base":"Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "string.empty": "Password cannot be empty",
          }),
        })
        
    const {err} = Schema.validate(req.body);

    if (err) {
        return res.status(400).json({
            message: err.details[0].message
        })
    }

    next()
}
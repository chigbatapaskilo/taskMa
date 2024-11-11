const express = require('express')
const { signUp, login, verifyEmail, resendVerificationEmail, forgetPassword, changePassword, resetPassword, updateUser, deleteUser, oneUser, getAll,} = require('../controllers/userController')
const { authenticate, isAdmin } = require('../middleware/auth')  
const { signUpValidator, loginValidator } = require('../middleware/validator')

const router = express.Router()

router.post('/sign-up',signUpValidator,signUp)
router.get('/verify/:Token',verifyEmail)
 router.post('/sign-in',loginValidator,login)
 router.get('/getall',getAll)
 router.get('/getone/:id',oneUser)
 router.delete('/delete/:Id',deleteUser)

router.put('/update/:id',updateUser)
router.post('/resend-verification',resendVerificationEmail)
router.post('/forgot-password',forgetPassword)
router.post('/change-password/:token',changePassword)
router.post('/reset-password/:token',resetPassword)






 

module.exports = router 
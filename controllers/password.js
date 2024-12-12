const User = require("../models/userModel");
const { generateToken } = require("../utils/jwt");
const sendMail=require("../helper/mail")

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: `please enter email.`,
      });
    }
    const users = await User.findOne(email);
    if (!user) {
      return res.status(404).json({
        message: `user not found.`,
      });
    }
    const token=generateToken(users._id,users.email);
    const verificationLink = `https://trak-fundz.vercel.app/#/reset/${token}`;
    const mailOption = {
      email: users.email,
      subject: `forgetten password`,
      html: forgetPasswordtemplate(verificationLink, users.email),
    };
    await sendMail(mailOption);
    res.status(200).json("check your email to confirm and reset password");

  } catch (error) {
    res.status(500).json({
      message: `server error`,
      errorMessage: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const { email } = Jwt.verify(passwordToken, process.env.JWT_SECRET);
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json("user not found");
      }
      const saltPassword = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, saltPassword);
      user.password = hashPassword;
      await user.save();
      res.status(200).json("password successfully changed");
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while processing your request.",
        errorMessage: error.message,
      });
    }
  };
const jwt=require("jsonwebtoken");
const User=require("../models/userModel")


const authorize = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;

        if (!auth) {
            return res.status(401).json({
                message: 'Action requires sign-in. Please log in to continue.'
            });
        }

        const token = auth.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Action requires sign-in. Please log in to continue.'
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(404).json({
                message: 'Authentication Failed: User not found'
            });
        }
       
        req.user = decodedToken;

        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Oops! Access denied. Please sign in."
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json({ message: "Unauthorized: Not an admin" });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  module.exports = {
    authorize,
    isAdmin,
  };
const mongoose=require("mongoose");
require("dotenv").config();

exports.connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.DATABASE_URL);
        const url = `${db.connection.host}:${db.connection.port}`; 
        console.log(`MongoDB connected: ${url}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}



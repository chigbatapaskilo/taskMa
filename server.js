require("dotenv").config();
const port=process.env.PORT;
const {connectDB}=require("./config/db")
const app=require("./app")
app.listen(port,async()=>{
    await connectDB()
  console.log( `Server is running on port: ${port}`)
});
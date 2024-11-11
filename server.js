// require("dotenv").config();

// const PORT=process.env.PORT;

// //const {connectDB}=require("./config/db")
// const app=require("./app")

// app.listen(PORT,async()=>{
//   console.log( `Server is running on port: ${PORT}`)
// });


const express = require('express')

const cors = require('cors')
require('./config/db')
require ("dotenv").config()
const router = require ("./router/userRouter");

const app = express()

app.use(express.json())
app.use(cors({origin: "*"}))  ;  
app.use('/api/v1/user',router)


const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server connected successfully on port: ${PORT}`);
})

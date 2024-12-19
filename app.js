const express =require("express")
// const  swaggerUi  "swagger-ui-express"
const cors=require("cors");
const morgan=require("morgan");
const route = require("./routes/userRoute");
const taskRoute=require("./routes/taskRoute");
const categoryRoute=require("./routes/categoryRoute");
const priorityRoute=require("./routes/priorityRoute")
// import fileUpload from "express-fileupload";
// import swaggerSpec from "./utils/docs.setup.js";
// import router from "./routers/userRoute.js";

const app = express();

app.use(express.json());

app.use(cors());
app.use(morgan("dev"))



app.get("/", (req, res)=>{
    res.json({
        message: "Welcome to taskma"
    })
});

app.use("/api/v1", route);
app.use("/api/v1",taskRoute)
app.use("/api/v1",categoryRoute)
app.use("/api/v1",priorityRoute)


// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports= app;

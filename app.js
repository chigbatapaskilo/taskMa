const express =require("express")
// const  swaggerUi  "swagger-ui-express"
const cors=require("cors");
const morgan=require("morgan")
// import fileUpload from "express-fileupload";
// import swaggerSpec from "./utils/docs.setup.js";
// import router from "./routers/userRoute.js";

const app = express();

app.use(express.json());

app.use(cors());
app.use(morgan)

app.get("/", (req, res)=>{
    res.json({
        message: "Welcome to taskma"
    })
});

// app.use("/api/v1", router);

// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports= app;

console.log("hello world");
const express = require("express")
const bodyParser = require("body-parser")
import connectToDatabase from "./config/dbconnection"
import {AppConfigData} from "./config/appconfig"
const app = express()
connectToDatabase()
// app.use('/',)

app.listen(AppConfigData.serverDetails.port,()=>{
    console.log(`Server Running on PORT ${AppConfigData.serverDetails.port}`);
    
})
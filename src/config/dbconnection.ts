import mongoose from "mongoose"

import {AppConfigData} from "../config/appconfig"
async function connectToDatabase() {
    let connectionURL:any = AppConfigData.db.connectionString
	let connection = await mongoose.connect(connectionURL);

	if (connection) {
		console.log("Database connected successfully");
	}else{
        console.log("Error in db connection");
        
    }
}


export default connectToDatabase;

import jwt from "jsonwebtoken";
import { AppConfigData } from "../config/appconfig";
import { AnyArray } from "mongoose";

export class TokenGenerationUtil{
    constructor(){

    }

   async generateToken(data:any){
        try {
              let secreteKey = AppConfigData.JWT.secretKey || "demo123";
              let tokenExpiryTime :any= AppConfigData.JWT.tokenExpiry || "1h"; // Correct format for expiresIn
              let generateToken = jwt.sign(data, secreteKey, { expiresIn: tokenExpiryTime });
              return generateToken
        } catch (error) {
            console.log("Error in Token Generation",JSON.stringify(error));
            
        }
    }
}
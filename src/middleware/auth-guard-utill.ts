import { UserModel } from "../db/models/user-model";
import {Request,Response} from "express";
import { ResponseInterceptor } from "./responce-interceptor";
import jwt from "jsonwebtoken";
import { AppConfigData } from "../config/appconfig";

export class AuthGuard extends ResponseInterceptor{
    constructor(){
        super()
    }

    async verifyToken (req:Request,res:Response,next:any){
        try {
            let checkToken :any= req.headers.authorization || req.headers.Authorization
            if (!checkToken) {
               return this.sendBadRequest(res,401,"Token not Found Unauthorized Access")
            }else{
                let secreteKey = AppConfigData.JWT.secretKey || "demo123"
               let verifyToken:any = await jwt.verify(checkToken,secreteKey);
               (req as any).logged_email =  verifyToken.email;
               (req as any).logged_user_id =  verifyToken.user_id;
              next();
            }
        } catch (error) {
            console.log("Error in verifying tokens data",error);
            
        }
    }
}
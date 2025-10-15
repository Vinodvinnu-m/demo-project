import { UserModel } from "../db/models/user-model";
import { Request,Response } from "express";
import {ResponseInterceptor} from "../middleware/responce-interceptor";
 import jwt from "jsonwebtoken";
 import bcrypt from "bcrypt";
 import { AppConfigData } from "../config/appconfig";
 import {SendMail} from "../utilities/send-email";
 import {TokenGenerationUtil} from "../utilities/generate-token"
export class UserController extends ResponseInterceptor{
    userModel : UserModel
    sendMail : SendMail;
    tokenGenUtil : TokenGenerationUtil;
    constructor(){
        super()
        this.userModel = new UserModel()
        this.sendMail = new SendMail()
        this.tokenGenUtil = new TokenGenerationUtil()
    }

   async createUser(req:Request,res:Response){
        try {
            let reqBody = req.body
          let userCreation = await this.userModel.createUser(reqBody)
            userCreation.save()
           return this.sendSuccess(res,"User Created Successfully")
        } catch (error) {
            console.log("Error in User Creation",JSON.stringify(error));
           return this.sendBadRequest(res,400,"Internal Server Error")
            
        }
    }
   async GetUsersList(req:Request,res:Response){
        try {
            
          let fetchUsersList = await this.userModel.FindAll()          
           return this.sendSuccess(res,"Users Data Fetched Successfully",fetchUsersList)
        } catch (error) {
            console.log("Error in Fetching Users Data",JSON.stringify(error));
           return this.sendBadRequest(res,400,"Internal Server Error")
            
        }
    }
   async UpdateTheUserData(req:Request,res:Response){
        try {
            let reqBody = req.body
            var id = req.params.id || "";            
            
          let updateUsersData = await this.userModel.update({_id: id},reqBody)          
           return this.sendSuccess(res,"Users Data Updated Successfully",updateUsersData)
        } catch (error) {
            console.log("Error in  Users Data Updating",JSON.stringify(error));
           return this.sendBadRequest(res,400,"Internal Server Error")
            
        }
    }
   async DeleteUser(req:Request,res:Response){
        try {
            var id = req.params.id || "";            
           let userDelete = await this.userModel.delete({_id: id});                
           return this.sendSuccess(res,"Users Deleted Successfully",userDelete)
        } catch (error) {
            console.log("Error in Users Deleted",JSON.stringify(error));
           return this.sendBadRequest(res,400,"Internal Server Error")
            
        }
    }


    async UserLogin(req:Request,res:Response){
        try {
            let reqBody = req.body         
            if (!reqBody && !reqBody.email && !reqBody.password) {
                return this.sendBadRequest(res,400,"Please enter Email and Password")
            }  
           let fetchUserByEmail = await this.userModel.findByEmail({email: reqBody.email});     
           if(!fetchUserByEmail){
            return this.sendBadRequest(res,400,"Your entered Email and password is incorrect")

           }  
           let generateToken = await this.tokenGenUtil.generateToken({email:fetchUserByEmail.email,user_id:fetchUserByEmail._id})
           let responseObj = {
            email:fetchUserByEmail.email,
            Token : generateToken
           }
           return this.sendSuccess(res,"User login Successfully",responseObj)
        } catch (error) {
            console.log("Error in Users Login",JSON.stringify(error));
           return this.sendBadRequest(res,400,"Internal Server Error")
            
        }
    }

    async resetPassword(req:Request,res:Response){
        try {
            let reqBody = req.body
            let baseUrl = AppConfigData.serverDetails.baseUrl
            let generateToken = await this.tokenGenUtil.generateToken({email:reqBody.email})
            let message = `Your forget password link is ready, Please click on below link and change your password:  
                    👉  ${baseUrl}/reset/password/${generateToken}
               `;
            let subject = 'Forget Password'
            await this.sendMail.sendEmail(reqBody.email,message,subject);
            console.log("Your Forget password link send to your gmail account");
            this.sendSuccess(res,"Your Forget password link send to your gmail account")
        } catch (error) {
            console.log("Error in reset Password",JSON.stringify(error));
            
        }
    }

    async forgetPassword(req: Request, res: Response) {
        try {
            let token: any = req.params.token;
            let secreteKey = AppConfigData.JWT.secretKey || "demo123";
            try {
                let verifyToken: any = await jwt.verify(token, secreteKey);
                let checkUserDataWithEmail: any = await this.userModel.findByEmail({ email: verifyToken.email })
                if (req.body.password == checkUserDataWithEmail.password) {
                    return this.sendBadRequest(res, 400, "User Entered Password already Used")
                }
                await this.userModel.update({_id: checkUserDataWithEmail._id },{ password: req.body.password })
                return this.sendSuccess(res, "User changed the password successfully")
            } catch (error: any) {
                let message;
                if (error.name === "TokenExpiredError") {
                    message = "Your forget Password is link is Expired"
                } else {
                    message = `Invalid Token ${error.message}`                    
                }
                return this.sendBadRequest(res, 401, message)

            }

        } catch (error) {
            console.log("Error in Forget Password", JSON.stringify(error));

            return this.sendBadRequest(res, 400, "Internal Server Error")
        }
    }

}
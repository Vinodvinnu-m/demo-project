import { Response } from "express";
export class ResponseInterceptor{
    constructor(){

    }
    sendSuccess(res:Response, message?: string, data?: any, opt?: any) {
        let responseData:any = {
          status: "success",
          data: [],
        }
        if (message && message != "") {
          responseData["message"] = message;
        };
       
        if (!data) {
          delete responseData.data;
        }
        if (data && data != "") {
          responseData["data"] = data;
        }
        
        res.status(200);
        res.send(responseData);
      }

      sendBadRequest(res:Response, code?:any,message?: string) {
        let responseData = {
          status: "fail",
          // code:code ,
          message: message || "Bad request",
        };
        // res.status(code)
        res.send(responseData);
    
      }
}
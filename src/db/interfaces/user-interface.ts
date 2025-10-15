
import { Document } from "mongoose";

export  interface IuserInterface extends Document{
    name:string,
    email:string,
    password:string,
    mobile:string,

}
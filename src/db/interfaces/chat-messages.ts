
import { Document } from "mongoose";

export  interface IvChatMessages extends Document{
    uuid:string,
    room_id:string,
    messages:string,
    password:string,

}
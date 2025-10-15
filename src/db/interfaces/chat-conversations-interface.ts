
import { Document} from "mongoose";

export  interface IvConversations extends Document{
    from:string,
    to:string,
    groupId:string,
    message:string,
    type:string,
    name:string,
    participants?: string[];
    time_stamp:Date,
    created_at:Date;
    updated_at:Date;

}
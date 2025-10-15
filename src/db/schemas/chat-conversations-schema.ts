import mongoose, { Schema } from "mongoose";
import { IvConversations } from "../interfaces/chat-conversations-interface";
let chatCOnversations = new Schema<IvConversations>({
    from: {
        type: String,
    },
    to: {
        type: String,
    },
    groupId: {
        type: String,
        
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['single', 'group'],
        required: true,
        index:true
    },
    participants: [{ type: String }],
    
    name: {
        type: String,
    },
    time_stamp: {
        type: Date,
        default: Date.now,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
})






export default mongoose.model("chat-conversations", chatCOnversations)
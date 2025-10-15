import mongoose, { Schema } from "mongoose";
import { IuserInterface } from "../interfaces/user-interface";
let userSchema = new Schema<IuserInterface>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
})


export default mongoose.model("users",userSchema)
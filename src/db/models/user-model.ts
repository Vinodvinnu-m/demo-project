import mongoose, { Schema } from "mongoose";
import userSchema from "../schemas/user-schemas";
export class UserModel {
    constructor() {
    }
    createUser(query: Object){
        let insertData = new userSchema(query)
        return insertData.save();
    }
    findOne(query: Object){
        return userSchema.findOne(query).lean()
    }

    FindAll(query: object = {},options?:{},limit?:number,page?:number) {    
        let skip = (Number(page) - 1) * Number(limit);
        return userSchema.find(query).sort(options).skip(skip).limit(Number(limit)).lean();
      }

    findByEmail(query: Object){
        return userSchema.findOne(query).lean()
    }
     update(query: object, update: object,filters?:any) {
        return userSchema.updateOne(query, update, filters);
      }

       delete(query: object) {
        return userSchema.findOneAndDelete(query);
      }

     aggregation(pipeline:any) {
        return userSchema.aggregate(pipeline);
      }
}

import mongoose, { Schema } from "mongoose";
import groupChatsSchema from "../schemas/group-chats-schema";
export class GroupChat {
    constructor() {
    }
    createGroupChat(query: Object){
        let insertData = new groupChatsSchema(query)
        return insertData.save();
    }
    findOne(query: Object){
        return groupChatsSchema.findOne(query).lean()
    }

    FindAll(query: object = {},options?:{},limit?:number,page?:number) {    
        let skip = (Number(page) - 1) * Number(limit);
        return groupChatsSchema.find(query).sort(options).skip(skip).limit(Number(limit)).lean();
      }

    findByGroupId(query: Object){
        return groupChatsSchema.findOne(query).lean()
    }
     update(query: object, update: object,filters?:any) {
        return groupChatsSchema.updateOne(query, update, filters);
      }

       delete(query: object) {
        return groupChatsSchema.findOneAndDelete(query);
      }

     aggregation(pipeline:any) {
        return groupChatsSchema.aggregate(pipeline);
      }
}

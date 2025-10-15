import ChatConversationsSchema from "../schemas/chat-conversations-schema";
export class ChatConversationModel {
    constructor() {
    }
    createChatConversations(query: Object){
        let insertData = new ChatConversationsSchema(query)
        return insertData.save();
    }
    findOne(query: Object){
        return ChatConversationsSchema.findOne(query).lean()
    }

    FindAll(query: object = {},options?:{},limit?:number,page?:number) {    
        let skip = (Number(page) - 1) * Number(limit);
        return ChatConversationsSchema.find(query).sort(options).skip(skip).limit(Number(limit)).lean();
      }

    findByEmail(query: Object){
        return ChatConversationsSchema.findOne(query).lean()
    }
     update(query: object, update: object,filters?:any) {
        return ChatConversationsSchema.updateOne(query, update, filters);
      }

       delete(query: object) {
        return ChatConversationsSchema.findOneAndDelete(query);
      }

     aggregation(pipeline:any) {
        return ChatConversationsSchema.aggregate(pipeline);
      }
}

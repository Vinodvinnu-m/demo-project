import { UserModel } from "../db/models/user-model";
import { Request, Response } from "express";
import { ResponseInterceptor } from "../middleware/responce-interceptor";
import { AppConfigData } from "../config/appconfig";
import { Server, Socket } from "socket.io";
import { ChatConversationModel } from "../db/models/chat-conversations-model";

export class SocketController {
    userModel: typeof UserModel;
    chatConversationModel: ChatConversationModel;
    private static socketIO: Server;
    private onlineUsers: { socketId: string; userId: string }[] = [];
  
    constructor(io: Server) {
      this.userModel = UserModel;
      this.chatConversationModel = new ChatConversationModel();
      SocketController.socketIO = io;
  
      io.on('connection', (socket: Socket) => {
        const userId = socket.handshake.query.userId as string;
        if (!userId) {
          socket.disconnect(true);
          return;
        }
  
        this.onlineUsers.push({ socketId: socket.id, userId });
        SocketController.socketIO.to('admin-console').emit('user-connection', this.onlineUsers.length);
        console.log(`User ${userId} connected, online users: ${this.onlineUsers}`);
  
        socket.on('chat-conversations', async (data) => {
          try {
            console.log("data----------------",data,"type======",typeof data);
            
            const message = JSON.parse(data);
            const { conversationId, content } = message;
  
            if (!conversationId || !content) {
              socket.emit('error', { error: 'Invalid message' });
              return;
            }
            console.log("conversationId",conversationId);
            
            const conversation = await this.chatConversationModel.findOne({conversationId});
            // if (!conversation || !conversation.participants.includes(userId)) {
            //   socket.emit('error', { error: 'Unauthorized or invalid conversation' });
            //   return;
            // }
            
            const newMessage = {
              name:message.name,
              conversationId,
              from:userId,
              to: message.senderId,
              type:message.type,
              message:message.content,
              time_stamp: new Date(),
              participants: [userId],
            } 
            console.log("newMessage----------------",newMessage);

            const result = await this.chatConversationModel.createChatConversations(newMessage);
            console.log("result------------",result);
            
            await this.chatConversationModel.update(
              { _id: conversationId },
              { $set: { lastMessage: result._id, updated_at: new Date() } }
            );
  
            // const broadcastMessage = {
            //   _id: result._id,
            //   conversationId,
            //   senderId: userId,
            //   content,
            //   type,
            //   createdAt: newMessage.createdAt
            // };
  
            // conversation.participants.forEach((participant: string) => {
            //   const participantSocket = this.onlineUsers.find(u => u.userId === participant);
            //   if (participantSocket) {
            //     SocketController.socketIO.to(participantSocket.socketId).emit('chat-conversations', broadcastMessage);
            //   }
            // });
          } catch (err) {
            console.error('Error processing message:', err);
            socket.emit('error', { error: 'Server error' });
          }
        });
  
        socket.on('disconnect', () => {
          this.onlineUsers = this.onlineUsers.filter(u => u.socketId !== socket.id);
          SocketController.socketIO.to('admin-console').emit('user-connection', this.onlineUsers.length);
          console.log(`User ${userId} disconnected, online users: ${this.onlineUsers.length}`);
        });
      });
  
      io.on('error', (error) => {
        console.error('Socket.IO server error:', error);
      });
    }
  }
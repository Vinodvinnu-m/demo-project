const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});
let connectedUsers = [];
// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/chatApp').then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  user_uuid: { type: String, required: true, unique: true },
  user_role: { type: String, required: true }
});

const messageSchema = new mongoose.Schema({
  conversation_uuid:{ type: String, required: true,unique:true },
  room_number: { type: String },
  senderId: { type: String, required: true },
  receiverId: { type: String,  required: true},
  groupId: { type: String}, 
  message: [
        {
          uuid: { type: String, required: true },
          sender: { type: String, required: true },
          message: { type: String, required: true },
        //   metadata: { type: Schema.Types.Mixed, default: {} },
          is_delivered: { type: Boolean, default: false },
        //   is_read: { type: Boolean, default: false },
        //   is_starred: { type: Boolean, default: false },
        //   is_deleted: { type: Boolean, default: false },
        //   delivered_at: { type: Date },
        //   read_at: { type: Date },
        //   deleted_at: { type: Date },
          created_at: { type: Date, default: Date.now },
          updated_at: { type: Date, default: Date.now },
        },
      ],
      message_type:{
        type: String,
        enum: ['single', 'group'],
        required: true
          },
  timestamp: { type: Date, default: Date.now },
});


const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);
// const Group = mongoose.model('Group', groupSchema);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username ,user_role,user_uuid} = req.body;   
    req.body["user_uuid"] = uuidv4() 
    console.log("user_uuid==========", req.body);
    
    // req.body["user_uuid"] = username + '-' + Math.random().toString(36).substr(2, 9);
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get('/api/users', async (req, res) => {
  try {
   
    const fetchUsers = await  User.find();
    console.log("fetchUsers=======",fetchUsers);
    
    res.status(201).json(fetchUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// app.post('/api/groups', async (req, res) => {
//   try {
//     const { name, memberIds } = req.body;
//     const group = new Group({ name, members: memberIds });
//     await group.save();
//     res.status(201).json(group);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their own room (for single chat)
  socket.on('login', async (data) => {
  try {
    console.log("data==========",data);
    
    // Validate input data
    if (!data.user_uuid || !data.user_role) {
      console.error('Invalid login data:', data);
      return;
    }

    // Remove any existing entries for this user_uuid to prevent duplicates
    connectedUsers = connectedUsers.filter(user => user.user_uuid !== data.user_uuid);

    // Add the current user to connectedUsers
    connectedUsers.push({
      id: socket.id,
      user_uuid: data.user_uuid,
      user_role: data.user_role
    });

    // Optionally fetch user from MongoDB to verify or enrich data
    const user = await User.findOne({ user_uuid: data.user_uuid }).lean();
    if (!user) {
      console.error(`User with user_uuid ${data.user_uuid} not found in database`);
      return;
    }

    // Emit the updated online users list to all clients
    io.emit('online', connectedUsers);

    // Log the connection
    console.log(`USER UUID: ${data.user_uuid} | USER ROLE: ${data.user_role} connected`);
  } catch (error) {
    console.error('Error in login handler:', error);
  }
});
  // Handle single chat message
  socket.on('sendMessage', async ({ senderId, receiverId, content,message_type }) => {
    try {
      console.log("senderId-----------",senderId,"receiverId=======",receiverId,"content-------",content,"message_type00000000000",message_type);
      
    const recipients = connectedUsers.filter(user => user.user_uuid === senderId);
      console.log("recipients-");
      
         for (const recipient of recipients) {
        /** build payload */
        var payload = {
          from        : senderId,
          to          : recipient.id,
          user_uuid   : userUuid,
          coach_uuid  : coachUuid,
          sender      : sender,
          message     : message
        }
        /** send message */
        this.socketIo.to(recipient.id).emit("sendMessage", payload);
      }
        /** find the collection of specific conversation between customer & coach */
        var conversation = await Message.find({ senderId: senderId, receiverId: receiverId});
        var message1 = {
       uuid          : uuid(),
       sender        : mData?.sender || "",
       message       : mData?.message || "",
       is_delivered  : mData?.is_delivered || 0,
       created_at    : mData?.created_at || this.common.utcDatetime(),
       updated_at    : mData?.updated_at || null,
     };
      if (conversation.length<0) {
        /** create a new conversation */
        Message.create({
          conversation_uuid     : uuid(),
          room_number           : uuid(),
          senderId             : senderId,
          receiverId            : receiverId,
          messages              : [message1],
          message_type          :message_type,
          created_at            : this.common.utcDatetime(),
          updated_at            : null
        });
        /** assume all okay */
        return true;
      }

      /** save the message to the messages array */
      Message.update(
        { conversation_uuid: conversation.conversation_uuid },
        {
          $push: {
            messages: message,
          },
          $set: {
            updated_at: this.common.utcDatetime(),
          }
        }
      );

      // Emit to receiver
      io.to(receiverId).emit('receiveMessage', {
        _id: message._id,
        senderId,
        receiverId,
        content,
        timestamp: message.timestamp,
      });

      // Emit back to sender for confirmation
      socket.emit('receiveMessage', {
        _id: message._id,
        senderId,
        receiverId,
        content,
        timestamp: message.timestamp,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle group chat message
  // socket.on('sendGroupMessage', async ({ senderId, groupId, content }) => {
  //   try {
  //     const message = new Message({
  //       senderId,
  //       groupId,
  //       content,
  //     });
  //     await message.save();

  //     // Emit to all group members
  //     io.to(groupId).emit('receiveGroupMessage', {
  //       _id: message._id,
  //       senderId,
  //       groupId,
  //       content,
  //       timestamp: message.timestamp,
  //     });
  //   } catch (error) {
  //     console.error('Error saving group message:', error);
  //   }
  // });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
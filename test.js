let array = [1,2,3,4,5,6,1,23,4,5,5]
let totalArray = []
for(let i=0; i<array.length; i++){
    if(!totalArray.includes(array[i])){
    totalArray.push(array[i])
    }
}
console.log("totalArray=======",totalArray);


const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express()
app.use(bodyParser.json())
let port = 8080

mongoose.connect('mongodb://localhost:27017/TestProject').then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

    let userSchema = new mongoose.Schema({
         name: {
        type: String,
        required: true
    },
         email: {
        type: String,
        required: true
    },
         mobile: {
        type: String,
        required: true
    },
         password: {
        type: String,
        required: true
    }
    })
    
let usersModel = mongoose.model('users',userSchema)

    let ordersSchema = new mongoose.Schema({
         product: {
        type: String,
        required: true
    },
         userId: {
        type: String,
        required: true
    }
    })

let  ordersModel = mongoose.model('orders',ordersSchema)

  app.post('/data',(req,res)=>{
    try {
        let {name,email,mobile,password} = req.body
        let createUsers = usersModel.create(req.body)
        res.status(200).json({message:"User created successfully",data:req.body})

    } catch (error) {
        res.status(400).json({message:"Error in User creation",data:null})
    }
  })
  app.post('/products',(req,res)=>{
    try {
        let {product,userId,} = req.body
        let createOrders = ordersModel.create(req.body)
        res.status(200).json({message:"orders created successfully",data:req.body})

    } catch (error) {
        res.status(400).json({message:"Error in Product creation",data:null})
    }
  })

app.get('/getproduct', (req, res) => {
  ordersModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo"
      }
    },
    { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } }
,
    {
      $group: {
        _id: "$product",
        uniqueUsers: { $addToSet: "$userInfo.name" },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        product: "$_id",
        _id: 0,
        userCount: { $size: "$uniqueUsers" },
        uniqueUsers: 1,
        totalPurchases: "$count"
      }
    }
  ])
  .then(userOrders => {
    console.log("products", userOrders);
    res.status(200).json({ message: "user orders fetched successfully", data: userOrders });
  })
  .catch(err => {
    console.error("Error:", err);
    res.status(400).json({ message: "Error in user orders data fetching", data: null });
  });
});

  app.listen(port,()=>{
    console.log(`Server Running on PORT:${port}`)
  })
// if(connection){
    
// }else{
    
// }


let userData = { Janvi: { age: 13, schollName: "abc" }, Abhi: { age: 14, schollName: "abc" }, Anji: { age: 10, schollName: "abc" } }
//   [ { age: 13, schollName: 'abc', name: 'Janvi' }, { age: 14, schollName: 'abc', name: 'Abhi' }, { age: 10, schollName: 'abc', name: 'Anji' } ];

let temp =Object.keys(userData);
let result = temp.map(key => ({  
    name: key,
    ...userData[key]
}));

console.log("dataValidation",result);

const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const {Server} = require("socket.io")

const {User} = require("./models/userModel")
const {Message} = require("./models/messageModel")
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"*",// React uygulamanın çalıştığı adres
        methods:["GET","POST","DELETE"]
    }
})


function databaseConnection (){
    mongoose.connect("mongodb://localhost:27017/whatsapp").then(() => console.log("DB connected")).catch((err) => console.log("ERROR DB:",err))
}

databaseConnection()

app.use(express.json())
app.use(cors())

app.get("/login",async(req,res) => {
    const {email,password} = req.headers 

    // console.log("Email::",email+"Password::",password);

    try{
        const user = await User.findOne({email,password})
        if(user === null ){
            res.status(404).json({message:"user not found"})
        }else{
            const token = jwt.sign({ userId: user._id }, 'helloWold', {
                expiresIn: '7d',
            });
            res.status(201).json({message:"succes",token:token,userId:user._id})

        }
        
    }catch(err) {
        console.log("Kullanıcı auth işleminde bri hata ile karşılaşıldı");
        res.status(404).json({error:err})
    }
})


app.post("/signup" ,async (req,res) => {
    // console.log(req.body);
    const {nameSurname,email,password} = req.body.data
    
    const newUser = User({nameSurname,email,password})
    await newUser.save()

    res.status(201).json({message:"succes"})
})


app.get("/message", async (req,res) => {
    const getUserId = req.headers.getuserid
    const decoded = jwt.decode(req.headers.token,"helloWorld") 
    const sendUserId = decoded.userId
    
    const getAllMessage = await Message.find({$or:[{getUserId:getUserId,sendUserId:sendUserId},{getUserId:sendUserId,sendUserId:getUserId}]}).sort({createAp:1})
    
    res.status(201).json({allMessage:getAllMessage})

})

app.get("/userList",async (req,res) => {
    
    const decoded = jwt.decode(req.headers.token,"helloWorld")
    
    // *************Tüm kullanıcıların alınması ve listelenmesi işlem*************** //
    try{
        // select ile sadece isim bilgisi çekiliyor . 
        let userList = await User.find().select("nameSurname")
        userList = userList.filter((item) => {return item._id != decoded.userId} )
        res.status(201).json({userList:userList})
        

    }catch(err){
        res.status(404).json(err)
    }

})

io.on("connection", (socket) => {
    console.log("Yeni bir kullanıcı bağlandı.",socket.id);
    
    socket.on("sendMessage" ,async (messageData) => {
        // Kullanıcı mesaj gönderdiği zaman sunucunun mesajı kaydetme ve kullnıcılara göndermesi işlemi.
        const decoded = jwt.decode(messageData.token,"helloWorld")
        
        const newMessage = new Message({text:messageData.text,sendUserId:decoded.userId,getUserId:messageData.getUserId})
        await newMessage.save()  
        // Diğer kullanıcılara mesaj bilgisini gönderme işlemi.
        io.emit("receiveMessage",newMessage)
    })

    socket.on("disconnect" , () =>{
        console.log("Bir kullanıcı ayrıldı.",socket.id);
        
    })

})

app.get("/",(req,res) => {
    res.send("Hello World")
})

server.listen(3000,() => {
    console.log(`Server listen 3000`);
    
})
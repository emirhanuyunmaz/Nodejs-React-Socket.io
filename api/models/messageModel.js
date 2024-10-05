const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageModel = new Schema({
    sendUserId:{
        type:String
    },
    getUserId:{
        type:String
    },
    text:{
        type:String
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})

const Message = mongoose.model("Message",messageModel)

module.exports = {Message}

const jwt = require("jsonwebtoken")
const {User} = require("../models/userModel")

const auth = async (req,res,next) =>{
    

    next()
}

module.exports = {auth}
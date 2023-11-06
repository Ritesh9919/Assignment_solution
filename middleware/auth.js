const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../error/custom_error');
const User = require('../models/User');

const auth = async(req, res, next)=> {

   const token = req.headers['authorization'];
   if(!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({message:'Unauthorized'});
   }
   try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    req.user = user;
    next();
   } catch (error) {
     next(error);
   }
}


module.exports = auth;
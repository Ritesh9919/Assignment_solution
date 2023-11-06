const jwt = require('jsonwebtoken');


const createJwtToken = (user)=> {
   const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:'1h'});
   return token;
}

const createJwtRefreshToken = (user)=> {
    const refreshToken =  jwt.sign({userId:user._id}, process.env.JWT_SECRET);
    return refreshToken;
 }


 
 



module.exports = {
    createJwtToken,
    createJwtRefreshToken
}
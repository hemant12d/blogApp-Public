// Load Environmental Variable
require("dotenv").config();

const baseError = require('../utils/baseError');
const httpStatusCodes = require('../utils/httpStatusCodes');
const responseMessages = require('../utils/responseMessages');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsyncError = require("../utils/catchAsyncError");

// Model
const User = require('../http/Models/User')

const authenticator = catchAsyncError(async (req, res, next)=>{
    let jwtToken;

    // check if headers has authorization
    if(
        req.headers.authorization 
        && req.headers.authorization.startsWith('Bearer')
    ){
        jwtToken = req.headers.authorization.split(' ')[1];
    }


    // check if jwt is exists or not
    if(!jwtToken){
        return next(new baseError(responseMessages.USER_NOT_LOGIN, httpStatusCodes.BAD_REQUEST))
    }


    // Varification of Token
    const decodeToken = await promisify(jwt.verify)(jwtToken, process.env.JWT_SECRET_KEY);
    
    // => decodeToken output be like { id: '61dd5e3153da306f8995f052', iat: 1641905933, exp: 1649681933 }

    // "iat" stands for => issued at 
    // "iat" & exp contains time in seconds not in miliseconds


    // Ensure that token user still active
    const freshUser = await User.findById(decodeToken.id);

    if (!freshUser) return next(new baseError(responseMessages.TOKEN_USER_NOT_EXISTS, httpStatusCodes.BAD_REQUEST));


    // Ensure that user token is exists & user is login in device with token
    if(freshUser.tokens.length < 1 || !(freshUser.tokens.includes(jwtToken))){
        return next(new baseError(responseMessages.UNAUTHORIZED, httpStatusCodes.UNAUTHORIZED))
    }


    // Attech user to request 
    req.user = freshUser;

    // Access granted
    return next();
});

module.exports = authenticator;
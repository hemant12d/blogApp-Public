require("dotenv").config();
const User = require("../Models/User");
const catchAsyncError = require("../../utils/catchAsyncError");
const httpStatusCodes = require("../../utils/httpStatusCodes");
const baseError = require("../../utils/baseError");
const responseMessages = require("../../utils/responseMessages");
const create_Save_And_Send_Token = require("../../utils/create_Save_And_Send_Token");


const authController = {
  signUp: catchAsyncError(async (req, res, next) => {
    const { fullName, userName, email, profile, password } = req.body;

    const newUser = {
      fullName,
      userName,
      email,
      profile,
      password,
    };

    if(req.body.role){
      newUser.role = req.body.role;
    }
    // Save the user to database
    const saveUser = await User.create(newUser);
    create_Save_And_Send_Token(saveUser, res); 
     
  }),

  login: catchAsyncError(async (req, res, next)=>{

      // Input validation
      const {email_userName, password} = req.body;

      if(!email_userName)
      return next(new baseError(responseMessages.EMAIL_USERNAME_EMPTY, httpStatusCodes.BAD_REQUEST, "email_userName"))

      if(!password)
      return next(new baseError(responseMessages.PASSWORD_EMPTY, httpStatusCodes.BAD_REQUEST, "password"))


      // Find user with email or userName
      const loginUser = await User.findOne(
        { $or: [ {userName: email_userName}, {email: email_userName} ] }
      )


      // Check user existance
      if(!loginUser)
      return next(new baseError(responseMessages.EMAIL_USER_NOT_EXISTS, httpStatusCodes.BAD_REQUEST, "email_userName"));
      
      // Match the password
      if(!(await loginUser.matchPassword(password, loginUser.password)))
        return next(new baseError(responseMessages.PASSWORD_NOT_MATCHED, httpStatusCodes.UNAUTHORIZED, "password"));

        
      // Generate the authentication token & send
      create_Save_And_Send_Token(loginUser, res);

      // Login Done
  }),

  forgetPassword: catchAsyncError(async (req, res, next)=>{

    // Get email or user

    // Input validation
    const {email_userName} = req.body;

    if(!email_userName)
      return next(new baseError(responseMessages.EMAIL_USERNAME_EMPTY, httpStatusCodes.BAD_REQUEST, "email_userName"))

    // Find user with email or userName
    const loginUser = await User.findOne(
      { $or: [ {userName: email_userName}, {email: email_userName} ] }
    )

    // Check user existance
    if(!loginUser)
    return next(new baseError(responseMessages.EMAIL_USER_NOT_EXISTS, httpStatusCodes.BAD_REQUEST, "email_userName"));

    // Generate Reset Token
    const resetToken = loginUser.createPasswordResetToken();


    // send token via email
    console.log("Reset token ", resetToken)
    // Send token to the client

    return res.send("Password reset link send to client");
  }) 
  
};

module.exports = authController;

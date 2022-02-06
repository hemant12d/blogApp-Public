require('dotenv').config();
const baseError = require("../../utils/baseError");
const formatValidateErrors = require("../../utils/formatValidateErrors");
const responseMessages = require("../../utils/responseMessages.js");
const httpStatusCodes = require("../../utils/httpStatusCodes");


const developmentError = (error, res)=>{
      console.log("_____________ Development Environment Error _________________")
      console.log("ERROR STACK 🦀🦀", error.stack)
      console.log("ERROR MESSAGE 🦀🦀", error.message)
      console.log("ERROR 🦀🦀", error)
      console.log("ALL ERRORS 🦀🦀", error.errors)
      
    return res.status(error.statusCode).json({
        errorMsg: error.message,
        errorStack: error.stack,
        error: error,
        mode: "Development"
    });
}

const emailDuplicate = error =>{
  return new baseError(`${responseMessages.DUPLICATE_EMAIL} ${error.keyValue.email}`, httpStatusCodes.CONFLICT, "email");
}

const userNameDuplicate = error =>{
  return new baseError(`${responseMessages.DUPLICATE_USERNAME} ${error.keyValue.userName}`, httpStatusCodes.CONFLICT, "user");
}
const categoryDuplicate = error =>{
  return new baseError(`${responseMessages.DUPLICATE_CATEGORY} ${error.keyValue.name}`, httpStatusCodes.CONFLICT);
}

const jwtTokenError = error =>{
  return new baseError(responseMessages.INVALID_TOKEN, httpStatusCodes.BAD_REQUEST, "unauthorized");
}

const validationError = error =>{

    let validateError = {};
  
    const formatedErrors = formatValidateErrors(error)

    validateError.message = formatedErrors;
    validateError.isOperational = true;
    validateError.statusCode = httpStatusCodes.BAD_REQUEST;

    return validateError;
}

const inputParseError = error =>{
  return new baseError(error.message, httpStatusCodes.UNPROCESSABLE);;
}

const objectIdError = error =>{
  return new baseError(responseMessages.MONGO_ID_ERROR, httpStatusCodes.UNPROCESSABLE)
}

const productionError = (error, res)=>{
  if(error.isOperational === true)
    return res.status(error.statusCode).json(error.message);
  
  // Not defined (handled) error 
  else{
    console.log("Not defined Error")
    console.log("ERROR STACK 🐱‍🐉🐱‍🐉 ", error.stack)
    console.log("ERROR MESSAGE 🐱‍🐉🐱‍🐉", error.message)
    console.log("ERROR 🐱‍🐉🐱‍🐉", error)
    console.log("ALL ERRORS 🐱‍🐉🐱‍🐉", error.errors)
    return res.status(httpStatusCodes.SERVICE_ERROR).json({message: responseMessages.UNHANDLED_ERROR});
  }
  
}

const globalErrorHandling = (error, req, res, next) => {
  let newError = error;
  newError.statusCode = error.statusCode || httpStatusCodes.INTERNAL_SERVER;

  // Error for development environment
  if(process.env.APP_ENV === 'development') {

    error.statusCode = httpStatusCodes.DEV_ERROR;
    developmentError(error, res);
  }

 
  // Error for production environment
  else if(process.env.APP_ENV === 'production') {

      // Error code for duplicate entry
      if (error.code === 11000) {

        // Email conflict(duplicate) Error
        if(error.keyValue.email)
          newError = emailDuplicate(error); 

        // Username conflict(duplicate) Error
        else if(error.keyValue.userName)    
          newError = userNameDuplicate(error); 

        else if(error.keyValue.name)
          newError = categoryDuplicate(error); 
          
        else if(error.keyValue.name)
          newError = categoryDuplicate(error); 
          
      }

      // Input validation error
      else if(error.name === 'ValidationError')
        newError = validationError(error);        
      
      // Api syntax error
      else if(error.expose)
        newError = inputParseError(error);
      
      // Json web token
      else if(error.name === "JsonWebTokenError")
        newError = jwtTokenError(error);

      else if(error.name === "CastError" && error.kind === "ObjectId")
        newError = objectIdError(error)  

      productionError(newError, res);
      
  }
 

}

module.exports = globalErrorHandling;

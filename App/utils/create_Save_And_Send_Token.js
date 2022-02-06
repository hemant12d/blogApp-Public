require("dotenv").config();
const jwt = require('jsonwebtoken');
const httpStatusCodes = require("./httpStatusCodes");

const create_Save_And_Send_Token = async (user, res) =>{

    // Create token 
    const jwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN});

    // Save token to the database
    user.tokens.push(jwtToken);    
    await user.save();

    // Send response to the client
    return res.status(httpStatusCodes.ACCEPTED).json(
        {
        user: user,
        token: jwtToken
        }
    );
}

module.exports = create_Save_And_Send_Token;
const defaultConfig = require('../../config/constants');
const baseError = require('../utils/baseError');
const httpStatusCodes = require('../utils/httpStatusCodes');
const responseMessages = require('../utils/responseMessages');

const accessController = (roles) =>{

    return (req, res, next) =>{

        if(!roles.includes(req.user.role)){
            return next(new baseError(responseMessages.UNAUTHORIZED, httpStatusCodes.UNAUTHORIZED));
        }
        
        next();
    }

}

module.exports = accessController;

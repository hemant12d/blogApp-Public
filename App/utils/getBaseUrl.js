require('dotenv');

const getBaseUrl = ()=>{    
    return `${process.env.ACTIVE_PROTOCOL}://${process.env.APP_IP}:${process.env.APP_PORT}`
}

module.exports = getBaseUrl;
const defaultConfig = require('../../config/constants')
const fileFormatValidate = (file) => {
    const type = file.mimetype.split("/").pop();
    const validTypes = defaultConfig.imageSupported;
    if (validTypes.indexOf(type) === -1) {
      return false;
    }
    return true;
}

module.exports = fileFormatValidate
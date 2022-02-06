const imageFunctionality = {
    getImageExtension:  mimetype => '.'+mimetype.split('/').pop()

}

module.exports = imageFunctionality;
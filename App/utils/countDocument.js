const countDocument = async Model => {
    return await Model.find().count();
}

module.exports = countDocument;
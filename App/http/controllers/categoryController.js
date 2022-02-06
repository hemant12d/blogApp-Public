const Category = require("../Models/Category");
const catchAsyncError = require("../../utils/catchAsyncError");
const httpStatusCodes = require("../../utils/httpStatusCodes");
const baseError = require("../../utils/baseError");
const responseMessages = require("../../utils/responseMessages");
const countDocument = require("../../utils/countDocument");


const catgoryController = {

    create: catchAsyncError(async function(req, res, next){     
         

        // Create category
        const category = await Category.create(req.body);
        return res.status(httpStatusCodes.CREATED).json(category);

    }),

    getAll: catchAsyncError(async function(req, res, next){

        

     
        let docs = await Category.find();
        let count = await countDocument(Category);


        return res.status(httpStatusCodes.ACCEPTED).json({
            count,
            results: docs
        });

    }),

    getOne: catchAsyncError(async function(req, res, next){
        let doc = await Category.findById(req.params.id);
        if(!doc) return next(new baseError(responseMessages.NOT_FOUND, httpStatusCodes.NOT_FOUND))
        return res.status(httpStatusCodes.ACCEPTED).json(doc);
    }),

    updateOne: catchAsyncError(async function(req, res, next){
        // Update Blog
        let updateDoc = await Category.findByIdAndUpdate(req.params.id, req.body);
        return res.status(httpStatusCodes.ACCEPTED).send(updateDoc);      
    }),

    deleteOne: catchAsyncError(async function(req, res, next){
        await Category.findByIdAndDelete(req.params.id);
        return res.status(httpStatusCodes.NO_CONTENT).json();
    })

}

module.exports = catgoryController;
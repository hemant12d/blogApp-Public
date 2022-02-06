// Load Envirmental Variable

require("dotenv").config();

// Core Modoule
const fs = require('fs');
const path = require('path');

const BlogPost = require("../Models/BlogPost");
const catchAsyncError = require("../../utils/catchAsyncError");
const httpStatusCodes = require("../../utils/httpStatusCodes");
const baseError = require("../../utils/baseError");
const responseMessages = require("../../utils/responseMessages");
const imageFunctionality = require("../../utils/imageFunctionality");
const defaultConfig = require("../../../config/constants");
const appConfig = require("../../../config/appConfig");
const isFileValid = require('../../utils/fileFormatValidate');
const countDocument = require("../../utils/countDocument");
const ApiFeatures = require("../../utils/apiFeatures");
const getBaseUrl = require("../../utils/getBaseUrl");
const pageHandler = require("../../utils/pageHandler");


const blogPostController = {

    create: catchAsyncError(async function(req, res, next){  

        const cover = req.files.cover;

        // Check if cover image is empty or not
        if(!cover) return next(new baseError(responseMessages.COVER_IMAGE_REQUIRED, httpStatusCodes.BAD_REQUEST));

        // Validate the file
        if(!isFileValid(cover)) return next(new baseError(responseMessages.IMAGE_NOT_SUPPORTED, httpStatusCodes.UNPROCESSABLE));

        const imgExtension = imageFunctionality.getImageExtension(cover.mimetype);

        const uploadFolder = defaultConfig.blogPostImagePath + `/${cover.md5}`+imgExtension;


        // console.log(uploadFolder)
        // Output be like => D:\Sr_deveops_workspace\blogApp\uploads\blogposts\a13b4390b3172936daf25824a63d206b.jpeg
 

        req.body.cover = uploadFolder;    
        req.body.author = req.user._id;           

        // Create Blog
        const blogPost = await BlogPost.create(req.body);

        // Move file to the folder
        await cover.mv(uploadFolder);

        return res.status(httpStatusCodes.CREATED).json(blogPost);
    }),

    getAll: catchAsyncError(async function(req, res, next){

        if(!req.query.page)
            req.query.page = 1;
    
        if(!req.query.limit)
            req.query.limit = appConfig.DOC_LIMIT;

        let page = req.query.page * 1
        let limit = req.query.limit * 1

        let previous = null, nextUrl = null;

        let apiFeatures = new ApiFeatures(BlogPost.find(), req.query).filter().search(["title"]).fields().sort().paginate();


        let docs = await apiFeatures.chainQuery;

        console.log(docs)
        let count = await countDocument(BlogPost);

        // if (page > 1) then show previous url
        if(page > 1)
            previous = getBaseUrl()+pageHandler(req.originalUrl, page, 0);
               

        // if there are more records then show next url
        if((limit * page) < count)
            nextUrl = getBaseUrl()+pageHandler(req.originalUrl, page, 1);
    

        return res.status(httpStatusCodes.ACCEPTED).json({
            previous,
            next: nextUrl,
            count,
            document: docs
        });

    }),

    getOne: catchAsyncError(async function(req, res, next){
        let doc = await BlogPost.findById(req.params.id);
        
        if(!doc) return next(new baseError(responseMessages.NOT_FOUND, httpStatusCodes.NOT_FOUND))
       
        // Increment the review
        doc.incrementReview();
        await doc.save();

        return res.status(httpStatusCodes.ACCEPTED).json(doc);
    }),

    updateOne: catchAsyncError(async function(req, res, next){

        const blog = await BlogPost.findById(req.params.id);

        if(!blog)
        return next(new baseError(responseMessages.NOT_FOUND, httpStatusCodes.NOT_FOUND))

        let doc;
        const cover = req.files.cover;

        // Check if cover image is empty or not
        if(!cover) {
            doc = await BlogPost.findByIdAndUpdate(req.params.id, req.body);
            return res.status(httpStatusCodes.ACCEPTED).send(doc);
        }

        // Update cover image process

        // Validate the file
        if(!isFileValid(cover)) return next(new baseError(responseMessages.IMAGE_NOT_SUPPORTED, httpStatusCodes.UNPROCESSABLE));

        const imgExtension = imageFunctionality.getImageExtension(cover.mimetype); 

        const uploadFolder = path.join(defaultConfig.blogPostImagePath) + `//${cover.md5}`+imgExtension;

        // Update path to database
        req.body.cover = uploadFolder;


        // Remove old file ( type of image file )      
        const oldImagePath = "./"+blog.cover;
        fs.unlink(oldImagePath, async function(err) {
            if(err && err.code == 'ENOENT') {
                return next(new baseError("File not found !", httpStatusCodes.NOT_FOUND));
            } else if (err) {
                // other errors, e.g. maybe we don't have enough permission
                return next(new baseError("Can't delete file right now", httpStatusCodes.SERVICE_ERROR));
            }           
            else{                     
                // save file to server
                await cover.mv(uploadFolder);
    
                // Update Blog
                doc = await BlogPost.findByIdAndUpdate(req.params.id, req.body);
                return res.status(httpStatusCodes.ACCEPTED).send(doc);
            }
 
        });
 
    }),

    deleteOne: catchAsyncError(async function(req, res, next){
        await BlogPost.findByIdAndUpdate(req.params.id, {isDeleted: true});
        return res.status(httpStatusCodes.NO_CONTENT).json();
    }),

    
}

module.exports = blogPostController


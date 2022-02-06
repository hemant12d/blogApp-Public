const mongoose = require( "mongoose" );
const { Schema } = mongoose;

const blogPostSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Blog post must have a title"],
            maxLength: [150, "Title can't be greater than 150 characters"],
        },
        cover: {
            type: String,
            required: [true, "Blog post must have a cover image"]
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, "Blog post must be belong to a user"]
        },
        shortDescription: {
            type: String,
            required: [true, "Blog post must have a description"],
            maxLength: [150, "Short description can't be greater than 150 characters"],
        },
        htmlContent: {
            type: String,
            required: [true, "Blog must have a html content"],
        },
        views:{
            type: Number,
            default: 50
        },
        // The ref option is what tells Mongoose which model to use during population
        // ObjectId, Number, String, and Buffer are valid for use as refs.
        category:{
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, "Blog post must be belong to a category"]
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isActive:{
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

// Pre Query Middleware for populate the category


// Find active blog only
blogPostSchema.pre(/^find/, function(next){
    this.find({isActive: true})
    next();
});


blogPostSchema.pre(/^find/, function(next){
    this.populate({path: 'category', model: 'Category', select: 'name -_id'}).populate({path: 'author', select: 'fullName -_id'});
    next();
});


blogPostSchema.methods.incrementReview = function(){
    this.views = this.views + 1;
}


// Remove the internal mongoose & other things
blogPostSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.isDeleted;
    delete obj.isActive;
    delete obj.updatedAt;
    return obj;
}


// Compile blog schema
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;

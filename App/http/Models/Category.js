const mongoose = require("mongoose");
const { Schema } = mongoose;
const defaultConfig = require('../../../config/constants');

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Category field is required"],
        unique: [true, "Catogory name is already exists"],
        maxLength: [20, "Title can't be greater than 20 characters"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{
  timestamps: true,
});


// Compile the category Schema
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
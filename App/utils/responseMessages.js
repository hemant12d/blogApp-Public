const responseMessages = {   
    
    UNAUTHORIZED: "You are not authorized for this",

    COVER_IMAGE_REQUIRED: "Cover image is required",

    IMAGE_NOT_SUPPORTED: "Image is not supported",

    EMAIL_USERNAME_EMPTY: "email_username field can't be empty",

    PASSWORD_EMPTY: "password field can't be empty",

    EMAIL_USER_NOT_EXISTS: "Email or username not exists",

    PASSWORD_NOT_MATCHED: "Password not match",

    UNHANDLED_ERROR: "Something went very very wrong !",

    DUPLICATE_EMAIL: "Duplicate entry for email",

    DUPLICATE_USERNAME: "Duplicate entry for username",

    INVALID_TOKEN: "Invalid token",

    USER_NOT_LOGIN: "User is not logged in, please login to continue",

    TOKEN_USER_NOT_EXISTS: "User belonging to this token, no longar exists",

    NOT_FOUND: "Document not found !",

    MONGO_ID_ERROR: "Details not found",

    DUPLICATE_CATEGORY: "Category already exists"

}

module.exports = responseMessages;
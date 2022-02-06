const appConfig = {
    userRoles: ["admin", "user"],
    accessWrite: ["admin"],
    accessRead: ["admin"],
    accessRemove: ["admin"],
    fileSize: 50 * 1024 * 1024,
    imageSupported: ["jpg", "jpeg", "png"],
    blogPostImagePath: `uploads/blogposts`,
    DOC_LIMIT: 10,
    PREFIX: "api/v1/"
};

module.exports = appConfig;
  
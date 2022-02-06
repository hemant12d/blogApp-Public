
// Default configuations applied to all environments
const defaultConfig = {
    userRoles: ["admin", "user"],
    accessWrite: ["admin"],
    accessRead: ["admin"],
    accessRemove: ["admin"],
    fileSize: 50 * 1024 * 1024,
    imageSupported: ["jpg", "jpeg", "png"],
    blogPostImagePath: `uploads/blogposts`,
    pageLimit: 8,
    PREFIX: "api/v1/"
};

module.exports = defaultConfig;
  
// Load Environmental Variable
require("dotenv").config();
const path = require('path');
const express = require("express");
const App = express();
const appConfig = require("./config/appConfig.js");

const fileUpload = require("express-fileupload");

// Make connection to the database 
const DB = require("./DB"); DB();

const getBaseUrl = require("./App/utils/getBaseUrl")

// Middleware
const globalErrorHandling = require("./App/http/controllers/errorController");


// Middleware to data from Apis
App.use(express.json());
App.use(express.urlencoded({ extended: false }));

App.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    preserveExtension: true,
    safeFileNames: true,
    parseNested: true,
    abortOnLimit: true,
  })
);

// Application routes
const userRoute = require("./routes/user");
const blogpostRoute = require("./routes/blogpost");
const categoryRoute = require("./routes/category");

// Mouting routes
App.use(`/${appConfig.PREFIX}users`, userRoute);
App.use(`/${appConfig.PREFIX}blog-post`, blogpostRoute);
App.use(`/${appConfig.PREFIX}category`, categoryRoute);

App.post("/home/v1", (req, res) => {
  return res.send("Hello from home");
});


// Application global error handling middleware that handles all the errors
App.use(globalErrorHandling)

// Enable files
App.use('/uploads', express.static(`${__dirname}/uploads`));

// Unhandled Route
App.get("*", (req, res)=>{
  return res.send("Route is not found");
});

  
// Server listing on local host
App.listen(process.env.APP_PORT * 1,  () => {
  console.log("Server is listing on port 8000 at local host: ", "http://127.0.0.1:8000/");
  console.log("Server is also listening on network ip : " + getBaseUrl());
});



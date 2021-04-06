var express = require("express");
var path = require("path");
var fs = require("fs");
var fileUpload = require("express-fileupload");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const db = require("./models/database"); // TODO: remove?
db.sequelize.sync({ force: true }); // TODO: REMOVE

var indexRouter = require("./routes/index");

var app = express();

app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// TODO: make async?
try {
  fs.mkdirSync(`${__dirname}/sessions`);
} catch (error) {
  if (error.code == "EEXIST") {
    console.log("Session folder exists.");
  } else {
    console.log(error);
  }
}

app.use("/", indexRouter);

module.exports = app;

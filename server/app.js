var express = require("express");
var path = require("path");
var fs = require("fs");
var fileUpload = require("express-fileupload");
var session = require("express-session");
var SequelizeStore = require("connect-session-sequelize")(session.Store);
var cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const db = require("./models/database"); // TODO: remove?

(async () => {
  await db.sequelize.sync({ force: true }); // TODO: REMOVE; ALSO, THIS RETURNS A PROMISE
})();

var indexRouter = require("./routes/index");
var monitoringRouter = require("./routes/monitoring");
var authRouter = require("./routes/auth");
var quizRouter = require("./routes/quiz");

var authController = require("./controllers/authcontroller");

var app = express();

app.use(
  cors({
    origin: "https://online.ase.ro",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var dbStore = new SequelizeStore({
  db: db.sequelize,
  modelKey: "connections",
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: dbStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
dbStore.sync();

app.use(express.static(path.join(__dirname, "public")));

app.use(authController.passport.initialize());
app.use(authController.passport.session());

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
app.use("/monitoring", monitoringRouter);
app.use("/auth", authRouter);
app.use("/quiz", quizRouter);

module.exports = app;

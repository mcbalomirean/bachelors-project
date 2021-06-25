const { Sequelize } = require("sequelize");

const db = {};

const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
const options = {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mariadb",
};
db.sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, options);

db.Quiz = require("./quiz")(db.sequelize, Sequelize);
db.Session = require("./session")(db.sequelize, Sequelize, db.Quiz, db.Student);
db.FlaggedData = require("./flagged_data")(db.sequelize, Sequelize);
db.Proctor = require("./proctor")(db.sequelize, Sequelize);

db.Quiz.hasMany(db.Session);
db.Session.belongsTo(db.Quiz);

db.Session.hasMany(db.FlaggedData, { as: "FlaggedData" });
db.FlaggedData.belongsTo(db.Session);

module.exports = db;

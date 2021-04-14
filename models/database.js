const { Sequelize } = require("sequelize");

const db = {};

const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
db.sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mariadb",
});

db.Quiz = require("./quiz")(db.sequelize, Sequelize);
db.Student = require("./student")(db.sequelize, Sequelize);
db.Session = require("./session")(db.sequelize, Sequelize, db.Quiz, db.Student);

db.Quiz.belongsToMany(db.Student, { through: db.Session });
db.Student.belongsToMany(db.Quiz, { through: db.Session });

module.exports = db;

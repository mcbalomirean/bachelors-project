module.exports = (sequelize, DataTypes, Student, Quiz) => {
  return sequelize.define("Session", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isFlagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

module.exports = (sequelize, DataTypes) => {
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
    QuizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "compositeIndex",
    },
    StudentName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "compositeIndex",
    },
  });
};

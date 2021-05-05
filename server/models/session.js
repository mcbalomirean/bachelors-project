module.exports = (sequelize, DataTypes, Student, Quiz) => {
  return sequelize.define("Session", {
    StudentName: {
      type: DataTypes.STRING,
      references: {
        model: Student,
        key: "name",
      },
      primaryKey: true,
    },
    QuizId: {
      type: DataTypes.INTEGER,
      references: {
        model: Quiz,
        key: "id",
      },
      primaryKey: true,
    },
    isFlagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

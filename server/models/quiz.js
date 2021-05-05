module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Quiz", {
    id: {
      type: DataTypes.INTEGER, // TODO: could be a string for edge cases
      primaryKey: true,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

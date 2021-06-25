module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Proctor", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};

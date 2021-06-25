const { enums } = require("../data/constants");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Flagged_Data", {
    type: {
      type: DataTypes.ENUM(enums.DATA_TYPES),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
    },
    reason: {
      type: DataTypes.STRING,
    },
    SessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

// TODO: add validator for path if type image?

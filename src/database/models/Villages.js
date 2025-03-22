"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Villages extends Model {
    static associate(models) {
      Villages.belongsTo(models.Cells, { foreignKey: "cellId", as: "cell" });
    }
  }

  Villages.init(
    {
      name: DataTypes.STRING, // Village name
      cellId: DataTypes.INTEGER, // Foreign Key to Cell
    },
    {
      sequelize,
      modelName: "Villages", // Plural model name
    }
  );

  return Villages;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cells extends Model {
    static associate(models) {
      Cells.belongsTo(models.Sectors, { foreignKey: "sectorId", as: "sector" });
      Cells.hasMany(models.Villages, { foreignKey: "cellId", as: "villages" });
    }
  }

  Cells.init(
    {
      name: DataTypes.STRING, // Cell name
      sectorId: DataTypes.INTEGER, // Foreign Key to Sector
    },
    {
      sequelize,
      modelName: "Cells", // Plural model name
    }
  );

  return Cells;
};

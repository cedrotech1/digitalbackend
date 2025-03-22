"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Sectors extends Model {
    static associate(models) {
      Sectors.belongsTo(models.Districts, { foreignKey: "districtId", as: "district" });
      Sectors.hasMany(models.Cells, { foreignKey: "sectorId", as: "cells" });
    }
  }

  Sectors.init(
    {
      name: DataTypes.STRING, // Sector name
      districtId: DataTypes.INTEGER, // Foreign Key to District
    },
    {
      sequelize,
      modelName: "Sectors", // Plural model name
    }
  );

  return Sectors;
};

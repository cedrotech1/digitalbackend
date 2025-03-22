"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HealthCenters extends Model {
    static associate(models) {
      HealthCenters.belongsTo(models.Sectors, { foreignKey: "sectorId", as: "sector" });
      HealthCenters.hasOne(models.Users, { foreignKey: "healthCenterId", as: "head" }); // Head of the health center
      HealthCenters.hasMany(models.Borns, { foreignKey: "healthCenterId", as: "bornRecords" }); // Babies linked to a health center
    }
  }

  HealthCenters.init(
    {
      name: DataTypes.STRING,
      sectorId: DataTypes.INTEGER, // Linked to a sector
    },
    {
      sequelize,
      modelName: "HealthCenters",
    }
  );

  return HealthCenters;
};

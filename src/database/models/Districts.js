"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Districts extends Model {
    static associate(models) {
      Districts.belongsTo(models.Provinces, { foreignKey: "provinceId", as: "province" });
      Districts.hasMany(models.Sectors, { foreignKey: "districtId", as: "sectors" });
    }
  }

  Districts.init(
    {
      name: DataTypes.STRING, // District name
      provinceId: DataTypes.INTEGER, // Foreign Key to Province
    },
    {
      sequelize,
      modelName: "Districts", // Plural model name
    }
  );

  return Districts;
};

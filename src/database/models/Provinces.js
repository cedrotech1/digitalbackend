"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Provinces extends Model {
    static associate(models) {
      Provinces.hasMany(models.Districts, { foreignKey: "provinceId", as: "districts" });
    }
  }

  Provinces.init(
    {
      name: DataTypes.STRING, // Province name
    },
    {
      sequelize,
      modelName: "Provinces", // Plural model name
    }
  );
  
  return Provinces;
};

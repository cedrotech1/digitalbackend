"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Settings extends Model {
    static associate(models) {
    }
  }

  Settings.init(
    {
      notify: DataTypes.STRING, // yes/no
     
    },
    {
      sequelize,
      modelName: "Settings", 
    }
  );

  return Settings;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Babies extends Model {
    static associate(models) {
      Babies.belongsTo(models.Borns, {
        foreignKey: "bornId",
        as: "birthRecord",
      });
      Babies.hasMany(models.AppointmentFeedbacks, {
        foreignKey: "babyId",
        as: "appoitment_feedback",
      });
     
    }
  }

  Babies.init(
    {
      bornId: DataTypes.INTEGER, // FK to Borns
      name: DataTypes.STRING,
      gender: DataTypes.STRING, // Male, Female
      birthWeight: DataTypes.INTEGER, // In kg
      dischargebirthWeight: DataTypes.INTEGER, // In kg
      medications:DataTypes.JSON, // JSON array for medications
    },
    {
      sequelize,
      modelName: "Babies",
    }
  );

  return Babies;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Appointments extends Model {
    static associate(models) {
      Appointments.belongsTo(models.Borns, {
        foreignKey: "bornId",
        as: "birthRecord",
      });
      // Appointments.belongsTo(models.Babies, {
      //   foreignKey: "bornId",
      //   as: "baby",
      // });
      Appointments.hasMany(models.AppointmentFeedbacks, {
        foreignKey: "appointmentId",
        as: "appointmentFeedback",
      });
      
    }
  }

  Appointments.init(
    {
      bornId: DataTypes.INTEGER, // FK to Borns
      date: DataTypes.DATE,
      time: DataTypes.TIME,
      purpose: DataTypes.STRING, // Vaccination, Checkup, Treatment
      status: DataTypes.STRING, // Scheduled, Completed, Canceled
    },
    {
      sequelize,
      modelName: "Appointments",
    }
  );

  return Appointments;
};

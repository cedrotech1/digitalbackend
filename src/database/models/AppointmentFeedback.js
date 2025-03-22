"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AppointmentFeedbacks extends Model {
    static associate(models) {
      AppointmentFeedbacks.belongsTo(models.Babies, {
        foreignKey: "babyId",
        as: "baby",
      });
      AppointmentFeedbacks.belongsTo(models.Appointments, {
        foreignKey: "appointmentId",
        as: "appointment",
      });
    }
  }

  AppointmentFeedbacks.init(
    {
      babyId: DataTypes.INTEGER, // FK to Babies
      appointmentId: DataTypes.INTEGER, // FK to Appointments
      weight: DataTypes.FLOAT, // Baby's weight at appointment
      feedback: DataTypes.TEXT, // Doctor's feedback
      nextAppointmentDate: DataTypes.DATE, // Suggested next visit
      status: DataTypes.STRING, // Follow-up required, Healthy, etc.
    },
    {
      sequelize,
      modelName: "AppointmentFeedbacks",
    }
  );

  return AppointmentFeedbacks;
};

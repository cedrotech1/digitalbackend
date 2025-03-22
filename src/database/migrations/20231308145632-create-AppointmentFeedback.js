"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AppointmentFeedbacks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      babyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Babies", key: "id" },
        onDelete: "CASCADE",
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Appointments", key: "id" },
        onDelete: "CASCADE",
      },
      weight: {
        type: Sequelize.FLOAT,
      },
      feedback: {
        type: Sequelize.TEXT,
      },
      nextAppointmentDate: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AppointmentFeedbacks");
  },
};

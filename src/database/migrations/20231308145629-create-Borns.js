"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Borns", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      healthCenterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "HealthCenters", key: "id" },
        onDelete: "CASCADE",
      },
    
      motherName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      motherPhone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      motherNationalId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fatherName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fatherPhone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fatherNationalId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      babyCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      deliveryType: {
        type: Sequelize.STRING,
      },
      leave: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      sector_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cell_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      village_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable("Borns");
  },
};

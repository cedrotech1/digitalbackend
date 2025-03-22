"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("HealthCenters", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sectorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Sectors", key: "id" },
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("HealthCenters");
  },
};

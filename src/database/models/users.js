"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.Borns, { foreignKey: "userID", as: "bornevents" });
      Users.hasMany(models.Notifications, { foreignKey: "userID", as: "notifications" });
    }
  }

  Users.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      phone: { type: DataTypes.STRING, unique: true },
      gender: DataTypes.STRING,
      code: DataTypes.STRING,
      status: DataTypes.STRING,
      image: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM(
          "admin",
          "data_manager",
          "head_of_community_workers_at_helth_center",
          "pediatrition",
        ),
        allowNull: false,
      },
      healthCenterId:{ type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );

  return Users;
};

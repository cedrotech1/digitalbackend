"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Borns extends Model {
    static associate(models) {
      Borns.belongsTo(models.Users, { foreignKey: "userID", as: "recordedBy" });
      Borns.belongsTo(models.HealthCenters, { foreignKey: "healthCenterId", as: "healthCenter" });
      Borns.hasMany(models.Babies, { foreignKey: "bornId", as: "babies" });
      // Borns.belongsTo(models.Provinces, { foreignKey: "province_id", as: "province" });
      // Borns.belongsTo(models.Districts, { foreignKey: "district_id", as: "district" });
      Borns.belongsTo(models.Sectors, { foreignKey: "sector_id", as: "sector" });
      Borns.belongsTo(models.Cells, { foreignKey: "cell_id", as: "cell" });
      Borns.belongsTo(models.Villages, { foreignKey: "village_id", as: "village" });
      Borns.hasMany(models.Appointments, {
        foreignKey: "bornId",
        as: "appointments",
      });
    }
  }

  Borns.init(
    {
      dateOfBirth: DataTypes.DATE,
      healthCenterId: DataTypes.INTEGER, // FK to HealthCenters
      motherName: DataTypes.STRING,
      motherPhone: DataTypes.STRING,
      // motherNationalId: DataTypes.STRING,
      fatherName: DataTypes.STRING,
      fatherPhone: DataTypes.STRING,
      // fatherNationalId: DataTypes.STRING,
      
      babyCount: DataTypes.INTEGER,
      deliveryType: DataTypes.STRING, //normal /c-section
      leave: DataTypes.STRING, //yes //no
      status: DataTypes.STRING, //go home // still in hospital
      // where they do as next destination
      dateofDischarge: DataTypes.DATE,
      dateofvisit:DataTypes.DATE,
      delivery_place: DataTypes.STRING,
      comment: DataTypes.STRING,
      rejectReason:DataTypes.STRING,
      sector_id: { type: DataTypes.INTEGER, allowNull: true },
      cell_id: { type: DataTypes.INTEGER, allowNull: true },
      village_id: { type: DataTypes.INTEGER, allowNull: true },
      userID: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "Borns",
    }
  );

  return Borns;
};

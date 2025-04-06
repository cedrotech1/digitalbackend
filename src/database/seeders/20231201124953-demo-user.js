"use strict";
import bcrypt from "bcrypt";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10; // Number of salt rounds for bcrypt

    const hashPassword = async (password) => await bcrypt.hash(password, saltRounds);

    const users = [

      {
        firstname: "florance",
        lastname: "florance",
        email: "florance@gmail.com",
        phone: "0783043021",
        role: "data_manager",
        status: "active",
        password: await hashPassword("1234"),
        gender: "Female",
        healthCenterId: null,
   
      },
      {
        firstname: "Espoir",
        lastname: "Espoir",
        email: "espoir@gmail.com",
        phone: "0782000000",
        role: "data_manager",
        status: "active",
        password: await hashPassword("1234"),
        gender: "Male",
        healthCenterId: null,
    
      },
      
      {
        firstname: "doctor",
        lastname: "innocent",
        email: "doctor@gmail.com",
        phone: "0784000004",
        role: "doctor",
        status: "active",
        password: await hashPassword("1234"),
        gender: "Male",
        healthCenterId: null,
      },
   
    ];

    return queryInterface.bulkInsert("Users", users.map(user => ({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    })));
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};

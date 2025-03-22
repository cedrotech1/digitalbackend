"use strict";
import bcrypt from "bcrypt";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10; // Number of salt rounds for bcrypt

    const hashPassword = async (password) => await bcrypt.hash(password, saltRounds);

    const users = [
      {
        firstname: "Admin",
        lastname: "Mado",
        email: "donboscogatenga2024@gmail.com",
        phone: "0784366616",
        role: "admin",
        status: "active",
        password: await hashPassword("1234"),
        gender: "Male",
        healthCenterId: null,
    
      },
      {
        firstname: "florance",
        lastname: "florance",
        email: "cedrojoe@gmail.com",
        phone: "0783043021",
        role: "data_manager",
        status: "active",
        password: await hashPassword("1234"),
        gender: "Female",
        healthCenterId: null,
   
      },
      // {
      //   firstname: "Espoir",
      //   lastname: "Espoir",
      //   email: "cedrickhakuzimana75@gmail.com",
      //   phone: "0782000000",
      //   role: "data_manager",
      //   status: "active",
      //   password: await hashPassword("1234"),
      //   gender: "Male",
      //   healthCenterId: null,
      //   province_id: 1,
      //   district_id: 2, // Assign a valid district
      //   sector_id: null,
      //   cell_id: null,
      //   village_id: null,
      // },
      {
        firstname: "cedrick",
        lastname: "hakuzimana",
        email: "cedrotech1@gmail.com",
        phone: "+250721686167",
        role: "head_of_community_workers_at_helth_center",
        status: "active",
        password: await hashPassword("1234"),
        gender: "Female",
        healthCenterId: 1,
     
      },
      {
        firstname: "patrick",
        lastname: "mukiza",
        email: "pediatrition@gmail.com",
        phone: "0784000004",
        role: "pediatrition",
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

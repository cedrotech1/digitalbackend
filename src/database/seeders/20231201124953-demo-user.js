"use strict";
import bcrypt from "bcrypt";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;
    const hashPassword = async (password) => await bcrypt.hash(password, saltRounds);

    // Map of health center names to IDs
    const healthCenters = {
      "Maraba Health Center": 1,
      "Ruhashya Health Center": 2,
      "Karama Health Center": 3,
      "Rwaniro Health Center": 4,
      "Kinyamakara Health Center": 5,
      "Simbi Health Center": 6,
      "Rusatira Health Center": 7,
      "Busoro Health Center": 8,
      "Mukura Health Center": 9,
      "Huye Health Center": 10,
      "Rubona Health Center": 11,
      "CUSP Butare Health Center": 12,
      "Sovu Health Center": 13,
      "Rango Health Center": 14,
      "Matyazo Health Center": 15,
      "Gitovu Health Center": 16,
      "Kinazi Health Center": 17,
    };

    const usersRaw = [
      { firstname: "Diane", lastname: "Ingabire", email: "dianeingabire05@gmail.com", phone: "0788772511", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 1 },
      { firstname: "Jean Paul", lastname: "Nkundineza", email: "nkundajeanp1976@gmail.com", phone: "0788467778", role: "head_of_community_workers_at_helth_center", gender: "Male", healthCenterId: 2 },
      { firstname: "Yvette", lastname: "Mwongereza", email: "mwongerezayvette@gmail.com", phone: "0785424548", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 3 },
      { firstname: "Irene", lastname: "Mukaremera", email: "ishimweteta1@gmail.com", phone: "0788680377", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 4 },
      { firstname: "Marie Rose", lastname: "Mukandoli", email: "mukandolim9@gmai.com", phone: "0783009426", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 5 },
      { firstname: "Pascal", lastname: "Dushimiyimana", email: "pdushimiyimana76@gmail.com", phone: "0788415990", role: "head_of_community_workers_at_helth_center", gender: "Male", healthCenterId: 6 },
      { firstname: "Angele", lastname: "Mukeshimana", email: "mukeshimana.angele@yahoo.com", phone: "0788496280", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 7 },
      { firstname: "Jean Damascene", lastname: "Higiro", email: "higirojed21@gmail.com", phone: "0784711902", role: "head_of_community_workers_at_helth_center", gender: "Male", healthCenterId: 8 },
      { firstname: "Marine", lastname: "Ingabire", email: "marineingabire@gmail.com", phone: "0782318300", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 9 },
      { firstname: "Samuel", lastname: "Havugimana", email: "hvsamuel11@gmail.com", phone: "0787075434", role: "head_of_community_workers_at_helth_center", gender: "Male", healthCenterId: 10 },
      { firstname: "Claudine", lastname: "Manariyo", email: "ariabriana044@gmail.com", phone: "0788805927", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 11 },
      { firstname: "Peruth", lastname: "Mujawabasindi", email: "mperuth@yahoo.fr", phone: "0788754475", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 12 },
      { firstname: "Beathe", lastname: "Mutesire", email: "mutesirebeathe@gmail.com", phone: "0788439193", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 13 },
      { firstname: "Epiphanie", lastname: "Uganase", email: "uganepiphanie@gmail.com", phone: "0788722632", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 14 },
      { firstname: "Immaculee", lastname: "Bahatiyamungu", email: "bahatiyamungui@gmail.com", phone: "0781611604", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 15 },
      { firstname: "Jean de Dieu", lastname: "Nsengiyumva", email: "nsengajado10@gmail.com", phone: "0788986825", role: "head_of_community_workers_at_helth_center", gender: "Male", healthCenterId: 16 },
      { firstname: "Philothee", lastname: "Murebwayire", email: "murebwayirephilothee07@gmai.com", phone: "0784366616", role: "head_of_community_workers_at_helth_center", gender: "Female", healthCenterId: 17 },

      // NGO UMUBANO IMPORE Staff (no healthCenterId)
      { firstname: "Espoir", lastname: "Rusimbi", email: "rusimbiespoir120@gmail.com", phone: "0788283868", role: "data_manager", gender: "Male", healthCenterId: null },
      { firstname: "Florence", lastname: "Mwiza", email: "florenceinjesus@gmail.com", phone: "0788263827", role: "data_manager", gender: "Female", healthCenterId: null },

      // KDH Health Care Providers (no healthCenterId)
      { firstname: "Innocent", lastname: "Rushingwa", email: "drinnocentrushingwa@gmail.com", phone: "0788421179", role: "doctor", gender: "Male", healthCenterId: null },
      { firstname: "Varelie", lastname: "Niyonsaba", email: "niyonsabavarelie148@gmail.com", phone: "0782249777", role: "doctor", gender: "Female", healthCenterId: null },
    ];

    const users = await Promise.all(usersRaw.map(async (user) => ({
      ...user,
      password: await hashPassword("1234"),
      status: "active",
      healthCenterId: user.healthCenterId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })));

    return queryInterface.bulkInsert("Users", users);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};

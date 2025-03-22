"use strict";
import addressData from "../../address"; // Adjust path to where your data is located

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      for (const provinceName in addressData) {
        // Check if province exists
        const [province] = await queryInterface.sequelize.query(
          `SELECT id FROM "Provinces" WHERE name = :name`,
          {
            replacements: { name: provinceName },
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        let provinceId = province ? province.id : null;

        // Insert province if it doesn't exist
        if (!provinceId) {
          const provincesInserted = await queryInterface.bulkInsert(
            "Provinces",
            [
              {
                name: provinceName,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            { returning: true }
          );
          provinceId = provincesInserted[0].id;
        }

        for (const districtName in addressData[provinceName]) {
          // Check if district exists
          const [district] = await queryInterface.sequelize.query(
            `SELECT id FROM "Districts" WHERE name = :name AND "provinceId" = :provinceId`,
            {
              replacements: { name: districtName, provinceId },
              type: Sequelize.QueryTypes.SELECT,
            }
          );

          let districtId = district ? district.id : null;

          // Insert district if it doesn't exist
          if (!districtId) {
            const districtsInserted = await queryInterface.bulkInsert(
              "Districts",
              [
                {
                  name: districtName,
                  provinceId,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
              { returning: true }
            );
            districtId = districtsInserted[0].id;
          }

          for (const sectorName in addressData[provinceName][districtName]) {
            // Check if sector exists
            const [sector] = await queryInterface.sequelize.query(
              `SELECT id FROM "Sectors" WHERE name = :name AND "districtId" = :districtId`,
              {
                replacements: { name: sectorName, districtId },
                type: Sequelize.QueryTypes.SELECT,
              }
            );

            let sectorId = sector ? sector.id : null;

            // Insert sector if it doesn't exist
            if (!sectorId) {
              const sectorsInserted = await queryInterface.bulkInsert(
                "Sectors",
                [
                  {
                    name: sectorName,
                    districtId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ],
                { returning: true }
              );
              sectorId = sectorsInserted[0].id;
            }

            const sectorCells = addressData[provinceName][districtName][sectorName];

            if (sectorCells && typeof sectorCells === "object") {
              for (const cellName in sectorCells) {
                // Check if cell exists
                const [cell] = await queryInterface.sequelize.query(
                  `SELECT id FROM "Cells" WHERE name = :name AND "sectorId" = :sectorId`,
                  {
                    replacements: { name: cellName, sectorId },
                    type: Sequelize.QueryTypes.SELECT,
                  }
                );

                let cellId = cell ? cell.id : null;

                // Insert cell if it doesn't exist
                if (!cellId) {
                  const cellsInserted = await queryInterface.bulkInsert(
                    "Cells",
                    [
                      {
                        name: cellName,
                        sectorId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      },
                    ],
                    { returning: true }
                  );
                  cellId = cellsInserted[0].id;
                }

                const villagesData = sectorCells[cellName];

                if (Array.isArray(villagesData) && villagesData.length > 0) {
                  const villagePromises = villagesData.map(async (villageName) => {
                    // Check if village exists
                    const [village] = await queryInterface.sequelize.query(
                      `SELECT id FROM "Villages" WHERE name = :name AND "cellId" = :cellId`,
                      {
                        replacements: { name: villageName, cellId },
                        type: Sequelize.QueryTypes.SELECT,
                      }
                    );

                    if (!village) {
                      await queryInterface.bulkInsert("Villages", [
                        {
                          name: villageName,
                          cellId,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        },
                      ]);
                    }
                  });

                  await Promise.all(villagePromises);
                }
              }
            }
          }
        }
      }

      console.log("Seeding completed successfully.");
    } catch (error) {
      console.error("Error seeding address data:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Villages", null, {});
    await queryInterface.bulkDelete("Cells", null, {});
    await queryInterface.bulkDelete("Sectors", null, {});
    await queryInterface.bulkDelete("Districts", null, {});
    await queryInterface.bulkDelete("Provinces", null, {});
  },
};

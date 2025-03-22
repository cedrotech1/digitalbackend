import db from "../database/models/index.js";
const { Provinces, Districts, Sectors, Cells, Villages } = db;
const addressData = require('../address.js'); // Import static address data
import { getAllAddressData,getAddressData } from "../services/addressService.js";

export const addressController = async (req, res) => {
    try {
      for (const provinceName in addressData) {
        // Check if province already exists
        let province = await Provinces.findOne({ where: { name: provinceName } });
  
        // Insert province if it doesn't exist
        if (!province) {
          province = await Provinces.create({ name: provinceName });
        }
  
        for (const districtName in addressData[provinceName]) {
          // Check if district already exists
          let district = await Districts.findOne({
            where: { name: districtName, provinceId: province.id }
          });
  
          // Insert district if it doesn't exist
          if (!district) {
            district = await Districts.create({
              name: districtName,
              provinceId: province.id,
            });
          }
  
          for (const sectorName in addressData[provinceName][districtName]) {
            // Check if sector already exists
            let sector = await Sectors.findOne({
              where: { name: sectorName, districtId: district.id }
            });
  
            // Insert sector if it doesn't exist
            if (!sector) {
              sector = await Sectors.create({
                name: sectorName,
                districtId: district.id,
              });
            }
  
            // If sector data is an object or array, handle cell insertion
            const sectorCells = addressData[provinceName][districtName][sectorName];
  
            if (sectorCells && typeof sectorCells === 'object') {
              for (const cellName in sectorCells) {
                // Check if cell already exists
                let cell = await Cells.findOne({
                  where: { name: cellName, sectorId: sector.id }
                });
  
                // Insert cell if it doesn't exist
                if (!cell) {
                  cell = await Cells.create({
                    name: cellName,
                    sectorId: sector.id,
                  });
                }
  
                // Insert villages if cells exist and they have villages
                const villagesData = sectorCells[cellName];
                if (Array.isArray(villagesData) && villagesData.length > 0) {
                  const villagesPromises = villagesData.map(async (villageName) => {
                    // Check if village already exists
                    const existingVillage = await Villages.findOne({
                      where: { name: villageName, cellId: cell.id },
                    });
  
                    if (!existingVillage) {
                      await Villages.create({
                        name: villageName,
                        cellId: cell.id,
                      });
                    }
                  });
  
                  await Promise.all(villagesPromises);
                }
              }
            }
          }
        }
      }
  
      res.status(200).json({ message: "Address data inserted successfully!" });
    } catch (error) {
      console.error("Error inserting address data:", error);
      res.status(500).json({ message: "Error inserting address data", error });
    }
  };
  

export const getAddressHierarchy = async (req, res) => {
  try {
    const addressData = await getAllAddressData();
    return res.status(200).json({
      success: true,
      message: "Address hierarchy fetched successfully",
      data: addressData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching address data",
      error: error.message,
    });
  }
};


export const getFilteredAddressData = async (req, res) => {
  try {
    const { province, district, sector, cell, village } = req.query;

    const filters = { province, district, sector, cell, village };

    const addressData = await getAddressData(filters);

    if (!addressData.length) {
      return res.status(404).json({ message: "No address data found" });
    }

    return res.status(200).json(addressData);
  } catch (error) {
    console.error("Error fetching filtered address data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
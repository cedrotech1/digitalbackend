import db from "../database/models/index.js";
const { Provinces, Districts, Sectors, Cells, Villages,Categories,Users,Posts,Notifications} = db;

export const getAllAddressData = async () => {
  try {
    const provinces = await Provinces.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: Districts,
          as: "districts", // Alias for Districts
          attributes: ["id", "name"],
          include: [
            {
              model: Sectors,
              as: "sectors", // Alias for Sectors
              attributes: ["id", "name"],
              include: [
                {
                  model: Cells,
                  as: "cells", // Alias for Cells
                  attributes: ["id", "name"],
                  include: [
                    {
                      model: Villages,
                      as: "villages", // Alias for Villages
                      attributes: ["id", "name"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return provinces;
  } catch (error) {
    console.error("Error fetching address data:", error);
    throw error;
  }
};

export const getAddressData = async (filters) => {
  try {
    const whereCondition = {};

    if (filters.province) {
      whereCondition.name = filters.province;
    }

    const provinces = await Provinces.findAll({
      attributes: ["id", "name"],
      where: whereCondition,
      include: [
        {
          model: Districts,
          as: "districts",
          attributes: ["id", "name"],
          where: filters.district ? { name: filters.district } : undefined,
          required: !!filters.district,
          include: [
            {
              model: Sectors,
              as: "sectors",
              attributes: ["id", "name"],
              where: filters.sector ? { name: filters.sector } : undefined,
              required: !!filters.sector,
              include: [
                {
                  model: Cells,
                  as: "cells",
                  attributes: ["id", "name"],
                  where: filters.cell ? { name: filters.cell } : undefined,
                  required: !!filters.cell,
                  include: [
                    {
                      model: Villages,
                      as: "villages",
                      attributes: ["id", "name"],
                      where: filters.village ? { name: filters.village } : undefined,
                      required: !!filters.village,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return provinces;
  } catch (error) {
    console.error("Error fetching address data:", error);
    throw error;
  }
};


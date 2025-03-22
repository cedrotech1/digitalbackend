import db from "../database/models/index.js";
const { HealthCenters, Users, Notifications } = db;

// Helper function to send notifications
const sendNotification = async (userID, title, message, type) => {
  try {
    await Notifications.create({ userID, title, message, type });
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

// Create a Health Center
export const createHealthCenter = async (req, res) => {
  try {
    const { name, sectorId } = req.body;
    if (!name || !sectorId) {
      return res.status(400).json({ message: "Name and sector ID are required." });
    }
    const newHealthCenter = await HealthCenters.create({ name, sectorId });
    return res.status(201).json(newHealthCenter);
  } catch (error) {
    console.error("Error creating health center:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get all Health Centers
export const getAllHealthCenters = async (req, res) => {
  try {
    const healthCenters = await HealthCenters.findAll({ include: [{ model: Users, as: "head" }] });
    return res.status(200).json(healthCenters);
  } catch (error) {
    console.error("Error fetching health centers:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get Health Center by ID
export const getHealthCenterById = async (req, res) => {
  try {
    const { id } = req.params;
    const healthCenter = await HealthCenters.findByPk(id, { include: [{ model: Users, as: "head" }] });
    if (!healthCenter) {
      return res.status(404).json({ message: "Health center not found." });
    }
    return res.status(200).json(healthCenter);
  } catch (error) {
    console.error("Error fetching health center:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Update Health Center
export const updateHealthCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sectorId } = req.body;
    const healthCenter = await HealthCenters.findByPk(id);
    if (!healthCenter) {
      return res.status(404).json({ message: "Health center not found." });
    }
    await healthCenter.update({ name, sectorId });
    return res.status(200).json(healthCenter);
  } catch (error) {
    console.error("Error updating health center:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Delete Health Center
export const deleteHealthCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const healthCenter = await HealthCenters.findByPk(id);
    if (!healthCenter) {
      return res.status(404).json({ message: "Health center not found." });
    }
    await healthCenter.destroy();
    return res.status(200).json({ message: "Health center deleted successfully." });
  } catch (error) {
    console.error("Error deleting health center:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

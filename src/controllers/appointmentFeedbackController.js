import db from "../database/models/index.js";
const { AppointmentFeedbacks, Babies, Appointments } = db

export const createFeedback = async (req, res) => {
  try {
    const feedback = await AppointmentFeedbacks.create(req.body);
    res.status(201).json({ message: "Appointment feedback created", data: feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await AppointmentFeedbacks.findAll({
      include: [
        { model: Babies, as: "baby" },
        { model: Appointments, as: "appointment" },
      ],
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await AppointmentFeedbacks.findByPk(req.params.id, {
      include: [
        { model: Babies, as: "baby" },
        { model: Appointments, as: "appointment" },
      ],
    });
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await AppointmentFeedbacks.update(req.body, { where: { id } });

    if (!updated) return res.status(404).json({ error: "Feedback not found" });

    const updatedFeedback = await AppointmentFeedback.findByPk(id);
    res.status(200).json({ message: "Feedback updated", data: updatedFeedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AppointmentFeedbacks.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ error: "Feedback not found" });

    res.status(200).json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import db from "../database/models/index.js";
const { Appointments, Borns, Babies, AppointmentFeedbacks } = db;

// Create an appointment
export const createAppointment = async (req, res) => {
    try {
        const { bornId, date, time, purpose, status } = req.body;

        if (!bornId || !date || !time || !purpose || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const appointment = await Appointments.create({ bornId, date, time, purpose, status });

        return res.status(201).json({ message: "Appointment created successfully!", appointment });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get all appointments
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointments.findAll({
            include: [
                { model: Borns, as: "birthRecord",
                    include: [
                       
                        
                        { model: Babies, as: "babies" },
                       
                      ],
                 },

                {
                    model: AppointmentFeedbacks,
                    as: "appointmentFeedback",
                    attributes: ["id", "weight", "feedback", "nextAppointmentDate", "status"],
                    include: [
                        {
                            model: Babies,
                            as: "baby",
                        },
                    ],
                },
            ],

        });

        return res.status(200).json({ message: "Appointments fetched successfully!", appointments });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get a single appointment by ID
export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointments.findByPk(id, {
            include: [
                { model: Borns, as: "birthRecord" },

                {
                    model: AppointmentFeedbacks,
                    as: "appointmentFeedback",
                    attributes: ["id", "weight", "feedback", "nextAppointmentDate", "status"],
                    include: [
                        {
                            model: Babies,
                            as: "baby",
                        },
                    ],
                },
            ],

        });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json({ message: "Appointment fetched successfully!", appointment });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, purpose, status } = req.body;

        const appointment = await Appointments.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        await appointment.update({ date, time, purpose, status });

        return res.status(200).json({ message: "Appointment updated successfully!", appointment });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointments.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        await appointment.destroy();

        return res.status(200).json({ message: "Appointment deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

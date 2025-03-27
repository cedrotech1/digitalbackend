
import db from "../database/models/index.js";
const { Borns, Babies, HealthCenters, Appointments, Sectors,AppointmentFeedbacks  } = db;
const { Op } = require("sequelize");



// const getAllBabies = async (req, res) => {
//   try {
//     const babies = await Babies.findAll({
//       include: [
//         { model: Borns, as: "birthRecord", attributes: ["id", "motherName", "fatherName", "dateOfBirth"] },
//         {
//           model: AppointmentFeedbacks,
//           as: "appoitment_feedback",
//           // attributes: ["id", "weight", "feedback", "nextAppointmentDate", "status"],
//           include: [
//             {
//               model: Appointments,
//               as: "appointment",
//             },
//           ],
//         },
//       ],
//     });

//     return res.status(200).json(babies);
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

// const getBabyById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const baby = await Babies.findByPk(id, {
//       include: [
//         { model: Borns, as: "birthRecord", attributes: ["id", "motherName", "fatherName", "dateOfBirth"],
//           include:[
//             {
//               model: Appointments,
//               as: "appointments",
//               include: [
//                 {
//                   model: AppointmentFeedbacks,
//                   as: "appointmentFeedback",
//                   attributes: ["id", "weight", "feedback", "nextAppointmentDate", "status"],
//                   include: [
//                     {
//                       model: Babies,
//                       as: "baby",
//                     },
//                   ],
//                 },
//               ],
//             },
//           ]
//         },
//         // {
//         //   model: AppointmentFeedbacks,
//         //   as: "appoitment_feedback",
//         //   // attributes: ["id", "weight", "feedback", "nextAppointmentDate", "status"],
//         //   include: [
//         //     {
//         //       model: Appointments,
//         //       as: "appointment",
//         //     },
//         //   ],
//         // },
//       ],
//     });

//     if (!baby) return res.status(404).json({ message: "Baby record not found" });

//     return res.status(200).json(baby);
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

const getAllBabies = async (req, res) => {
  try {
    // Fetch all babies first
    const babies = await Babies.findAll({
      include: [
        {
          model: Borns,
          as: "birthRecord",
          attributes: ["id", "motherName", "fatherName", "dateOfBirth"],
          // include: [
          //   {
          //     model: Appointments,
          //     as: "appointments",
          //     required: false, // Ensure appointments are retrieved even if no feedback exists
          //     include: [
          //       {
          //         model: AppointmentFeedbacks,
          //         as: "appointmentFeedback",
          //         // attributes: ["id", "weight", "feedback", "nextAppointmentDate", "status"],
          //         required: false, // Retrieve feedback only if available
          //       },
          //     ],
          //   },
          // ],
        },
      ],
    });

    // Loop through babies to associate the correct babyId with appointment feedback
    babies.forEach((baby) => {
      if (baby.birthRecord && baby.birthRecord.appointments) {
        baby.birthRecord.appointments.forEach((appointment) => {
          if (appointment.appointmentFeedback) {
            appointment.appointmentFeedback = appointment.appointmentFeedback.filter(
              (feedback) => feedback.babyId === baby.id
            );
          }
        });
      }
    });

    return res.status(200).json(babies);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const getBabyById = async (req, res) => {
  try {
    const { id } = req.params;
    const baby = await Babies.findByPk(id, {
      include: [
        {
          model: Borns,
          as: "birthRecord",
          attributes: ["id", "motherName", "fatherName", "dateOfBirth"],
          include: [
            {
              model: Appointments,
              as: "appointments",
              required: false, // Ensures appointments are retrieved even if no feedback exists
              include: [
                {
                  model: AppointmentFeedbacks,
                  as: "appointmentFeedback",
                  attributes: ["id", "weight", "feedback", "nextAppointmentDate", "status"],
                  required: false, // Ensures feedback is retrieved only if available
                  where: { babyId: id }, // Only include feedback for the requested baby
                },
              ],
            },
          ],
        },
      ],
    });

    if (!baby) return res.status(404).json({ message: "Baby record not found" });

    return res.status(200).json(baby);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const createBaby = async (req, res) => {
  try {
    const { bornId, name, gender, birthWeight, dischargebirthWeight, medications } = req.body;

    // Ensure the related Born event exists
    const bornRecord = await Borns.findByPk(bornId);
    if (!bornRecord) {
      return res.status(404).json({ message: "Born record not found" });
    }

    // Create Baby entry
    const newBaby = await Babies.create({ bornId, name, gender, birthWeight, dischargebirthWeight, medications });

    // Increment baby count in Born record
    await Borns.update(
      { babyCount: bornRecord.babyCount + 1 },
      { where: { id: bornId } }
    );

    return res.status(201).json({ message: "Baby record created successfully!", newBaby });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const updateBaby = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Babies.update(req.body, { where: { id } });

    if (updated[0] === 0) return res.status(404).json({ message: "Baby record not found" });

    return res.status(200).json({ message: "Baby record updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const deleteBaby = async (req, res) => {
  try {
    const { id } = req.params;

    // Find baby record before deletion
    const babyRecord = await Babies.findByPk(id);
    if (!babyRecord) return res.status(404).json({ message: "Baby record not found" });

    // Find the related Born record
    const bornRecord = await Borns.findByPk(babyRecord.bornId);
    if (!bornRecord) return res.status(404).json({ message: "Born record not found" });

    // Delete the baby record
    await Babies.destroy({ where: { id } });

    // Decrement baby count in Born record (ensuring it doesn't go below 0)
    const newBabyCount = Math.max(bornRecord.babyCount - 1, 0);
    await Borns.update(
      { babyCount: newBabyCount },
      { where: { id: babyRecord.bornId } }
    );

    return res.status(200).json({ message: "Baby record deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


module.exports = {
  createBaby,
  getAllBabies,
  getBabyById,
  updateBaby,
  deleteBaby,
};

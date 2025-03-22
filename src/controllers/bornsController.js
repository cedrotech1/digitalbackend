import db from "../database/models/index.js";
import sendSMS from "../utils/sms.js"; // Assuming you have an SMS utility function
import Email from "../utils/mailer.js"; // Assuming you have an email utility function

const { Borns, Babies,Cells ,Villages , Users, Notifications,HealthCenters,Sectors,Appointments,AppointmentFeedbacks  } = db;

const createBornWithBabies = async (req, res) => {
  let userID=req.user.id;
  try {
    const { 
      dateOfBirth, healthCenterId, motherName, motherPhone, 
      motherNationalId, fatherName, fatherPhone, fatherNationalId, babyCount, 
      deliveryType, leave, status, sector_id, cell_id, village_id, babies 
    } = req.body;

    if (!Array.isArray(babies) || babies.length === 0) {
      return res.status(400).json({ message: "Babies information is required." });
    }

    // Create Born entry
    const newBorn = await Borns.create({
      dateOfBirth, healthCenterId, motherName, motherPhone, 
      motherNationalId, fatherName, fatherPhone, fatherNationalId, babyCount, 
      deliveryType, leave, status, sector_id, cell_id, village_id,userID
    });

    // Create Babies associated with Born
    const createdBabies = await Promise.all(
      babies.map(baby => Babies.create({ ...baby, bornId: newBorn.id }))
    );

    // Find users who should be notified: Admins and Data Managers
    const usersToNotify = await Users.findAll({
      where: {
        role: {
          [db.Sequelize.Op.in]: ["admin", "data_manager"]
        }
      }
    });

   
    const headOfCommunityWorkers = await Users.findAll({
      where: {
        role: "head_of_community_workers_at_helth_center",
        healthCenterId: healthCenterId // Ensure healthCenterId matches for the specific community worker
      }
    });

    // Combine both arrays of users
    const allUsersToNotify = [...usersToNotify, ...headOfCommunityWorkers];

    // Prepare notifications with more details
    const notifications = allUsersToNotify.map(user => ({
      userID: user.id,
      title: `New Birth Recorded for ${motherName}`,
      message: `A new birth has been recorded in the system for ${motherName}. ` +
               `Details: \nMother's Phone: ${motherPhone}\nFather's Name: ${fatherName} ` +
               `\nDelivery Type: ${deliveryType}\nBaby Count: ${babyCount}\n` +
               `Visit the system for more information.`,
      status: "unread"
    }));

    // Store notifications in the database
    await Notifications.bulkCreate(notifications);

    // Optionally send SMS notifications
    await Promise.all(
      allUsersToNotify.map(user => sendSMS(user.phone, `A new birth has been recorded in the system for ${motherName}. ` +
               `Details: \nMother's Phone: ${motherPhone}\nFather's Name: ${fatherName} ` +
               `\nDelivery Type: ${deliveryType}\nBaby Count: ${babyCount}\n` +
               `Visit the system for more information.`))
    );

    // Email notification content
    let claim = {
      message: `A new birth has been recorded in the system for ${motherName}. ` +
               `Details: \nMother's Phone: ${motherPhone}\nFather's Name: ${fatherName} ` +
               `\nDelivery Type: ${deliveryType}\nBaby Count: ${babyCount}\n` +
               `Visit the system for more information.`,
    };

    // Send email notifications
    await Promise.all(
      allUsersToNotify.map(user => new Email(user, claim).sendNotification())
    );

    return res.status(201).json({
      message: "Born event and babies created successfully! Notifications sent.",
      newBorn,
      babies: createdBabies
    });

  } catch (error) {
    console.error("Error creating born event:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// export default createBornWithBabies;


// export default createBornWithBabies;

// const getAllBorns = async (req, res) => {
//   try {
//     const borns = await Borns.findAll({
//       include: [
//         { model: HealthCenters, as: "healthCenter", attributes: ["id", "name"] },
//         { model: Babies, as: "babies", attributes: ["id", "name", "gender", "birthWeight"] },
//         { model: Appointments, as: "appointments", attributes: ["id", "date", "status"] },
//         { model: Sectors, as: "sector", attributes: ["id", "name"] },
//       ],
//     });

//     return res.status(200).json(borns);
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

// const getBornById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const born = await Borns.findByPk(id, {
//       include: [
//         { model: HealthCenters, as: "healthCenter", attributes: ["id", "name"] },
//         { model: Babies, as: "babies", attributes: ["id", "name", "gender", "birthWeight"] },
//         { model: Appointments, as: "appointments", attributes: ["id", "date", "status"] },
//         { model: Sectors, as: "sector", attributes: ["id", "name"] },
//       ],
//     });

//     if (!born) return res.status(404).json({ message: "Born record not found" });

//     return res.status(200).json(born);
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

const getAllBorns = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    let whereCondition = {};

    if (req.user.role == "head_of_community_workers_at_helth_center") {
      if (!req.user.healthCenterId) {
        return res.status(400).json({ message: "Missing healthCenterId for user" });
      }
      whereCondition = { healthCenterId: req.user.healthCenterId };
    }

    const borns = await Borns.findAll({
      where: whereCondition,
      include: [
        { model: HealthCenters, as: "healthCenter", attributes: ["id", "name"] },
        { model: Sectors, as: "sector" },
        { model: Cells, as: "cell" },
        { model: Villages, as: "village" },
        { model: Users, as: "recordedBy" },
        { model: Babies, as: "babies", attributes: ["id", "name", "gender", "birthWeight"] },
        {
          model: Appointments,
          as: "appointments",
          include: [
            {
              model: AppointmentFeedbacks,
              as: "appointmentFeedback",
              attributes: ["id", "weight", "feedback", "nextAppointmentDate", "status"],
              include: [{ model: Babies, as: "baby" }],
            },
          ],
        },
      ],
    });

    return res.status(200).json(borns);
  } catch (error) {
    console.error("Error fetching borns:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




const getBornById = async (req, res) => {
  try {
    const { id } = req.params;
    const born = await Borns.findByPk(id, {
      where: whereCondition,
      include: [
        { model: HealthCenters, as: "healthCenter", attributes: ["id", "name"] },
        { model: Sectors, as: "sector" },
        { model: Cells, as: "cell" },
        { model: Villages, as: "village" },
        { model: Users, as: "recordedBy" },
        { model: Babies, as: "babies", attributes: ["id", "name", "gender", "birthWeight"] },
        {
          model: Appointments,
          as: "appointments",
          include: [
            {
              model: AppointmentFeedbacks,
              as: "appointmentFeedback",
              attributes: ["id", "weight", "feedback", "nextAppointmentDate", "status"],
              include: [{ model: Babies, as: "baby" }],
            },
          ],
        },
      ],
    });

    if (!born) return res.status(404).json({ message: "Born record not found" });

    return res.status(200).json(born);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const updateBorn = async (req, res) => {
  try {
    const { id } = req.params;
    const { dateOfBirth, healthCenterId, motherName, motherPhone, 
      motherNationalId, fatherName, fatherPhone, fatherNationalId, babyCount, 
      deliveryType, leave, status, sector_id, cell_id, village_id } = req.body;

    const [updated] = await Borns.update(req.body, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ message: "Born record not found" });
    }

    // Find users to notify
    const usersToNotify = await Users.findAll({
      where: {
        role: { [db.Sequelize.Op.in]: ["admin", "data_manager"] }
      }
    });

    // Find health center heads specific to the birth's location
    const headOfCommunityWorkers = await Users.findAll({
      where: {
        role: "head_of_community_workers_at_helth_center",
        healthCenterId: healthCenterId
      }
    });

    // Merge both groups
    const allUsersToNotify = [...usersToNotify, ...headOfCommunityWorkers];

    // Notification details
    const notificationMessage = 
      `A birth record for ${motherName} has been updated.\n` +
      `Details:\nBaby Count: ${babyCount}\nDelivery Type: ${deliveryType}\n` +
      `Mother's Phone: ${motherPhone}\nFather's Name: ${fatherName}\n` +
      `Check the system for more details.`;

    // Create system notifications
    const notifications = allUsersToNotify.map(user => ({
      userID: user.id,
      title: `Updated Birth Record for ${motherName}`,
      message: notificationMessage,
      status: "unread"
    }));

    await Notifications.bulkCreate(notifications);

    // Send SMS notifications
    await Promise.all(allUsersToNotify.map(user => sendSMS(user.phone, notificationMessage)));

    // Send email notifications
    let emailContent = { message: notificationMessage };

    await Promise.all(allUsersToNotify.map(user => new Email(user, emailContent).sendNotification()));

    return res.status(200).json({ message: "Born record updated successfully! Notifications sent." });

  } catch (error) {
    console.error("Error updating born record:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Function to delete a born record
const deleteBorn = async (req, res) => {
  try {
    const { id } = req.params;
    const bornRecord = await Borns.findByPk(id);

    if (!bornRecord) {
      return res.status(404).json({ message: "Born record not found" });
    }

    console.log(id)

    // await Borns.destroy({ where: { id } });

    // Find users to notify
    const usersToNotify = await Users.findAll({
      where: {
        role: { [db.Sequelize.Op.in]: ["admin", "data_manager"] }
      }
    });

    // Find relevant health center heads
    const headOfCommunityWorkers = await Users.findAll({
      where: {
        role: "head_of_community_workers_at_helth_center",
        healthCenterId: bornRecord.healthCenterId
      }
    });

    // Merge users
    const allUsersToNotify = [...usersToNotify, ...headOfCommunityWorkers];

    // Deletion notification message
    const notificationMessage = 
      `The birth record for ${bornRecord.motherName} has been deleted.\n` +
      `Mother's Phone: ${bornRecord.motherPhone}\nFather's Name: ${bornRecord.fatherName}\n` +
      `For more details, visit the system.`;

    // Create system notifications
    const notifications = allUsersToNotify.map(user => ({
      userID: user.id,
      title: `Deleted Birth Record for ${bornRecord.motherName}`,
      message: notificationMessage,
      status: "unread"
    }));

    await Notifications.bulkCreate(notifications);

    // Send SMS notifications
    await Promise.all(allUsersToNotify.map(user => sendSMS(user.phone, notificationMessage)));

    // Send email notifications
    let emailContent = { message: notificationMessage };

    await Promise.all(allUsersToNotify.map(user => new Email(user, emailContent).sendNotification()));
    await Borns.destroy({ where: { id } });
   
    return res.status(200).json({ message: "Born record deleted successfully! Notifications sent." });

  } catch (error) {
    console.error("Error deleting born record:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


module.exports = {
  createBornWithBabies,
  getAllBorns,
  getBornById,
  updateBorn,
  deleteBorn,
};

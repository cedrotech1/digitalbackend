import db from "../database/models/index.js";
import sendSMS from "../utils/sms.js"; // Assuming you have an SMS utility function
import Email from "../utils/mailer.js"; // Assuming you have an email utility function
import { Op } from "sequelize";

const { Borns, Babies,Cells,Settings,Villages , Users, Notifications,HealthCenters,Sectors,Appointments,AppointmentFeedbacks  } = db;

const createBornWithBabies = async (req, res) => {
  let userID = req.user.id;

  // Helper function for birth type label
  const getBirthType = (count) => {
    switch (count) {
      case 1: return 'Single Birth';
      case 2: return 'Twins';
      case 3: return 'Triplets';
      case 4: return 'Quadruplets';
      default: return `${count} Babies`;
    }
  };

  try {
    const notify = await Settings.findByPk(1);
    let {
      dateOfBirth, healthCenterId, motherName, motherPhone,
      motherNationalId, fatherName, fatherPhone, delivery_place, fatherNationalId,
      babyCount, dateofDischarge, dateofvisit,
      deliveryType, leave, status, sector_id, cell_id, village_id,
      comment, babies
    } = req.body;

    console.log("delivery place: " + delivery_place);

    const healthCenter = await HealthCenters.findByPk(healthCenterId);
    if (!healthCenter) {
      return res.status(404).json({ message: "Health center not found." });
    }

    // Validate babyCount
    if (!Array.isArray(babies) || babies.length === 0) {
      return res.status(400).json({ message: "Babies information is required" });
    }

    req.body.babyCount = babies.length;
    status = 'pending';

    // Optional: validate each baby
    for (let baby of babies) {
      if (!baby.name || !baby.gender || !baby.birthWeight || !baby.dischargebirthWeight) {
        // return res.status(400).json({ message: "Each baby must have a name, gender, birth weight, and discharge birth weight." });
      }

      if (baby.medications && !Array.isArray(baby.medications)) {
        return res.status(400).json({ message: "Medications should be an array." });
      }

      if (baby.medications) {
        for (let med of baby.medications) {
          if (!med.name || !med.dose || !med.frequency) {
            return res.status(400).json({ message: "Each medication must have a name, dose, and frequency." });
          }
        }
      }
    }

    console.log(req.body);

    const newBorn = await Borns.create({
      dateOfBirth, healthCenterId, motherName, motherPhone,
      motherNationalId, fatherName, fatherPhone, fatherNationalId, babyCount,
      deliveryType, leave, status, sector_id, cell_id, village_id,
      comment, userID, delivery_place, dateofDischarge, dateofvisit
    });

    // Get location names
    const sector = await Sectors.findByPk(sector_id);
    const cell = await Cells.findByPk(cell_id);
    const village = await Villages.findByPk(village_id);

    const sectorName = sector ? sector.name : "Unknown sector";
    const cellName = cell ? cell.name : "Unknown cell";
    const villageName = village ? village.name : "Unknown village";

    // Create babies
    const createdBabies = await Promise.all(
      babies.map(baby => Babies.create({ ...baby, bornId: newBorn.id }))
    );

    // Notify users
    const usersToNotify = await Users.findAll({
      where: {
        role: {
          [db.Sequelize.Op.in]: ["data_manager"]
        }
      }
    });

    const headOfCommunityWorkers = await Users.findAll({
      where: {
        role: "head_of_community_workers_at_helth_center",
        healthCenterId: healthCenterId
      }
    });

    const allUsersToNotify = [...usersToNotify, ...headOfCommunityWorkers];

    const birthType = getBirthType(babies.length);

    const messageBody = `A new ${birthType.toLowerCase()} baby has been recorded in the system for ${motherName}.\n` +
      `Details:\nMother's Phone: ${motherPhone}\nFather's Name: ${fatherName}\nFather's Phone: ${fatherPhone}\n` +
      `Location: Sector - ${sectorName}, Cell - ${cellName}, Village - ${villageName}\n` +
      `Visit the system for more information.`;

    const notifications = allUsersToNotify.map(user => ({
      userID: user.id,
      title: `New ${birthType} Recorded for ${motherName}`,
      message: messageBody,
      status: "unread"
    }));

    if (notify && notify.notify === 'yes') {
      await Notifications.bulkCreate(notifications);

      // SMS
      await Promise.all(
        allUsersToNotify.map(user => sendSMS(user.phone, messageBody))
      );

      // Email
      const claim = { message: messageBody };
      await Promise.all(
        allUsersToNotify.map(user => new Email(user, claim).sendNotification())
      );
    }

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
        { model: HealthCenters, as: "healthCenter" },
        { model: Sectors, as: "sector" },
        { model: Cells, as: "cell" },
        { model: Villages, as: "village" },
        { model: Users, as: "recordedBy" },
        { model: Babies, as: "babies", },
        {
          model: Appointments,
          as: "appointments",
          include: [
            {
              model: AppointmentFeedbacks,
              as: "appointmentFeedback",
              // attributes: ["id", "weight", "feedback", "nextAppointmentDate", "status"],
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

const generateReport = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    let whereCondition = {};

    // Restrict data to the user's health center if they are head_of_community_workers_at_health_center
    if (req.user.role == "head_of_community_workers_at_health_center") {
      if (!req.user.healthCenterId) {
        return res.status(400).json({ message: "Missing healthCenterId for user" });
      }
      whereCondition.healthCenterId = req.user.healthCenterId; // Restricts to only their center
    }

    const { fromDate, toDate } = req.query;
    if (fromDate && toDate) {
      whereCondition.dateOfBirth = {
        [Op.gte]: new Date(fromDate),
        [Op.lte]: new Date(toDate),
      };
    } else if (fromDate) {
      whereCondition.dateOfBirth = { [Op.gte]: new Date(fromDate) };
    } else if (toDate) {
      whereCondition.dateOfBirth = { [Op.lte]: new Date(toDate) };
    }

    // Fetch birth records based on the condition
    const borns = await Borns.findAll({
      where: whereCondition, // Ensures correct filtering
      include: [
        { model: HealthCenters, as: "healthCenter" },
        { model: Sectors, as: "sector" },
        { model: Cells, as: "cell" },
        { model: Villages, as: "village" },
        { model: Users, as: "recordedBy" },
        { model: Babies, as: "babies" },
        {
          model: Appointments,
          as: "appointments",
          include: [
            {
              model: AppointmentFeedbacks,
              as: "appointmentFeedback",
              include: [{ model: Babies, as: "baby" }],
            },
          ],
        },
      ],
    });

    // Initialize summary
    const summary = {
      totalBirths: 0,
      birthsByDeliveryType: {
        "C-section": 0,
        "Normal": 0,
        "Assisted": 0,
      },
      birthsByStatus: {
        yes: 0,
        no: 0,
      },
    };

    if (req.user.role != "head_of_community_workers_at_health_center") {
      summary.birthsByHealthCenter = await getAllHealthCenters();
    } else {
      // Only fetch the specific health center
      summary.birthsByHealthCenter = await getmyHealthCenters(req.user.healthCenterId);
    }

    borns.forEach((born) => {
      summary.totalBirths++;

      if (req.user.role != "head_of_community_workers_at_health_center") {
        const healthCenterName = born.healthCenter?.name || "Unknown";
        if (summary.birthsByHealthCenter[healthCenterName] !== undefined) {
          summary.birthsByHealthCenter[healthCenterName]++;
        }
      }

      const deliveryType = born.deliveryType || "Unknown";
      if (summary.birthsByDeliveryType[deliveryType] !== undefined) {
        summary.birthsByDeliveryType[deliveryType]++;
      }

      const status = born.leave === "yes" ? "yes" : "no";
      summary.birthsByStatus[status]++;
    });

    const bornRecords = borns.map((born) => ({
      dateOfBirth: born.dateOfBirth,
      bornId: born.id,
      healthCenter: born.healthCenter?.name || "Unknown",
      motherName: born.motherName,
      deliveryType: born.deliveryType,
      leave: born.leave,
      babies: born.babies.map((baby) => ({
        babyName: baby.name,
        gender: baby.gender,
        birthWeight: baby.birthWeight,
        dischargeWeight: baby.dischargeWeight,
        medications: baby.medications.map((med) => med.name),
      })),
      appointments: born.appointments.map((appointment) => ({
        appointmentDate: appointment.date,
        feedback: appointment.appointmentFeedback.map((feedback) => ({
          feedbackText: feedback.feedback,
          nextAppointmentDate: feedback.nextAppointmentDate,
          status: feedback.status,
        })),
      })),
    }));

    return res.status(200).json({ bornRecords, summary });
  } catch (error) {
    console.error("Error generating report:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Helper function to get all health centers and initialize them with 0 births
async function getAllHealthCenters() {
  const healthCenters = await HealthCenters.findAll();
  const healthCentersMap = {};
  healthCenters.forEach((hc) => (healthCentersMap[hc.name] = 0));
  return healthCentersMap;
}

// Helper function to get only the logged-in user's health center
async function getmyHealthCenters(id) {
  const healthCenter = await HealthCenters.findByPk(id);
  if (!healthCenter) {
    return {};
  }
  return { [healthCenter.name]: 0 };
}


async function updateSettings(req, res) {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      // If no settings exist, create with 'yes' as default
      settings = await Settings.create({ notify: 'yes' });
      return res.status(200).json({ message: 'Notification enabled successfully.', settings });
    }

    // Toggle between 'yes' and 'no'
    const newNotifyValue = settings.notify === 'yes' ? 'no' : 'yes';

    await settings.update({ notify: newNotifyValue });

    const successMessage = newNotifyValue === 'yes'
      ? 'Notification enabled successfully.'
      : 'Notification disabled successfully.';

    return res.status(200).json({ message: successMessage, settings });

  } catch (error) {
    console.error('Error toggling settings:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getSettings(req, res) {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({ message: 'Settings not found.' });
    }

    const statusMessage = settings.notify === 'yes'
      ? 'Notifications are currently enabled.'
      : 'Notifications are currently disabled.';

    return res.status(200).json({
      message: statusMessage,
      settings,
    });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}








const getBornById = async (req, res) => {
  try {
    const { id } = req.params;
     let whereCondition = {};

    if (req.user.role == "head_of_community_workers_at_helth_center") {
      if (!req.user.healthCenterId) {
        return res.status(400).json({ message: "Missing healthCenterId for user" });
      }
      whereCondition = { healthCenterId: req.user.healthCenterId };
    }
    const born = await Borns.findByPk(id, {
      where: whereCondition,
      include: [
        { model: HealthCenters, as: "healthCenter"},
        { model: Sectors, as: "sector" },
        { model: Cells, as: "cell" },
        { model: Villages, as: "village" },
        { model: Users, as: "recordedBy" },
        { model: Babies, as: "babies",
          
          include: [
            {
              model: AppointmentFeedbacks,
              as: "appoitment_feedback",
              // attributes: ["id", "weight", "feedback", "nextAppointmentDate", "status"],
              // required: false, // Ensures feedback is retrieved only if available
              // where: { babyId: id }, // Only include feedback for the requested baby
              include: [
             
                { model: Appointments, as: "appointment" },
              ],
            },
          ],
        },
        {
          model: Appointments,
          as: "appointments",
          include: [
            {
              model: AppointmentFeedbacks,
              as: "appointmentFeedback",
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

const approveBorn = async (req, res) => {
  try {
    const notify = await Settings.findByPk(1); 

    const { id } = req.params;
    let userapprove=req.user;

    const born = await Borns.findByPk(id);
    if (!born) {
      return res.status(404).json({ message: "Born record not found" });
    }

    born.status = "approved";
    born.rejectReason = "";
    await born.save();

    const usersToNotify = await Users.findAll({
      where: {
        role: {
          [db.Sequelize.Op.in]: ["data_manager"]
        }
      }
    });

    const notifications = usersToNotify.map(user => ({
      userID: user.id,
      title: `Born for ${born.motherName} has been approved successfully `,
      message: `A Born birth has been approved by ${userapprove.firstname}  ${userapprove.lastname} / ${userapprove.phone}  in the system for ${born.motherName}. ` +
               `Details: \nMother's Phone: ${born.motherPhone}\n` +
               `\nDelivery Type: ${born.deliveryType}\n` +
               `Visit the system for more information.`,
      status: "unread"
    }));

    // Store notifications in the database
  

    if (notify && notify.notify === 'yes') {
      await Notifications.bulkCreate(notifications);
          // Send SMS notifications
          await Promise.all(
            usersToNotify.map(user => sendSMS(user.phone, `A Born birth has been approved by ${userapprove.firstname}  ${userapprove.lastname} / ${userapprove.phone} 
              in the system for ${born.motherName}. ` +
               `Details: \nMother's Phone: ${born.motherPhone}\n` +
               `Visit the system for more information.`))
    );

    // Email notification content
    let claim = {
      message: `A Born birth has been approved by ${userapprove.firstname}  ${userapprove.lastname} / ${userapprove.phone} 
                in the system for ${born.motherName}. ` +
               `Details: \nMother's Phone: ${born.motherPhone}\n` +
               `\nDelivery Type: ${born.deliveryType}\n` +
               `Visit the system for more information.`,
    };

     // Send email notifications
     await Promise.all(
      usersToNotify.map(user => new Email(user, claim).sendNotification())
    );

    }



    return res.status(200).json({ message: "Born record approved successfully", born });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const rejectBorn = async (req, res) => {
  try {
    const notify = await Settings.findByPk(1); 

    const { id } = req.params;
    let userreject=req.user;

    const born = await Borns.findByPk(id);
    if (!born) {
      return res.status(404).json({ message: "Born record not found" });
    }

    born.status = "rejected"; // Or use status code like 2
    born.rejectReason=req.body.rejectReason;
    await born.save();

    
    const usersToNotify = await Users.findAll({
      where: {
        role: {
          [db.Sequelize.Op.in]: ["data_manager"]
        }
      }
    });

    const notifications = usersToNotify.map(user => ({
      userID: user.id,
      title: `Born for ${born.motherName} has been rejected ! `,
      message: `A Born birth has been rejected by ${userreject.firstname}  ${userreject.lastname} / ${userreject.phone} becouse of ${req.body.rejectReason} in the system for ${born.motherName}. ` +
               `Details: \nMother's Phone: ${born.motherPhone}\n` +
               `\nDelivery Type: ${born.deliveryType}\n` +
               `Visit the system for more information.`,
      status: "unread"
    }));

    // Store notifications in the database

    if (notify && notify.notify === 'yes') {
      await Notifications.bulkCreate(notifications);

        // Send SMS notifications
    await Promise.all(
      usersToNotify.map(user => sendSMS(user.phone, `A Born birth has been rejected by ${userreject.firstname}  ${userreject.lastname} / ${userreject.phone}  becouse of ${req.body.rejectReason}
         in the system for ${born.motherName}. ` +
               `Details: \nMother's Phone: ${born.motherPhone}\n` +
               `Visit the system for more information.`))
    );

    // Email notification content
    let claim = {
      message: `A Born birth has been rejected by ${userreject.firstname}  ${userreject.lastname} / ${userreject.phone} becouse of ${req.body.rejectReason}
                in the system for ${born.motherName}. ` +
               `Details: \nMother's Phone: ${born.motherPhone}\n` +
               `\nDelivery Type: ${born.deliveryType}\n` +
               `Visit the system for more information.`,
    };

     // Send email notifications
     await Promise.all(
      usersToNotify.map(user => new Email(user, claim).sendNotification())
    );
    }

  

    return res.status(200).json({ message: "Born record rejected successfully", born });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const updateBorn = async (req, res) => {
  try {
    const notify = await Settings.findByPk(1); 

    const { id } = req.params;
    const { dateOfBirth, healthCenterId, motherName, motherPhone, 
       fatherName, fatherPhone,delivery_place,
      deliveryType, leave, status, sector_id, cell_id, village_id,comment,dateofvisit } = req.body;

      const healthCenter = await HealthCenters.findByPk(healthCenterId);
      if (!healthCenter) {
        return res.status(404).json({ message: "Health center not found." });
      }


    const [updated] = await Borns.update({ dateOfBirth, healthCenterId, motherName, motherPhone, 
      fatherName, fatherPhone,delivery_place,
     deliveryType, leave, status, sector_id, cell_id, village_id,comment,dateofvisit}, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ message: "Borns record not found" });
    }

    // Find users to notify
    const usersToNotify = await Users.findAll({
      where: {
        role: { [db.Sequelize.Op.in]: ["data_manager"] }
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
       `Mother's Phone: ${motherPhone}\n` +
      `Check the system for more details.`;

    // Create system notifications
    const notifications = allUsersToNotify.map(user => ({
      userID: user.id,
      title: `Updated Birth Record for ${motherName}`,
      message: notificationMessage,
      status: "unread"
    }));



    if (notify && notify.notify === 'yes') {
      await Notifications.bulkCreate(notifications);
          // Send SMS notifications
      await Promise.all(allUsersToNotify.map(user => sendSMS(user.phone, notificationMessage)));

    // Send email notifications
      let emailContent = { message: notificationMessage };

     await Promise.all(allUsersToNotify.map(user => new Email(user, emailContent).sendNotification()));


    }


    return res.status(200).json({ message: "Born record updated successfully! Notifications sent." });

  } catch (error) {
    console.error("Error updating born record:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Function to delete a born record
const deleteBorn = async (req, res) => {
  try {
    const notify = await Settings.findByPk(1); 

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
        role: { [db.Sequelize.Op.in]: ["data_manager"] }
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


    if (notify && notify.notify === 'yes') {

        await Notifications.bulkCreate(notifications);

        // Send SMS notifications
        await Promise.all(allUsersToNotify.map(user => sendSMS(user.phone, notificationMessage)));

        // Send email notifications
        let emailContent = { message: notificationMessage };

        await Promise.all(allUsersToNotify.map(user => new Email(user, emailContent).sendNotification()));
      

    }
  
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
  generateReport,
  approveBorn,
  rejectBorn,
  updateSettings,
  getSettings
};

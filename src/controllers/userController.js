import sendSMS from "../utils/sms.js"; // Assuming you have an SMS utility function
import Email from "../utils/mailer.js"; // Assuming you have an email utility function

import bcrypt from "bcrypt";
import {
  createUser,
  getUserByEmail,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  GetUserPassword,
  getallUsers,
  getUserByPhone,
  getUserByCode,
  updateUserCode,
  getMyUsers,
  getUserByNid

} from "../services/userService.js";
import {
  createNotification,
} from "../services/NotificationService";
import imageUploader from "../helpers/imageUplouder.js";
import db from "../database/models/index.js";
const { Users, Borns, Babies, Appointments, HealthCenters } = db;


export const changePassword = async (req, res) => {
  console.log(req.user.id)
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if ( !oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide userId, oldPassword, newPassword, and confirmPassword",
    });
  }

  try {
    const user = await GetUserPassword(req.user.id);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    console.log("Retrieved user from database:", user);

    const storedPassword = user || null;

    if (!storedPassword) {
      return res.status(500).json({
        success: false,
        message: "User password not found in the database",
      });
    }

    const validPassword = await bcrypt.compare(oldPassword, storedPassword);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid old password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updateUser(req.user.id, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const VALID_ROLES = ["head_of_community_workers_at_helth_center","data_manager","doctor"]; // Allowed roles
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/; // Validates international phone numbers

export const addUser = async (req, res) => {
  try {
    const { role, firstname, lastname, email, phone, healthCenterId } = req.body;

    // Validate required fields
    if (!role) return res.status(400).json({ success: false, message: "Please provide a role" });
    if (!VALID_ROLES.includes(role)) return res.status(400).json({ success: false, message: "Invalid role provided" });

    if (!firstname) return res.status(400).json({ success: false, message: "Please provide a firstname" });
    if (!lastname) return res.status(400).json({ success: false, message: "Please provide a lastname" });
    if (!email) return res.status(400).json({ success: false, message: "Please provide an email" });
    if (!phone) return res.status(400).json({ success: false, message: "Please provide a phone number" });

    // Validate phone number format
    if (!PHONE_REGEX.test(phone)) return res.status(400).json({ success: false, message: "Invalid phone number format" });

    
    // Special role requirement check
    if (role === "head_of_community_workers_at_health_center" && !healthCenterId) {
      return res.status(400).json({ success: false, message: "Please provide healthCenterId for this role" });
    }

    // Check if email or phone already exists
    const userExist = await getUserByEmail(email);
    if (userExist) return res.status(400).json({ success: false, message: "Email already exists" });

    const phoneExist = await getUserByPhone(phone);
    if (phoneExist) return res.status(400).json({ success: false, message: "Phone number has been used" });

    // Generate a password (defaulting to '1234' for now)
    const password = "1234";
    req.body.password = password;
    req.body.status = "active";

    // Create user
    const newUser = await createUser(req.body);
    newUser.password = password;
    // console.log(req.user.province_id)
    // send email
    await new Email(newUser).sendAccountAdded();

    await sendSMS(
      newUser.phone,
      `Welcome to the system! Your credentials are:\nEmail: ${newUser.email}\nPassword: ${password}`
    );

    const notification = await createNotification({ userID:newUser.id,title:"Account created for you", message:"your account has been created successfull", type:'account', isRead: false });
    

    // Send notification
    await createNotification({
      userID: newUser.id,
      title: "Account created for you",
      message: "Your account has been created successfully",
      type: "account",
      isRead: false,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
      
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};



export const getAllUsers = async (req, res) => {
  try { 
 
    let users = await getUsers();


   

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users:users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};






export const getOneUser = async (req, res) => {

  try {
    const user = await getUser(req.params.id);

       if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const updateOneUser = async (req, res) => {
  try {
    let image; 
    if (req.files && req.files.image) {
      try {
        image = await imageUploader(req);
        if (!image || !image.url) {
          throw new Error('Upload failed or image URL missing');
        }
        req.body.image = image.url;
        console.log(req.body.image)
      } catch (error) {
        console.error('Error uploading image:', error);
        // Handle error appropriately
      }
    }
    console.log(req.body.image)
    const user = await updateUser(req.params.id, req.body);
    if(req.params.id!=req.user.id){
      const notification = await createNotification({ userID:req.params.id,title:"your  account has been updated", message:"your account has been edited by admin", type:'account', isRead: false });
    
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};




export const deleteOneUser = async (req, res) => {
  try {
    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (req.user.role === "customer" && req.user.role !== "restaurentadmin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  
    const user = await deleteUser(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const activateOneUser = async (req, res) => {
  
  try {

    // let role = req.user.role;
    // if (role === "restaurentadmin") {
    //   if (req.body.role === "superadmin" || req.body.role === "restaurentadmin") {
    //     return res.status(400).json({
    //       success: false,
    //       message: "you are not allowed to add superadmin or restaurentadmin ",
    //     });
    //   }}


    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
 


    const user = await activateUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User activated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const deactivateOneUser = async (req, res) => {
  try {
    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
 
    const user = await deactivateUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};


export const checkEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide your Email",
    });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "There is no account associated with that email",
      });
    }

    // Generate a random 6-digit code including time string
    const timestamp = Date.now().toString().slice(-3); // Get the last 3 digits of the timestamp
    const randomPart = Math.floor(100 + Math.random() * 900).toString(); // Get a 3-digit random number
    const code = timestamp + randomPart; // Combine both parts to form a 6-digit code


    await new Email(user, null, code).sendResetPasswordCode();
    const user1 = await updateUserCode(email, {code:code});

    return res.status(200).json({
      success: true,
      message: "Code sent to your email successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const checkCode = async (req, res) => {
  const { code } = req.body;
  if (!req.params.email) {
    return res.status(400).json({
      success: false,
      message: "Please provide your Email",
    });
  }

  try {
    const user = await getUserByCode(req.params.email,code);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid code",
      });
    }

    return res.status(200).json({
      success: true,
      message: "now you can reset your password",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const ResetPassword = async (req, res) => {

  const user = await getUserByEmail(req.params.email);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "There is no account associated with that email",
    });
  }
  if (!user.code) {
    return res.status(400).json({
      success: false,
      message: "No Reset Code",
    });
  }
  const { newPassword, confirmPassword } = req.body;
  if ( !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide newPassword, and confirmPassword",
    });
  }

  try {

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updateUser(user.id, { password: hashedPassword,code:'' });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully, Login",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




import { USER_ROLES, APPOINTMENT_STATUSES } from "../constants/constants.js"; // Adjust the import path as necessary

export const getStatistics = async (req, res) => {
  try {
    // Count total users
    const totalUsers = await Users.count();

    // Count users by role
    const userRoles = await Users.findAll({
      attributes: ["role", [Users.sequelize.fn("COUNT", Users.sequelize.col("role")), "count"]],
      group: ["role"],
    });

    // Initialize all roles with zero
    const users = Object.values(USER_ROLES).reduce((acc, role) => {
      acc[role] = 0;
      return acc;
    }, {});

    // Update counts from the database query
    userRoles.forEach((user) => {
      users[user.role] = parseInt(user.dataValues.count, 10);
    });

    // Count total records
    const totalBorns = await Borns.count();
    const totalBabies = await Babies.count();
    const totalHealthCenters = await HealthCenters.count();

    // Count appointments by status
    const appointmentStatuses = await Appointments.findAll({
      attributes: ["status", [Appointments.sequelize.fn("COUNT", Appointments.sequelize.col("status")), "count"]],
      group: ["status"],
    });

    // Initialize all appointment statuses with zero
    const appointmentsByStatus = Object.values(APPOINTMENT_STATUSES).reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    // Update counts from the database query
    appointmentStatuses.forEach((appointment) => {
      appointmentsByStatus[appointment.status] = parseInt(appointment.dataValues.count, 10);
    });

    // Total appointments
    const totalAppointments = await Appointments.count();

    res.status(200).json({
      totalUsers,
      users,
      totalBorns,
      totalBabies,
      totalHealthCenters,
      totalAppointments,
      appointmentsByStatus,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Server error" });
  }
};



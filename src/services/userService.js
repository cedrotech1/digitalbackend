import bcrypt from "bcryptjs";
import db from "../database/models/index.js";
const users = db["Users"];
const { Provinces, Districts, Sectors, Cells, Villages,Categories,Users,Posts,Notifications} = db;


import Sequelize, { where } from "sequelize";

export const getMyUsers = async (id) => {
  try {
    const allUsers = await users.findAll({
      where: {
        role: 'citizen',
        village_id: id, // Corrected this line for proper AND condition
      },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Notifications,
          as: "notifications",
        },
        {
          model: Provinces,
          as: "province",
        },
        {
          model: Districts,
          as: "district",
        },
        {
          model: Sectors,
          as: "sector",
        },
        {
          model: Cells,
          as: "cell",
        },
        {
          model: Villages,
          as: "village",
        },
      ],
    });

    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};


export const getUsers = async () => {
  try {
    const allUsers = await users.findAll(
      {
      attributes: { exclude: ["password"] },
      include: [
         
        {
          model: Notifications,
          as: "notifications",
        },
        {
          model: Provinces,
          as: "province",
        },
        {
          model: Districts,
          as: "district",
        },
        {
          model: Sectors,
          as: "sector",
        },
        {
          model: Cells,
          as: "cell",
        },
        {
          model: Villages,
          as: "village",
        },
        
        
      ],
    }
  );

    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getUsers1 = async () => {
  try {
    const allUsers = await users.findAll({
      where:{role:'user'},
      attributes: { exclude: ["password"] },
      include: [
        {
          model: ProfileDetails,
          as: "ProfileDetails",  
          include: [
            {
              model: ProfileCategories,
              as: "category", 
            },
          ],

        },
        {
          model: Missions,
          as: "missions",
        },
        {
          model: Appointments,
          as: "appointments",
        },
      
        {
          model: Notifications,
          as: "notifications",
        },
        {
          model: Department,
          as: "department",
          include: [
            {
              model: users,
              as: "reader",
              attributes: { exclude: ["password"] }, // Exclude password
            },
          ],
        },
        
      ],
    });

    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};




export const updateUserWithRestaurant = async (userId, restaurantId) => {
  try {
    const userToUpdate = await users.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });

    if (userToUpdate) {
      await userToUpdate.update({ restaurents: restaurantId });
      const updatedUser = await users.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      return updatedUser;
    }
    

    return null;
  } catch (error) {
    console.error("Error updating user with restaurant:", error);
    throw error;
  }
};
export const createUser = async (user) => {
  // hashing password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const newUser = await users.create(user);
  return newUser;
};



export const createUserCustomer = async (user) => {
  // hashing password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const newUser = await users.create(user);
  return newUser;
};

export const getUser = async (id) => {
  const user = await users.findByPk(id, {
    attributes: { exclude: ["password"] },
    include: [
         
      {
        model: Notifications,
        as: "notifications",
      },
      {
        model: Provinces,
        as: "province",
      },
      {
        model: Districts,
        as: "district",
      },
      {
        model: Sectors,
        as: "sector",
      },
      {
        model: Cells,
        as: "cell",
      },
      {
        model: Villages,
        as: "village",
      },
      
      
    ],
  });
  return user;
};
export const GetUserPassword = async (id) => {
  const user = await users.findByPk(id, {
    attributes: ['password'],
  });
  return user ? user.password : null;
};


export const getUserByEmail = async (email) => {
  try {
    const user = await users.findOne({
      where: { email },
    });

    return user;
  } catch (error) {
    // Handle errors here
    console.error("Error fetching user:", error);
    throw error;
  }
};


export const getUserByNid = async (nid) => {
  try {
    const user = await users.findOne({
      where: { nid },
    });

    return user;
  } catch (error) {
    // Handle errors here
    console.error("Error fetching user:", error);
    throw error;
  }
};





export const getUserByPhone = async (phone) => {
  try {
    const user = await users.findOne({
      where: { phone }

    });

    return user;
  } catch (error) {
    // Handle errors here
    console.error("Error fetching user:", error);
    throw error;
  }
};



export const getallUsers = async () => {
  const allUsers = await users.findAll({
    // where: { restaurents },
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Notifications,
        as: "notifications",
      },
      {
        model: Provinces,
        as: "province",
      },
      {
        model: Districts,
        as: "district",
      },
      {
        model: Sectors,
        as: "sector",
      },
      {
        model: Cells,
        as: "cell",
      },
      {
        model: Villages,
        as: "village",
      },
    ],
  });
  return allUsers;
};



export const updateUser = async (id, user) => {
  const userToUpdate = await users.findOne(
    { where: { id } },
    { attributes: { exclude: ["password"] } }
  );
  if (userToUpdate) {
    await users.update(user, { where: { id } });
    return user;
  }
  return null;
};

export const deleteUser = async (id) => {
  const userToDelete = await users.findOne({ where: { id } });
  if (userToDelete) {
    await users.destroy({ where: { id } });
    return userToDelete;
  }
  return null;
};

export const activateUser = async (id) => {
  const userToActivate = await users.findOne(
    { where: { id } },
    { attributes: { exclude: ["password"] } }
  );
  if (userToActivate) {
    await users.update({ status: "active" }, { where: { id } });
    return userToActivate;
  }
  return null;
};

export const deactivateUser = async (id) => {
  const userToDeactivate = await users.findOne(
    { where: { id } },
    { attributes: { exclude: ["password"] } }
  );
  if (userToDeactivate) {
    await users.update({ status: "inactive" }, { where: { id } });
    return userToDeactivate;
  }
  return null;
};


export const updateUserCode = async (email, user) => {
  const userToUpdate = await users.findOne(
    { where: { email } },
    { attributes: { exclude: ["password"] } }
  );
  if (userToUpdate) {
    await users.update(user, { where: { email } });
    return user;
  }
  return null;
};
export const getUserByCode = async (email,code) => {
  try {
    const user = await users.findOne(
      {
        where: { code: code ,email:email},
      }
    );

    return user;
  } catch (error) {
    // Handle errors here
    console.error("Error fetching user:", error);
    throw error;
  }
};
import express from 'express';
import {
  addUser,
  deleteOneUser,
  getAllUsers,
  getOneUser,
  updateOneUser,
  activateOneUser,
  deactivateOneUser,
  changePassword,
  checkEmail,
  checkCode,
  ResetPassword,
  SignUp,
  getCitizen
} from '../controllers/userController.js';
import { protect } from '../middlewares/protect.js';
import multer from 'multer';
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/', protect, getAllUsers);
router.get('/citizen', protect, getCitizen);
router.get('/:id', protect, getOneUser);
router.post('/addUser', protect, addUser);
router.post('/signup', SignUp);
router.put('/update/:id', protect, updateOneUser);
router.delete('/delete/:id', protect, deleteOneUser);
router.put('/activate/:id', protect, activateOneUser);
router.put('/deactivate/:id', protect, deactivateOneUser);
router.put('/changePassword', protect, changePassword);

router.post('/check', checkEmail);
router.post('/code/:email', checkCode);
router.put('/resetPassword/:email', ResetPassword);

export default router;

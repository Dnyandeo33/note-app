import express from 'express';
import userController from '../controllers/user.js';
import verifyJWT from '../middlewares/verifyJwt.js';

const { getAllUsers, createNewUser, updateUser, deleteUser } = userController;
const router = express.Router();

router.route('/')
    .get(verifyJWT, getAllUsers)
    .post(createNewUser)
    .put(updateUser)
    .delete(deleteUser)

export default router;
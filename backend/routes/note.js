import express from 'express';
import noteControllers from '../controllers/note.js';
import verifyJWT from '../middlewares/verifyJwt.js';
const { getAllNotes, createNewNote, updateNote, deleteNote } = noteControllers;


const router = express.Router()
router.use(verifyJWT)

router.route('/')
    .get(getAllNotes)
    .post(createNewNote)
    .patch(updateNote)
    .delete(deleteNote)

export default router

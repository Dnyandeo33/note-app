import User from '../models/User.js'
import Note from '../models/note.js'

const noteControllers = {
    // @desc Get all notes 
    // @route GET /notes
    // @access Private
    getAllNotes: async (req, res) => {
        try {
            const notes = await Note.find().lean()
            if (!notes?.length) return res.status(400).json({ message: 'No notes found' })


            const notesWithUser = await Promise.all(notes.map(async (note) => {
                const user = await User.findById(note.user)
                return { ...note, user }
            }))

            return res.status(200).json({ Success: true, usersNotes: notesWithUser })
        } catch (error) {
            return res.status(500).json({ Success: false, message: error.message })
        }
    },

    // @desc Create new note
    // @route POST /notes
    // @access Private
    createNewNote: async (req, res) => {
        try {
            const { user, title, text } = req.body;
            if (!user || !title || !text) return res.status(400).json({ Success: false, message: 'All fields are required' })

            const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

            if (duplicate) return res.status(409).json({ Success: false, message: 'Duplicate note title' })

            const note = await Note.create({ user, title, text })

            if (note) {
                return res.status(201).json({ Success: true, message: 'New note created' })
            } else {
                return res.status(400).json({ Success: false, message: 'Invalid note data received' })
            }
        } catch (error) {
            return res.status(500).json({ Success: false, message: error.message })
        }
    },

    // @desc Update a note
    // @route PATCH /notes
    // @access Private
    updateNote: async (req, res) => {
        try {
            const { id, user, title, text, completed } = req.body;

            if (!id || !user || !title || !text || typeof completed !== 'boolean') return res.status(400).json({ Success: false, message: 'All fields are required' })

            const note = await Note.findById(id).exec()

            if (!note) {
                return res.status(400).json({ Success: false, message: 'Note not found' })
            }

            const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

            if (duplicate && duplicate?._id.toString() !== id) {
                return res.status(409).json({ message: 'Duplicate note title' })
            }

            note.user = user
            note.title = title
            note.text = text
            note.completed = completed

            const updatedNote = await note.save()

            return res.status(200).json({ Success: true, message: `'${updatedNote.title}' updated` })

        } catch (error) {
            return res.status(500).json({ Success: false, message: error.message })

        }
    },

    // @desc Delete a note
    // @route DELETE /notes
    // @access Private
    deleteNote: async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ Success: false, message: 'Note ID required' })
            }

            const note = await Note.findById(id).exec()

            if (!note) {
                return res.status(400).json({ Success: false, message: 'Note not found' })
            }

            const result = await note.deleteOne()
            if (result.deletedCount > 0) {
                return res.status(200).json({ Success: true, message: `Note with ${id} deleted!` })
            } else {
                return res.status(400).json({ Success: false, message: `Note with ${id} doesn't exist` })
            }
        } catch (error) {
            return res.status(500).json({ Success: false, message: error.message })
        }
    }
}

export default noteControllers
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Note from '../models/note.js';

const userController = {
    // @desc Get all users
    // @route GET /users
    // @access Private

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select("-password").lean()
            if (!users?.length) return res.status(400).json({ Success: false, message: 'No users found' })
            return res.status(200).json({ Success: true, users: users })
        } catch (error) {
            return res.status(500).json({ Success: false, message: error.message })

        }
    },

    // @desc Create new user
    // @route POST /users
    // @access Private
    createNewUser: async (req, res) => {
        try {
            const { username, password, roles } = req.body
            if (!username || !password)
                return res.status(400).json({ Success: false, message: 'All fields are required' })

            const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()
            if (duplicate) return res.status(409).json({ Success: false, message: 'Duplicate username' })

            const hashedPwd = await bcrypt.hash(password, 10)

            const userObject = (!Array.isArray(roles) || !roles.length)
                ? { username, password: hashedPwd }
                : { username, "password": hashedPwd, roles }

            const user = await User.create(userObject)

            if (user) {
                return res.status(201).json({ Success: true, message: `New user ${username} created` })
            } else {
                return res.status(400).json({ Success: false, message: 'Invalid user data received' })
            }

        } catch (error) {
            return res.status(500).json({ Success: false, message: error.message })

        }
    },

    // @desc Update a user
    // @route PATCH /users
    // @access Private
    updateUser: async (req, res) => {
        try {
            const { id, username, roles, active, password } = req.body
            if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean')
                return res.status(400).json({ Success: false, message: 'All fields except password are required' })

            const user = await User.findById(id).exec()

            if (!user) return res.status(400).json({ Success: false, message: 'User not found' })

            const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

            if (duplicate && duplicate?._id.toString() !== id) return res.status(409).json({ Success: false, message: 'Duplicate username' })

            user.username = username
            user.roles = roles
            user.active = active

            if (password) user.password = await bcrypt.hash(password, 10)
            const updatedUser = await user.save()
            return res.status(200).json({ Success: true, message: `${updatedUser.username} updated` })

        } catch (error) {
            return res.status(500).json({ Success: false, message: error.message })

        }
    },

    // @desc Delete a user
    // @route DELETE /users
    // @access Private
    deleteUser: async (req, res) => {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({ message: 'User ID Required' })

            const note = await Note.findOne({ user: id }).lean().exec()
            if (note) {
                return res.status(400).json({ message: 'User has assigned notes' })
            }

            const user = await User.findById(id).exec()

            if (!user) {
                return res.status(400).json({ message: 'User not found' })
            }

            const result = await user.deleteOne()
            if (result.deletedCount > 0) {
                return res.status(200).json({ Success: true, message: `User with ${id} deleted!` })
            } else {
                return res.status(400).json({ Success: false, message: `User with ${id} doesn't exist` })
            }

        } catch (error) {
            return res.status(500).json({ Success: false, message: error.message })
        }
    }
}
export default userController;


const User = require("../models/user.model"); 

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = UserController;
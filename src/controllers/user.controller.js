const User = require("../models/user.model"); 
const { sendEmail } = require("../services/emailService"); 

class UserController {
    // Get all users 
    async getAllUsers(req, res) {
        try {
            const users = await User.find({}, 'first_name last_name email role');  
            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Delete inactive users 
    async deleteInactiveUsers(req, res) {
        try {
            const cutoffDate = new Date(Date.now() - 60 * 60 * 1000); 
            const inactiveUsers = await User.find({ lastConnection: { $lt: cutoffDate } });

            for (const user of inactiveUsers) {
                await sendEmail(user.email, 'Account Deleted due to Inactivity', 'Your account has been deleted due to inactivity.');
                await user.deleteOne();
            }

            res.status(200).json({ message: `${inactiveUsers.length} users deleted due to inactivity.` });
        } catch (error) {
            console.error('Error deleting inactive users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Update User Role 
    async updateUserRole(req, res) {
        try {
            const { uid } = req.params;
            const { role } = req.body;

            const user = await User.findById(uid);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            user.role = role;
            await user.save();

            res.status(200).json({ message: "User role updated successfully" });
        } catch (error) {
            console.error('Error updating user role:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = UserController;
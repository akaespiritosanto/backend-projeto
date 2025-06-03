const User = require('../db_sequelize.js').User;


async function getAllUsers(req, res) {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addUser(req, res) {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ 
            message: "User created successfully",
            id: newUser.user_id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteUser(req, res) {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const deletedCount = await User.destroy({
            where: { user_id: userId }
        });
        
        if (deletedCount > 0) {
            res.json({ message: "User deleted", count: deletedCount });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateUser(req, res) {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const [updatedCount] = await User.update(req.body, {
            where: { user_id: userId }
        });

        if (updatedCount > 0) {
            const updatedUser = await User.findOne({
                where: { user_id: userId }
            });
            res.json({
                message: "User updated successfully",
                user: updatedUser
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllUsers,
    addUser,
    deleteUser,
    updateUser
};
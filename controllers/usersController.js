const User = require('../db_sequelize.js').User;

async function getAllUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Não retornar senhas
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getUserById(req, res) {
    const userId = req.params.id;
    
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] } // Não retornar senha
        });
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createUser(req, res) {
    try {
        // Verificar se o email já existe
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        
        // Verificar se o username já existe
        const existingUsername = await User.findOne({ where: { username: req.body.username } });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }
        
        const newUser = await User.create(req.body);
        
        // Não retornar a senha na resposta
        const { password, ...userWithoutPassword } = newUser.toJSON();
        
        res.status(201).json({ 
            message: "User created successfully", 
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser
};

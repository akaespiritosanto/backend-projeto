const Message = require('../db_sequelize.js').Message;
const User = require('../db_sequelize.js').User;
const Chat = require('../db_sequelize.js').Chat;

async function getMessageById(req, res) {
    const messageId = req.params.id;
    const userId = req.query.userId;
    
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    
    try {
        const message = await Message.findByPk(messageId, {
            include: [
                { model: User, attributes: ['user_id', 'username'] },
                { model: Chat }
            ]
        });
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        
        // Verificar se o usuário é participante do chat
        const chat = await Chat.findByPk(message.chat_id);
        
        if (userId != chat.buyer_id && userId != chat.seller_id) {
            return res.status(403).json({ message: "You don't have permission to view this message" });
        }
        
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateMessage(req, res) {
    const messageId = req.params.id;
    const userId = req.body.user_id;
    
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    
    try {
        const message = await Message.findByPk(messageId);
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        
        // Verificar se o usuário é o remetente da mensagem
        if (message.sender_id != userId) {
            return res.status(403).json({ message: "You can only edit your own messages" });
        }
        
        // Verificar se a mensagem foi enviada há menos de 5 minutos
        const messageTime = new Date(message.created_at).getTime();
        const currentTime = new Date().getTime();
        const fiveMinutesInMs = 5 * 60 * 1000;
        
        if (currentTime - messageTime > fiveMinutesInMs) {
            return res.status(403).json({ message: "Messages can only be edited within 5 minutes of sending" });
        }
        
        await message.update({ content: req.body.content });
        
        // Obter a mensagem atualizada com informações do usuário
        const updatedMessage = await Message.findByPk(messageId, {
            include: [
                { model: User, attributes: ['user_id', 'username'] }
            ]
        });
        
        res.json({
            message: "Message updated successfully",
            message: updatedMessage
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteMessage(req, res) {
    const messageId = req.params.id;
    const userId = req.body.user_id;
    
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    
    try {
        const message = await Message.findByPk(messageId);
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        
        // Verificar se o usuário é o remetente da mensagem
        if (message.sender_id != userId) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }
        
        await message.destroy();
        
        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getMessageById,
    updateMessage,
    deleteMessage
};



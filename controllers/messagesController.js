const Message = require('../db_sequelize.js').Message;
const Chat = require('../db_sequelize.js').Chat;
const User = require('../db_sequelize.js').User;

async function getMessageById(req, res) {
    const messageId = req.params.id;
    const userId = req.query.userId; // For security check
    
    try {
        const message = await Message.findByPk(messageId, {
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['user_id', 'username']
                },
                {
                    model: Chat
                }
            ]
        });
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        
        // Security check: only chat participants can access messages
        const chat = await Chat.findByPk(message.chat_id);
        if (chat.buyer_id !== parseInt(userId) && chat.seller_id !== parseInt(userId)) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateMessage(req, res) {
    const messageId = req.params.id;
    const userId = req.body.user_id; // For security check
    const { content } = req.body;
    
    try {
        // Find the message first
        const message = await Message.findByPk(messageId);
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        
        // Security check: only sender can update their message
        if (message.sender_id !== parseInt(userId)) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Update message
        await Message.update(
            { content },
            { where: { message_id: messageId } }
        );
        
        const updatedMessage = await Message.findByPk(messageId, {
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['user_id', 'username']
                }
            ]
        });
        
        res.json({
            message: "Message updated successfully",
            data: updatedMessage
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteMessage(req, res) {
    const messageId = req.params.id;
    const userId = req.body.user_id; // For security check
    
    try {
        // Find the message first
        const message = await Message.findByPk(messageId);
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        
        // Security check: only sender can delete their message
        if (message.sender_id !== parseInt(userId)) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Delete message
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
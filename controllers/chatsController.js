const Chat = require('../db_sequelize.js').Chat;
const Message = require('../db_sequelize.js').Message;
const User = require('../db_sequelize.js').User;
const Ad = require('../db_sequelize.js').Ad;
const { sequelize } = require('../db_sequelize.js');

async function getUserChats(req, res) {
    const userId = req.params.userId;
    
    try {
        const chats = await Chat.findAll({
            where: {
                [sequelize.Op.or]: [
                    { buyer_id: userId },
                    { seller_id: userId }
                ]
            },
            include: [
                { 
                    model: Ad,
                    attributes: ['ad_id', 'title', 'product_name', 'price']
                },
                {
                    model: User,
                    as: 'buyer',
                    attributes: ['user_id', 'username']
                },
                {
                    model: User,
                    as: 'seller',
                    attributes: ['user_id', 'username']
                },
                {
                    model: Message,
                    limit: 1,
                    order: [['sent_at', 'DESC']],
                    include: [
                        {
                            model: User,
                            as: 'sender',
                            attributes: ['user_id', 'username']
                        }
                    ]
                }
            ],
            order: [
                [Message, 'sent_at', 'DESC']
            ]
        });
        
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getChatById(req, res) {
    const chatId = req.params.id;
    const userId = req.query.userId; // For security check
    
    try {
        const chat = await Chat.findByPk(chatId, {
            include: [
                { 
                    model: Ad,
                    attributes: ['ad_id', 'title', 'product_name', 'price']
                },
                {
                    model: User,
                    as: 'buyer',
                    attributes: ['user_id', 'username']
                },
                {
                    model: User,
                    as: 'seller',
                    attributes: ['user_id', 'username']
                }
            ]
        });
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        
        // Security check: only participants can access the chat
        if (chat.buyer_id !== parseInt(userId) && chat.seller_id !== parseInt(userId)) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Get messages
        const messages = await Message.findAll({
            where: { chat_id: chatId },
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['user_id', 'username']
                }
            ],
            order: [['sent_at', 'ASC']]
        });
        
        res.json({
            chat,
            messages
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createChat(req, res) {
    const { ad_id, buyer_id } = req.body;
    
    try {
        // Check if ad exists
        const ad = await Ad.findByPk(ad_id);
        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }
        
        // Get seller ID from ad
        const seller_id = ad.user_id;
        
        // Check if buyer is not the seller
        if (parseInt(buyer_id) === seller_id) {
            return res.status(400).json({ message: "You cannot chat with yourself" });
        }
        
        // Check if chat already exists
        const existingChat = await Chat.findOne({
            where: {
                ad_id,
                buyer_id
            }
        });
        
        if (existingChat) {
            return res.json({
                message: "Chat already exists",
                chat_id: existingChat.chat_id
            });
        }
        
        // Create new chat
        const newChat = await Chat.create({
            ad_id,
            buyer_id,
            seller_id
        });
        
        res.status(201).json({
            message: "Chat created successfully",
            chat_id: newChat.chat_id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function sendMessage(req, res) {
    const { chat_id, sender_id, content } = req.body;
    
    try {
        // Check if chat exists
        const chat = await Chat.findByPk(chat_id);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        
        // Security check: only participants can send messages
        if (chat.buyer_id !== parseInt(sender_id) && chat.seller_id !== parseInt(sender_id)) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Create new message
        const newMessage = await Message.create({
            chat_id,
            sender_id,
            content
        });
        
        // Get the message with sender info
        const message = await Message.findByPk(newMessage.message_id, {
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['user_id', 'username']
                }
            ]
        });
        
        res.status(201).json({
            message: "Message sent successfully",
            data: message
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteChat(req, res) {
    const chatId = req.params.id;
    const userId = req.body.user_id; // For security check
    
    try {
        // Find the chat first
        const chat = await Chat.findByPk(chatId);
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        
        // Security check: only participants can delete the chat
        if (chat.buyer_id !== parseInt(userId) && chat.seller_id !== parseInt(userId)) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Delete all messages in the chat first
        await Message.destroy({
            where: { chat_id: chatId }
        });
        
        // Then delete the chat
        await chat.destroy();
        
        res.json({ message: "Chat and all messages deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateChatStatus(req, res) {
    const chatId = req.params.id;
    const userId = req.body.user_id; // For security check
    const { status } = req.body;
    
    try {
        // Find the chat first
        const chat = await Chat.findByPk(chatId);
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        
        // Security check: only participants can update the chat
        if (chat.buyer_id !== parseInt(userId) && chat.seller_id !== parseInt(userId)) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Update chat status (if your Chat model has a status field)
        await Chat.update(
            { status },
            { where: { chat_id: chatId } }
        );
        
        const updatedChat = await Chat.findByPk(chatId);
        
        res.json({
            message: "Chat status updated successfully",
            chat: updatedChat
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserChats,
    getChatById,
    createChat,
    sendMessage,
    deleteChat,
    updateChatStatus
};

const Chat = require('../db_sequelize.js').Chat;
const Message = require('../db_sequelize.js').Message;
const User = require('../db_sequelize.js').User;
const Ad = require('../db_sequelize.js').Ad;

async function getAllChats(req, res) {
    try {
        const chats = await Chat.findAll({
            include: [
                { model: User, as: 'Buyer', attributes: ['user_id', 'username'] },
                { model: User, as: 'Seller', attributes: ['user_id', 'username'] },
                { model: Ad, attributes: ['ad_id', 'title'] }
            ],
            order: [['created_at', 'DESC']]
        });
        
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getChatById(req, res) {
    const chatId = req.params.id;
    
    try {
        const chat = await Chat.findByPk(chatId, {
            include: [
                { model: User, as: 'Buyer', attributes: ['user_id', 'username'] },
                { model: User, as: 'Seller', attributes: ['user_id', 'username'] },
                { model: Ad, attributes: ['ad_id', 'title'] }
            ]
        });
        
        if (chat) {
            res.json(chat);
        } else {
            res.status(404).json({ message: "Chat not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createChat(req, res) {
    try {
        // Verificar se o anúncio existe
        const ad = await Ad.findByPk(req.body.ad_id);
        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }
        
        // Verificar se os usuários existem
        const buyer = await User.findByPk(req.body.buyer_id);
        const seller = await User.findByPk(req.body.seller_id);
        
        if (!buyer || !seller) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Verificar se já existe um chat entre esses usuários para este anúncio
        const existingChat = await Chat.findOne({
            where: {
                ad_id: req.body.ad_id,
                buyer_id: req.body.buyer_id,
                seller_id: req.body.seller_id
            }
        });
        
        if (existingChat) {
            return res.status(400).json({ 
                message: "Chat already exists", 
                chat: existingChat 
            });
        }
        
        const newChat = await Chat.create(req.body);
        
        // Obter o chat com informações dos usuários e anúncio
        const chat = await Chat.findByPk(newChat.chat_id, {
            include: [
                { model: User, as: 'Buyer', attributes: ['user_id', 'username'] },
                { model: User, as: 'Seller', attributes: ['user_id', 'username'] },
                { model: Ad, attributes: ['ad_id', 'title'] }
            ]
        });
        
        res.status(201).json({ 
            message: "Chat created successfully", 
            chat
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getChatMessages(req, res) {
    const chatId = req.params.id;
    
    try {
        const chat = await Chat.findByPk(chatId);
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        
        const messages = await Message.findAll({
            where: { chat_id: chatId },
            include: [
                { model: User, attributes: ['user_id', 'username'] }
            ],
            order: [['created_at', 'ASC']]
        });
        
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function sendMessage(req, res) {
    const chatId = req.params.id;
    
    try {
        const chat = await Chat.findByPk(chatId);
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        
        // Verificar se o remetente é participante do chat
        if (req.body.sender_id != chat.buyer_id && req.body.sender_id != chat.seller_id) {
            return res.status(403).json({ message: "You are not a participant in this chat" });
        }
        
        const newMessage = await Message.create({
            chat_id: chatId,
            sender_id: req.body.sender_id,
            content: req.body.content
        });
        
        // Obter a mensagem com informações do usuário
        const message = await Message.findByPk(newMessage.message_id, {
            include: [
                { model: User, attributes: ['user_id', 'username'] }
            ]
        });
        
        res.status(201).json({ 
            message: "Message sent successfully", 
            message
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllChats,
    getChatById,
    createChat,
    getChatMessages,
    sendMessage
};


const Comment = require('../db_sequelize.js').Comment;
const User = require('../db_sequelize.js').User;
const Ad = require('../db_sequelize.js').Ad;

async function getAllComments(req, res) {
    try {
        const comments = await Comment.findAll({
            include: [
                { model: User, attributes: ['user_id', 'username'] }
            ],
            order: [['created_at', 'DESC']]
        });
        
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCommentById(req, res) {
    const commentId = req.params.id;
    
    try {
        const comment = await Comment.findByPk(commentId, {
            include: [
                { model: User, attributes: ['user_id', 'username'] }
            ]
        });
        
        if (comment) {
            res.json(comment);
        } else {
            res.status(404).json({ message: "Comment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCommentsByAd(req, res) {
    const adId = req.params.adId;
    
    try {
        const comments = await Comment.findAll({
            where: { ad_id: adId },
            include: [
                { model: User, attributes: ['user_id', 'username'] }
            ],
            order: [['created_at', 'DESC']]
        });
        
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createComment(req, res) {
    try {
        // Check if ad exists
        const ad = await Ad.findByPk(req.body.ad_id);
        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }
        
        const newComment = await Comment.create(req.body);
        
        // Get the comment with user info
        const comment = await Comment.findByPk(newComment.comment_id, {
            include: [{ model: User, attributes: ['user_id', 'username'] }]
        });
        
        res.status(201).json({ 
            message: "Comment added successfully", 
            comment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateComment(req, res) {
    const commentId = req.params.id;

    if (!commentId) {
        return res.status(400).json({ error: "Comment ID is required" });
    }

    try {
        const [updatedCount] = await Comment.update(
            { comment: req.body.comment },
            { where: { comment_id: commentId, user_id: req.body.user_id } }
        );

        if (updatedCount > 0) {
            const updatedComment = await Comment.findByPk(commentId, {
                include: [{ model: User, attributes: ['user_id', 'username'] }]
            });
            
            res.json({
                message: "Comment updated successfully",
                comment: updatedComment
            });
        } else {
            res.status(404).json({ message: "Comment not found or you don't have permission" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteComment(req, res) {
    const commentId = req.params.id;
    const userId = req.body.user_id; // Assuming user ID is passed in the request body

    if (!commentId) {
        return res.status(400).json({ error: "Comment ID is required" });
    }

    try {
        const deletedCount = await Comment.destroy({
            where: { 
                comment_id: commentId,
                user_id: userId // Only allow users to delete their own comments
            }
        });
        
        if (deletedCount > 0) {
            res.json({ message: "Comment deleted", count: deletedCount });
        } else {
            res.status(404).json({ message: "Comment not found or you don't have permission" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllComments,
    getCommentById,
    getCommentsByAd,
    createComment,
    updateComment,
    deleteComment
};


const Review = require('../db_sequelize.js').Review;
const User = require('../db_sequelize.js').User;

async function getUserReviews(req, res) {
    const userId = req.params.userId;
    
    try {
        const reviews = await Review.findAll({
            where: { reviewed_user_id: userId },
            include: [
                {
                    model: User,
                    as: 'reviewer',
                    attributes: ['user_id', 'username']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createReview(req, res) {
    const { user_id, reviewed_user_id, rating, comment } = req.body;
    
    try {
        // Check if users exist
        const reviewer = await User.findByPk(user_id);
        const reviewedUser = await User.findByPk(reviewed_user_id);
        
        if (!reviewer || !reviewedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if user is not reviewing themselves
        if (parseInt(user_id) === parseInt(reviewed_user_id)) {
            return res.status(400).json({ message: "You cannot review yourself" });
        }
        
        // Check if review already exists
        const existingReview = await Review.findOne({
            where: {
                user_id,
                reviewed_user_id
            }
        });
        
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this user" });
        }
        
        // Create new review
        const newReview = await Review.create({
            user_id,
            reviewed_user_id,
            rating,
            comment
        });
        
        // Get the review with user info
        const review = await Review.findByPk(newReview.review_id, {
            include: [
                {
                    model: User,
                    as: 'reviewer',
                    attributes: ['user_id', 'username']
                }
            ]
        });
        
        res.status(201).json({
            message: "Review added successfully",
            review
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateReview(req, res) {
    const reviewId = req.params.id;
    const userId = req.body.user_id; // For security check
    const { rating, comment } = req.body;
    
    try {
        // Find the review first
        const review = await Review.findByPk(reviewId);
        
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        // Security check: only reviewer can update their review
        if (review.user_id !== parseInt(userId)) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Update review
        await Review.update(
            { rating, comment },
            { where: { review_id: reviewId } }
        );
        
        const updatedReview = await Review.findByPk(reviewId, {
            include: [
                {
                    model: User,
                    as: 'reviewer',
                    attributes: ['user_id', 'username']
                }
            ]
        });
        
        res.json({
            message: "Review updated successfully",
            review: updatedReview
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteReview(req, res) {
    const reviewId = req.params.id;
    const userId = req.body.user_id; // For security check
    
    try {
        // Find the review first
        const review = await Review.findByPk(reviewId);
        
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        // Security check: only reviewer can delete their review
        if (review.user_id !== parseInt(userId)) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Delete review
        await review.destroy();
        
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserReviews,
    createReview,
    updateReview,
    deleteReview
};
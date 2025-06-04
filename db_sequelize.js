const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:password@localhost:3306/ProjetoBE');


const User = require('./models/User.js')(sequelize, Model, DataTypes);
const UserActivity = require('./models/UserActivity.js')(sequelize, Model, DataTypes);
const Review = require('./models/Review.js')(sequelize, Model, DataTypes);
const Notification = require('./models/Notification.js')(sequelize, Model, DataTypes);
const Message = require('./models/Message.js')(sequelize, Model, DataTypes);
const Follow = require('./models/Follows.js')(sequelize, Model, DataTypes);
const Comment = require('./models/Comment.js')(sequelize, Model, DataTypes);
const Chat= require('./models/Chat.js')(sequelize, Model, DataTypes);
const Category = require('./models/Category.js')(sequelize, Model, DataTypes);
const Ad= require('./models/Ad.js')(sequelize, Model, DataTypes);
const AdImage = require('./models/AdImage.js')(sequelize, Model, DataTypes);

// User Associations
User.hasMany(Ad, {foreignKey: 'user_id'});
User.hasMany(Comment, {foreignKey: 'user_id'});
User.hasMany(Review, {foreignKey: 'user_id', as: 'reviewsGiven'});
User.hasMany(Review, {foreignKey: 'reviewed_user_id', as: 'reviewsReceived'});
User.hasMany(UserActivity, {foreignKey: 'user_id'});
User.hasMany(Follow, {foreignKey: 'user_id'});
User.hasMany(Notification, {foreignKey: 'user_id'});
User.hasMany(Chat, {foreignKey: 'buyer_id', as: 'buyerChats'});
User.hasMany(Chat, {foreignKey: 'seller_id', as: 'sellerChats'});
User.hasMany(Message, {foreignKey: 'sender_id', as: 'sentMessages'});

// Ad Associations
Ad.belongsTo(User, {foreignKey: 'user_id'});
Ad.belongsTo(Category, {foreignKey: 'category_id'});
Ad.hasMany(AdImage, {foreignKey: 'ad_id'});
Ad.hasMany(Comment, {foreignKey: 'ad_id'});
Ad.hasMany(UserActivity, {foreignKey: 'ad_id'});
Ad.hasMany(Follow, {foreignKey: 'ad_id'});
Ad.hasMany(Chat, {foreignKey: 'ad_id'});

// Category Associations
Category.hasMany(Ad, {foreignKey: 'category_id'});

// AdImage Associations
AdImage.belongsTo(Ad, {foreignKey: 'ad_id'});

// Comment Associations
Comment.belongsTo(User, {foreignKey: 'user_id'});
Comment.belongsTo(Ad, {foreignKey: 'ad_id'});

// Review Associations
Review.belongsTo(User, {foreignKey: 'user_id', as: 'reviewer'});
Review.belongsTo(User, {foreignKey: 'reviewed_user_id', as: 'reviewedUser'});

// UserActivity Associations
UserActivity.belongsTo(User, {foreignKey: 'user_id'});
UserActivity.belongsTo(Ad, {foreignKey: 'ad_id'});

// Follow Associations
Follow.belongsTo(User, {foreignKey: 'user_id'});
Follow.belongsTo(Ad, {foreignKey: 'ad_id'});

// Notification Associations
Notification.belongsTo(User, {foreignKey: 'user_id'});

// Chat Associations
Chat.belongsTo(Ad, {foreignKey: 'ad_id'});
Chat.belongsTo(User, {foreignKey: 'buyer_id', as: 'buyer'});
Chat.belongsTo(User, {foreignKey: 'seller_id', as: 'seller'});
Chat.hasMany(Message, {foreignKey: 'chat_id'});

// Message Associations
Message.belongsTo(Chat, {foreignKey: 'chat_id'});
Message.belongsTo(User, {foreignKey: 'sender_id', as: 'sender'});



if (require.main === module) {
    (async () => {
        try {
            await sequelize.sync({ force: true });   
            console.log('Database tables created successfully');

            // Create users
            const user = await User.create({
                username: 'Pedro240',
                email: 'test@gmail.com',
                password: 'test',
                address: 'Funchal',
                phone: '912945654',
                role: 'user'
            });
            console.log('User Pedro240 created with ID:', user.user_id);

            const user1 = await User.create({
                username: 'David240',
                email: 'dada@gmail.com',
                password: 'test',
                address: 'Funchal',
                phone: '912945654',
                role: 'user'
            });
            console.log('User David240 created with ID:', user1.user_id);

            // Create a category
            const category = await Category.create({
                category_name: 'Electronics',
                sub_category_name: 'Smartphones'
            });
            console.log('Category created with ID:', category.category_id);

            // Create an ad
            const ad = await Ad.create({
                user_id: user.user_id,
                category_id: category.category_id,
                title: 'iPhone 13 Pro - Like New',
                product_name: 'iPhone 13 Pro',
                address: 'Funchal',
                price: 799.99,
                product_condition: 'Excellent',
                description: 'iPhone 13 Pro 256GB in perfect condition with original box and accessories.',
                active_promotion: true,
                keywords: 'apple,iphone,smartphone'
            });
            console.log('Ad created with ID:', ad.ad_id);

            // Create a comment
            const comment = await Comment.create({
                user_id: user1.user_id,
                ad_id: ad.ad_id,
                comment: 'Is this still available?'
            });
            console.log('Comment created with ID:', comment.comment_id);

            console.log('Database seeded successfully!');
        } catch (error) {
            console.error('Error seeding database:', error);
            console.error('Error details:', error.stack);
        }
    })();
}

module.exports = { 
    sequelize,
    User,
    UserActivity,
    Review,
    Notification,
    Message,
    Follow,
    Comment,
    Chat,
    Category,
    AdImage,
    Ad
}

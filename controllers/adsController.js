const Ad = require('../db_sequelize.js').Ad;
const User = require('../db_sequelize.js').User;
const Category = require('../db_sequelize.js').Category;

async function getAllAds(req, res) {
    try {
        const ads = await Ad.findAll({
            include: [
                { model: User, attributes: ['user_id', 'username'] },
                { model: Category, attributes: ['category_id', 'category_name', 'sub_category_name'] }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAdById(req, res) {
    const adId = req.params.id;
    
    try {
        const ad = await Ad.findByPk(adId, {
            include: [
                { model: User, attributes: ['user_id', 'username'] },
                { model: Category, attributes: ['category_id', 'category_name', 'sub_category_name'] }
            ]
        });
        if (ad) {
            res.json(ad);
        } else {
            res.status(404).json({ message: "Ad not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createAd(req, res) {
    try {
        // Verificar se a categoria existe
        const category = await Category.findByPk(req.body.category_id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const newAd = await Ad.create(req.body);
        // Obter o anúncio com informações do usuário e categoria
        const ad = await Ad.findByPk(newAd.ad_id, {
            include: [
                { model: User, attributes: ['user_id', 'username'] },
                { model: Category, attributes: ['category_id', 'category_name', 'sub_category_name'] }
            ]
        });
        
        res.status(201).json({ 
            message: "Ad created successfully", 
            ad
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateAd(req, res) {
    const adId = req.params.id;
    
    try {
        const [updatedCount] = await Ad.update(
            req.body,
            { where: { ad_id: adId, user_id: req.body.user_id } }
        );
        
        if (updatedCount > 0) {
            const updatedAd = await Ad.findByPk(adId, {
                include: [
                    { model: User, attributes: ['user_id', 'username'] },
                    { model: Category, attributes: ['category_id', 'category_name', 'sub_category_name'] }
                ]
            });
            
            res.json({
                message: "Ad updated successfully",
                ad: updatedAd
            });
        } else {
            res.status(404).json({ message: "Ad not found or you don't have permission" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllAds,
    getAdById,
    createAd,
    updateAd
};

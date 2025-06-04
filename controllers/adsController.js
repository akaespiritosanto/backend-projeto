const Ad = require('../db_sequelize.js').Ad;
const Category = require('../db_sequelize.js').Category;
const User = require('../db_sequelize.js').User;
const AdImage = require('../db_sequelize.js').AdImage;

async function getAllAds(req, res) {
    try {
        const ads = await Ad.findAll({
            include: [
                { model: Category },
                { model: User, attributes: ['user_id', 'username', 'email'] }
            ]
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
                { model: Category },
                { model: User, attributes: ['user_id', 'username', 'email'] },
                { model: AdImage }
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
        const newAd = await Ad.create(req.body);
        
        // Handle images if provided
        if (req.body.images && Array.isArray(req.body.images)) {
            const imagePromises = req.body.images.map(imageUrl => 
                AdImage.create({
                    ad_id: newAd.ad_id,
                    image_url: imageUrl
                })
            );
            await Promise.all(imagePromises);
        }
        
        res.status(201).json({ 
            message: "Ad created successfully", 
            id: newAd.ad_id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateAd(req, res) {
    const adId = req.params.id;

    if (!adId) {
        return res.status(400).json({ error: "Ad ID is required" });
    }

    try {
        const [updatedCount] = await Ad.update(req.body, {
            where: { ad_id: adId }
        });

        if (updatedCount > 0) {
            // Handle images if provided
            if (req.body.images && Array.isArray(req.body.images)) {
                // Delete existing images
                await AdImage.destroy({ where: { ad_id: adId } });
                
                // Add new images
                const imagePromises = req.body.images.map(imageUrl => 
                    AdImage.create({
                        ad_id: adId,
                        image_url: imageUrl
                    })
                );
                await Promise.all(imagePromises);
            }
            
            const updatedAd = await Ad.findByPk(adId, {
                include: [{ model: AdImage }]
            });
            
            res.json({
                message: "Ad updated successfully",
                ad: updatedAd
            });
        } else {
            res.status(404).json({ message: "Ad not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteAd(req, res) {
    const adId = req.params.id;

    if (!adId) {
        return res.status(400).json({ error: "Ad ID is required" });
    }

    try {
        // Delete associated images first
        await AdImage.destroy({ where: { ad_id: adId } });
        
        // Then delete the ad
        const deletedCount = await Ad.destroy({
            where: { ad_id: adId }
        });
        
        if (deletedCount > 0) {
            res.json({ message: "Ad deleted", count: deletedCount });
        } else {
            res.status(404).json({ message: "Ad not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllAds,
    getAdById,
    createAd,
    updateAd,
    deleteAd
};

const Ad = require('../db_sequelize.js').Ad;


async function getAllAds(req, res) {
    try {
        const ads = await Ad.findAll();
        res.json(ads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createAd(req, res) {
    try {
        const newAd = await Ad.create(req.body);
        res.json({ message: "Ad created", id: newAd.ad_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteAd(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        const deletedCount = await Ad.destroy({
            where: { ad_id: id }
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

async function updateAd(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        const [updatedCount] = await Ad.update(req.body, {
            where: { ad_id: id }
        });

        if (updatedCount > 0) {
            const updatedAd = await Ad.findOne({
                where: { ad_id: id }
            });
            res.json({
                message: "Ad updated",
                data: updatedAd
            });
        } else {
            res.status(404).json({ message: "Ad not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllAds,
    createAd,
    deleteAd,
    updateAd
};
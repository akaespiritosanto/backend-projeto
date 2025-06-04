const Category = require('../db_sequelize.js').Category;
const Ad = require('../db_sequelize.js').Ad;

async function getAllCategories(req, res) {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCategoryById(req, res) {
    const categoryId = req.params.id;
    
    try {
        const category = await Category.findByPk(categoryId);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAdsByCategory(req, res) {
    const categoryId = req.params.id;
    
    try {
        const ads = await Ad.findAll({
            where: { category_id: categoryId },
            include: [{ model: Category }]
        });
        
        res.json(ads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createCategory(req, res) {
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json({ 
            message: "Category created successfully", 
            id: newCategory.category_id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateCategory(req, res) {
    const categoryId = req.params.id;

    if (!categoryId) {
        return res.status(400).json({ error: "Category ID is required" });
    }

    try {
        const [updatedCount] = await Category.update(req.body, {
            where: { category_id: categoryId }
        });

        if (updatedCount > 0) {
            const updatedCategory = await Category.findByPk(categoryId);
            res.json({
                message: "Category updated successfully",
                category: updatedCategory
            });
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteCategory(req, res) {
    const categoryId = req.params.id;

    if (!categoryId) {
        return res.status(400).json({ error: "Category ID is required" });
    }

    try {
        // Check if category has ads
        const adsCount = await Ad.count({ where: { category_id: categoryId } });
        
        if (adsCount > 0) {
            return res.status(400).json({ 
                message: "Cannot delete category with associated ads",
                adsCount
            });
        }
        
        const deletedCount = await Category.destroy({
            where: { category_id: categoryId }
        });
        
        if (deletedCount > 0) {
            res.json({ message: "Category deleted", count: deletedCount });
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    getAdsByCategory,
    createCategory,
    updateCategory,
    deleteCategory
};
const Category = require('../db_sequelize.js').Category;

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

async function createCategory(req, res) {
    try {
        const newCategory = await Category.create(req.body);
        
        res.status(201).json({ 
            message: "Category created successfully", 
            category: newCategory
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory
};

const { Category } = require("../models/categoryModel");

const categoryController = {
  addCategory: async (req, res) => {
    try {
      const category = new Category(req.body);
      const saveCategory = await category.save();
      res.status(200).json(saveCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getCategory: async (req, res) => {
    try {
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
      const pageIndex = req.query.pageIndex ? parseInt(req.query.pageIndex) : 1;
      const sortBy = req.query.sortBy || "createdAt";
      try {
        const listCategory = Category.find()
          .skip(pageSize * pageIndex - pageSize)
          .sort(sortBy)
          .limit(pageSize);
        const count = Category.count();
        const results = await Promise.all([listCategory, count]);
        const response = {
          content: results[0],
          pagination: {
            pageSize,
            pageIndex,
            totalElements: results[1],
            totalPages: Math.ceil(results[1] / pageSize),
          },
        };
        return res.status(200).json(response);
      } catch (error) {
        console.log(error);
        return res.status(500).send({ error: JSON.stringify(error) });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateCategoryById: async (req, res) => {
    try {
      const categoryUpdated = await Category.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(categoryUpdated);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteCategoryById: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Delete successfully...!!" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = categoryController;

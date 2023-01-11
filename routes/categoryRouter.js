const router = require("express").Router();
const categoryController = require("../controllers/categoryController");

//ADD Category
router.post("/", categoryController.addCategory);

// //GET ALL Category
router.get("/", categoryController.getCategory);

// //GET Category by id
router.get("/:id", categoryController.getCategoryById);

// //UPDATE Category
router.put("/:id", categoryController.updateCategoryById);

// //DELETE Category
router.delete("/:id", categoryController.deleteCategoryById);

module.exports = router;

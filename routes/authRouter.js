const router = require("express").Router();
const authorController = require("../controllers/authController");
const middlewareVerify = require("../middleware/verifyToken");

//REGISTER
router.post("/register", authorController.register);

//LOGIN
router.post("/login", authorController.login);

//ADD User
router.post("/", middlewareVerify.verifyTokenAdmin, authorController.addUser);

//GET ALL User
router.get("/", authorController.getUser);

//GET User by id
router.get("/:id", authorController.getUserById);

//UPDATE User
router.put("/:id", authorController.updateUserById);

//DELETE User
router.delete("/:id", authorController.deleteUserById);

module.exports = router;

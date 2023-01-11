const router = require("express").Router();
const singerController = require("../controllers/singerController");

//ADD Singer
router.post("/", singerController.addSinger);

// //GET ALL Singer
router.get("/", singerController.getSinger);

// //GET Singer by id
router.get("/:id", singerController.getSingerById);

// //UPDATE Singer
router.put("/:id", singerController.updateSingerById);

// //DELETE Singer
router.delete("/:id", singerController.deleteSingerById);

module.exports = router;

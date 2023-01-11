const router = require("express").Router();
const songController = require("../controllers/songController");

//ADD Song
router.post("/", songController.addSong);

// //GET ALL Song
router.get("/", songController.getSong);

// //GET Song by id
router.get("/:id", songController.getSongById);

// //UPDATE Song
router.put("/:id", songController.updateSongById);

// //DELETE Song
router.delete("/:id", songController.deleteSongById);

module.exports = router;

const { Song } = require("../models/songModel");

const songController = {
  addSong: async (req, res) => {
    try {
      const { name, time, description, category, like, singer } = JSON.parse(
        req.body.song
      );

      let file = req.files.file;
      let audio = req.files.audio;

      let songDTO = {
        name,
        time,
        description,
        category,
        like,
        singer,
      };

      const uploadImagePath = `${process.env.UPLOAD_PATH}/${file.name}`;
      const uploadAudioPath = `${process.env.UPLOAD_AUDIO}/${audio.name}`;

      file.mv(uploadImagePath, async function (err) {
        if (err) return res.status(500).send(err);
      });
      audio.mv(uploadAudioPath, async function (err) {
        if (err) return res.status(500).send(err);
      });

      const filePath = `${file.name}`;
      const audioPath = `${audio.name}`;
      songDTO = { ...songDTO, thumbnail: filePath, audio: audioPath };

      const newSong = new Song(songDTO);
      try {
        const resSong = await newSong.save();
        const thumbnail = `${req.protocol}://${req.get("host")}/${filePath}`;
        const audio = `${req.protocol}://${req.get("host")}/${audioPath}`;
        res
          .status(200)
          .send({ ...resSong._doc, thumbnail: thumbnail, audio: audio });
      } catch (error) {
        res.status(500).send(error);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getSong: async (req, res) => {
    try {
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
      const pageIndex = req.query.pageIndex ? parseInt(req.query.pageIndex) : 1;
      const sortBy = req.query.sortBy || "createdAt";
      const protocol = `${req.protocol}://${req.get("host")}`;
      try {
        const listSong = Song.find()
          .skip(pageSize * pageIndex - pageSize)
          .sort(sortBy)
          .limit(pageSize);
        const count = Song.count();
        const results = await Promise.all([listSong, count]);
        const newResults = results[0].map((item) => ({
          ...item._doc,
          thumbnail: `${protocol}/${item.thumbnail}`,
          audio: `${protocol}/${item.audio}`,
        }));
        const response = {
          content: newResults,
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
  getSongById: async (req, res) => {
    try {
      const song = await Song.findById(req.params.id);
      const thumbnail = `${req.protocol}://${req.get("host")}/${
        song.thumbnail
      }`;
      const audio = `${req.protocol}://${req.get("host")}/${song.audio}`;
      res
        .status(200)
        .json({ ...song._doc, thumbnail: thumbnail, audio: audio });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateSongById: async (req, res) => {
    try {
      const { name, time, description, category, like, singer } = JSON.parse(
        req.body.song
      );
      let file = req.files.file;
      let songDTO = {
        name,
        time,
        description,
        category,
        like,
        singer,
      };

      const uploadPath = `${process.env.UPLOAD_PATH}/${file.name}`;
      file.mv(uploadPath, async function (err) {
        if (err) return res.status(500).send(err);

        const filePath = `${file.name}`;
        songDTO = { ...songDTO, thumbnail: filePath };

        try {
          const songUpdated = await Song.findByIdAndUpdate(
            req.params.id,
            { $set: songDTO },
            { new: true }
          );
          const thumbnail = `${req.protocol}://${req.get("host")}/${
            songUpdated.thumbnail
          }`;
          res.status(200).send({ ...songUpdated._doc, thumbnail });
        } catch (error) {
          res.status(500).send(error);
        }
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteSongById: async (req, res) => {
    try {
      await Song.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Delete successfully...!!" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = songController;

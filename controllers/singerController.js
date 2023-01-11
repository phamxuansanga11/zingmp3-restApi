const { Singer } = require("../models/singerModel");

const singerController = {
  addSinger: async (req, res) => {
    try {
      const singer = new Singer(req.body);
      const saveSinger = await singer.save();
      res.status(200).json(saveSinger);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getSinger: async (req, res) => {
    try {
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
      const pageIndex = req.query.pageIndex ? parseInt(req.query.pageIndex) : 1;
      const sortBy = req.query.sortBy || "createdAt";
      try {
        const listSinger = Singer.find()
          .skip(pageSize * pageIndex - pageSize)
          .sort(sortBy)
          .limit(pageSize);
        const count = Singer.count();
        const results = await Promise.all([listSinger, count]);
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
  getSingerById: async (req, res) => {
    try {
      const singer = await Singer.findById(req.params.id);
      res.status(200).json(singer);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateSingerById: async (req, res) => {
    try {
      const singerUpdated = await Singer.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(singerUpdated);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteSingerById: async (req, res) => {
    try {
      await Singer.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Delete successfully...!!" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = singerController;

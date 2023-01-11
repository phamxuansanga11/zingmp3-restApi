const { User } = require("../models/authenticationModel");

const authController = {
  createAccessToken: async (user) => {
    return jwt.sign(
      {
        role: user.role,
        username: user.username,
      },
      process.env.JWT__ACCESS__KEY,
      { expiresIn: "30d" }
    );
  },
  createRefreshToken: async (user) => {
    return jwt.sign(
      {
        role: user.role,
        username: user.username,
      },
      process.env.JWT__REFRESH__KEY,
      { expiresIn: "365d" }
    );
  },
  register: async (req, res) => {
    try {
      const isExistsUser = await User.findOne({ username: req.body.username });
      if (isExistsUser) {
        res.status(409).json({ message: "username is already exists" });
      } else {
        const user = new User(req.body);
        const userSaved = await user.save();
        res.status(200).json(userSaved);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });
      if (user) {
        if (user.username === username && user.password === password) {
          const accessToken = await authController.createAccessToken(user);
          const refreshToken = await authController.createRefreshToken(user);
          res.status(200).json({
            message: "Login successfully...!!!",
            user: {
              username: user.username,
              birthday: user.birthday,
              role: user.role,
              accessToken: accessToken,
              refreshToken: refreshToken,
              phoneNumber: user.phoneNumber,
              favoritePlaylist: user.favoritePlaylist,
            },
          });
        } else {
          res.status(200).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }
      } else {
        res.status(404).json({ message: "Không tìm thấy user" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  addUser: async (req, res) => {
    try {
      const user = new User(req.body);
      const savedUser = await user.save();
      res.status(200).json(savedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getUser: async (req, res) => {
    try {
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
      const pageIndex = req.query.pageIndex ? parseInt(req.query.pageIndex) : 1;
      const sortBy = req.query.sortBy || "createdAt";
      try {
        const listUser = User.find()
          .skip(pageSize * pageIndex - pageSize)
          .sort(sortBy)
          .limit(pageSize);
        const count = User.count();
        const results = await Promise.all([listUser, count]);
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
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateUserById: async (req, res) => {
    try {
      const userUpdated = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(userUpdated);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteUserById: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Delete successfully...!!" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = authController;

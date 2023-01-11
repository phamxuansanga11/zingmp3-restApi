const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const fileupload = require("express-fileupload");
const authRouter = require("./routes/authRouter");
const categoryRouter = require("./routes/categoryRouter");
const singerRouter = require("./routes/singerRouter");
const songRouter = require("./routes/songRouter");

//use .env
dotenv.config();
const port = process.env.PORT || 5000;

//library
app.use(fileupload());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

app.use(express.static(path.join(__dirname, "upload")));
app.use(express.static(path.join(__dirname, "audio")));

//connect database
mongoose
  .connect(process.env.MONGODB_URL)
  .then((res) => console.log("Connected to mongodb success..!"))
  .catch((err) => console.log(err, "Connected failed"));

//ROUTER auth
app.use("/zingmp3/auth", authRouter);

//ROUTER category
app.use("/zingmp3/category", categoryRouter);

//ROUTER singer
app.use("/zingmp3/singer", singerRouter);

//ROUTER song
app.use("/zingmp3/song", songRouter);

app.listen(port, () => {
  console.log(`Server is running...${port}`);
});

/** Reference code: https://github.com/bpeddapudi/nodejs-basics-routes/blob/master/server.js
 * import express */
const express = require("express");
const cors = require("cors");
// middleware
const app = express();
app.use(express.json());
app.use(cors());

// `npm install mongoose`
const mongoose = require("mongoose");
const options = {
  keepAlive: true,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
// mongodb+srv://<username>:<password>@cluster0.6vk0qgz.mongodb.net/?retryWrites=true&w=majority
// You guys need to replace with your own server url and correct <username> and <password>
const dbUrl = `mongodb+srv://Krishna:lYSIWdmu7fyVM3tk@cluster0.vhcvxrn.mongodb.net/?retryWrites=true&w=majority`;

// Mongo DB connection
mongoose.connect(dbUrl, options, (err) => {
  if (err) console.log(err);
});

// Validate DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Well done! Mongo Db connected sucessfully");
});

// Schema for Book
let Schema = mongoose.Schema;
let restSchema = new Schema(
  {
    id: {
      type: Number,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);
let RestModel = mongoose.model("book", restSchema);

app.get("/", (req, res) => {
  res.send("Congrats! Your server is running...");
});

/** GET API: GETs Books from DB and returns as response */
app.get("/posts", async (req, res) => {
  try {
    let posts = await RestModel.find();
    res.status(200).json({
      status: 200,
      data: posts,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

/** POST API: Gets new book info from React and adds it to DB */
app.post("/posts", async (req, res) => {
  const inputPost = req.body;
  try {
    let post = new RestModel(inputPost);
    post = await post.save();
    res.status(200).json({
      status: 200,
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

/** DELETE API: Gets ID of the book to be deleted from React and deletes the book in db.
 * Sends 400 if there is no book with given id
 * Sends 500 if there is an error while saving data to DB
 * Sends 200 if deleted successfully
 */
app.delete("/posts/:id", async (req, res) => {
  try {
    let book = await RestModel.findByIdAndRemove(req.params.id);
    if (book) {
      res.status(200).json({
        status: 200,
        message: "Book deleted successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

app.listen(8080, function () {
  console.log(`App listening at port 8080`);
});

var express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var app = express();
const dotenv = require('dotenv');
dotenv.config();
// console.log(`${process.env.PSW}`);
var port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cur_code;
mongoose.connect(
  `mongodb+srv://trossos:${process.env.PSW}@cluster0.gkfih.mongodb.net/myFirstDatabase`
);

const schema = {
  title: String,
  content: String,
};

const item = mongoose.model("item", schema);

// app.use("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/add-new", function (req, res) {
  res.sendFile(__dirname + "/add-new.html");
});
app.get("/bad-input", function (req, res) {
  res.sendFile(__dirname + "/bad-input.html");
});

app.get("/edit", function (req, res) {
  res.sendFile(__dirname + "/edit.html");
});

app.post("/add-new", function (req, res) {
  console.log("test");
  let test = new item({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(req.body.title);
  test.save(function (err, doc) {
    if (err) return console.error(err);
    console.log("Document inserted succussfully!");
  });
  res.redirect("/");
});

app.post("/edit", function (req, res) {
  console.log("editing POST");
  const filter = { title: cur_code };
  // console.log(filter);
  const update = { content: req.body.content };
  // console.log(update);
  const opts = { new: true };

  item.findOneAndUpdate(filter, update, { new: true }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      console.log(cur_code + " updated");
    }
  });
  res.redirect("/");
});



app.post("/exsists", function (req, res) {
  console.log("test");

  item.exists({ title: req.body.code }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      if (result == null) {
        res.redirect("/bad-input");
      } else {
        cur_code = req.body.code;
        console.log(cur_code);
        res.redirect("/edit");
      }
    }
  });
  // res.redirect("/");
});

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

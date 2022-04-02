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
  food_item: String,
  location_from: String,
  mass: String
};

const foods = mongoose.model("foods", schema);

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
  let test = new foods({
    food_item: req.body.food_item,
    location_from: req.body.location_from,
  });
  console.log(req.body.food_item);
  test.save(function (err, doc) {
    if (err) return console.error(err);
    console.log("Document inserted succussfully!");
  });
  res.redirect("/");
});

app.post("/edit", function (req, res) {
  console.log("editing POST");
  const filter = { food_item: cur_code };
  // console.log(filter);
  const update = { location_from: req.body.location_from };
  // console.log(update);
  const opts = { new: true };

  foods.findOneAndUpdate(filter, update, { new: true }, function (err, result) {
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

  foods.exists({ food_item: req.body.code }, function (err, result) {
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

function gen_produt_code(food_type, location_from){
  out;
  num items;

  out = `${}`
}
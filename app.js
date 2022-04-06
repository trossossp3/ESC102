var express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var app = express();
const dotenv = require("dotenv");
dotenv.config();
const Hashids = require("hashids/cjs");
const hashids = new Hashids();

// console.log(`${process.env.PSW}`);
var port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cur_code;
// app.set('view engine', 'ejs');
mongoose.connect(
  `mongodb+srv://trossos:test@cluster0.gkfih.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&authSource=admin`
);

const schema = {
  food_item: String,
  location_from: String,
  mass: String,
  product_code: String,
};

const foods = mongoose.model("foods", schema);

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
  foods.find({product_code: cur_code}, function(err, data){
    console.log("data:"+data);
    res.render(__dirname + "/edit.ejs", {foods:data});
  })



  // res.render(__dirname + "/edit.ejs", {test:20});
});

app.get("/display-code", function (req, res) {
  res.render(__dirname + "/display-code.ejs", { code: cur_code });
});
app.get("/jagger", function (req, res) {
  foods.find({}, function (err, data) {
    // note that data is an array of objects, not a single object!
    console.log(data);
    res.render(__dirname + "/jagger.ejs", {
      foods: data,
    });
  });
});

app.post("/add-new", async (req, res) => {
  // const estimate = await foods.estimatedDocumentCount();

  // console.log(typeof(idInt));
  // console.log(idInt);
  // test.product_code = idInt;


  let test = new foods({
    food_item: req.body.food_type,
    location_from: req.body.location_from,
    mass: req.body.mass,
  });
  console.log("\n\n\n\n");
  var idStr = fix_id(test._id.valueOf());
  console.log(typeof idStr);
  var idInt = hashids.encode(BigInt(idStr));
  console.log(hashids.encode(idInt));
  test.product_code = idInt;
  cur_code = test.product_code;
  console.log(test.product_code);
  console.log(test);
  test.save(function (err, doc) {
    if (err) return console.error(err);
    console.log("Document inserted succussfully!");
  });
  res.redirect("/display-code");
});

app.post("/edit", async (req, res) => {
  console.log("editing POST");
  const temp = await foods.findOne({product_code: cur_code});
  console.log("curr element" + temp)
  const filter = { product_code: cur_code };
  console.log(filter);
  
  // console.log(update);
  const opts = { new: true };


  const result = await foods.updateOne(filter, {
    $set: {
      food_item: req.body.food_type,
      location_from: req.body.location_from,
      mass: req.body.mass,
    },
  });

  res.redirect("/");
});

app.post("/exsists", function (req, res) {
  console.log("test");

  foods.exists({ product_code: req.body.code }, function (err, result) {
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
});
function fix_id(id) {
  console.log(id);
  var out = "";
  for (var i = 0; i < id.length; i++) {
    if (id.charCodeAt(i) < 58) {
      out += id.charAt(i);
    } else {
      out += id.charCodeAt(i);
    }
  }
  console.log(out);
  return out;
}

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

var express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var app = express();
const dotenv = require("dotenv");
dotenv.config();
const Hashids = require("hashids/cjs");
const { redirect } = require("express/lib/response");
const { is } = require("express/lib/request");
const hashids = new Hashids();
const Schema = mongoose.Schema;
// console.log(`${process.env.PSW}`);
var port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/css/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cur_code;
var is_admin = false;
global.test = 100;
app.use(express.static(__dirname + "/public/"));
var helper = require("./public/functions");
// app.use(express.static("./functions"));
// app.set('view engine', 'ejs');
mongoose.connect(
  `mongodb+srv://trossos:test@cluster0.gkfih.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&authSource=admin`
);

var schema = new Schema(
  {
    food_item: String,
    location_from: String,
    mass: String,
    product_code: String,
    location_to: String,
    bbb: Date,
  },
  {
    timestamps: true,
  }
);

schema.index({
  location_from: "text",
  food_item: "text",
  mass: "text",
  product_code: "text",
  location_to: "text",
});

var schemaD = new Schema(
  {
    food_item: String,
    location_from: String,
    mass: String,
    product_code: String,
    location_to: String,
    bbb: Date,
  },
  {
    timestamps: true,
  }
);

schemaD.index({
  location_from: "text",
  food_item: "text",
  mass: "text",
  product_code: "text",
  location_to: "text",
});

const done = mongoose.model("done", schemaD);

const foods = mongoose.model("foods", schema);
// await foods.collection.dropIndexes();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/home.html");
});

app.post("/test", async (req, res) => {
  //console.log(is_admin);
  // res.redirect("/index");
  console.log("hel");
  await console.log(req.body.productId);
  cur_code = req.body.productId;
  res.redirect("/edit-table");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/home.html");
});

app.post("/delete", async (req, res) => {
  console.log("delete");
  await console.log(req.body.delete);
  cur_code = req.body.delete;
  await foods.deleteOne({ product_code: cur_code });
  res.redirect("/jagger");
});

app.get("/index", function (req, res) {
  res.render(__dirname + "/index.ejs", { is_admin: is_admin });
});

app.get("/enter-code", function (req, res) {
  res.render(__dirname + "/enter-code.ejs");
});

app.get("/enter-code-view", function (req, res) {
  res.render(__dirname + "/enter-code-view.ejs");
});

app.get("/add-new", function (req, res) {
  res.sendFile(__dirname + "/add-new.html");
});

app.get("/bad-input", function (req, res) {
  res.sendFile(__dirname + "/bad-input.html");
});

app.get("/edit-table", function (req, res) {
  foods.find({ product_code: cur_code }, function (err, data) {
    // console.log("data:" + data);
    res.render(__dirname + "/edit-table.ejs", {
      foods: data,
      is_admin: is_admin,
    });
  });

  // res.render(__dirname + "/edit.ejs", {test:20});
});

app.get("/edit", function (req, res) {
  foods.find({ product_code: cur_code }, function (err, data) {
    // console.log("data:" + data);
    res.render(__dirname + "/edit.ejs", { foods: data, is_admin: is_admin });
  });

  // res.render(__dirname + "/edit.ejs", {test:20});
});

app.get("/view", function (req, res) {
  foods.find({ product_code: cur_code }, function (err, data) {
    // console.log("data:" + data);
    res.render(__dirname + "/view.ejs", { foods: data, is_admin: is_admin });
  });

  // res.render(__dirname + "/edit.ejs", {test:20});
});
app.get("/display-code", function (req, res) {
  foods.find({ product_code: cur_code }, function (err, data) {
    // console.log("data:" + data);
    res.render(__dirname + "/display-code.ejs", { foods: data });
  });
});

app.get("/jagger", function (req, res) {
  foods.find({}, function (err, data) {
    res.render(__dirname + "/jagger.ejs", {
      foods: data,
      help: helper,
    });
  });
});
app.get("/archive", function (req, res) {
  done.find({}, function (err, data) {
    res.render(__dirname + "/archive.ejs", {
      foods: data,
      help: helper,
    });
  });
});


app.post("/add-new", async (req, res) => {
  let test = new foods({
    food_item: req.body.food_type,
    location_from: req.body.location_from,
    mass: req.body.mass,
    bbb: req.body.bbb,
  });
  //console.log("\n\n\n\n");
  var id;
  await test.save(async (err, doc) => {
    if (err) return; //console.error(err);
    console.log(doc._id);
    id = await doc._id;
    console.log("id is" + id);

    // console.log(id);
    var mili = test.createdAt.getMilliseconds();
    console.log(mili);
    var letters = test.food_item.substring(0, 2).toUpperCase();
    var cat = letters + mili;
    console.log(cat);
    test.product_code = cat;
    console.log(id);
    const result = await foods.updateOne(
      { _id: id },
      {
        $set: {
          product_code: cat,
        },
      }
    );
    cur_code = cat;
    console.log(result);
    res.redirect("/display-code");
  });
});

app.post("/edit", async (req, res) => {
  console.log("editing POST");
  const temp = await foods.findOne({ product_code: cur_code });
  // console.log("curr element" + temp);
  const filter = { product_code: cur_code };
  //console.log(filter);

  // console.log(update);
  const opts = { new: true };

  const result = await foods.updateOne(filter, {
    $set: {
      food_item: req.body.food_type,
      location_from: req.body.location_from,
      mass: req.body.mass,
      bbb: req.body.bbb,
      location_to: req.body.location_to,
    },
  });

  res.redirect("/index");
});

app.post("/edit-table", async (req, res) => {
  console.log("editing POST");
  const temp = await foods.findOne({ product_code: cur_code });
  // console.log("curr element" + temp);
  const filter = { product_code: cur_code };
  //console.log(filter);

  // console.log(update);
  const opts = { new: true };

  const result = await foods.updateOne(filter, {
    $set: {
      food_item: req.body.food_type,
      location_from: req.body.location_from,
      mass: req.body.mass,
      bbb: req.body.bbb,
      location_to: req.body.location_to,
    },
  });

  res.redirect("/jagger");
});
app.post("/search", async (req, res) => {
  // const resa = await foods.index({food_item: "text"});
  var search = req.body.term;
  var docs;
  if (search == "") {
    docs = await foods.find({});
  } else {
    console.log("SEARCH TERM" + search);
    var results = foods.find({ $text: { $search: search } });
    var docs = await results;
    console.log("FOUND DOCS" + docs);
  }
  res.render(__dirname + "/jagger.ejs", {
    foods: docs,
    helper: helper,
  });
});

app.post("/exsists-view", function (req, res) {
  //console.log("test");

  foods.exists({ product_code: req.body.code }, function (err, result) {
    if (err) {
      //console.log(err);
    } else {
      //console.log(result);
      if (result == null) {
        res.redirect("/bad-input");
      } else {
        cur_code = req.body.code;
        //console.log(cur_code);
        res.redirect("/view");
      }
    }
  });
});
app.post("/archive", async (req, res) => {
  foods.findOne({ product_code: req.body.completed }, async  (err, result) =>{
    console.log(req.body.completed);
    console.log(result);
    let swap = new done(result.toJSON()); //or result.toObject
    /* you could set a new id
    swap._id = mongoose.Types.ObjectId()
    swap.isNew = true
    */

    await foods.deleteOne({ product_code: req.body.completed });
    swap.save();
    res.redirect("/archive");

    // swap is now in a better place
  });
  
});

app.post("/exsists", function (req, res) {
  //console.log("test");

  foods.exists({ product_code: req.body.code }, function (err, result) {
    if (err) {
      //console.log(err);
    } else {
      //console.log(result);
      if (result == null) {
        res.redirect("/bad-input");
      } else {
        cur_code = req.body.code;
        //console.log(cur_code);
        res.redirect("/edit");
      }
    }
  });
});

app.post("/volunteer", async (req, res) => {
  is_admin = false;
  //console.log(is_admin);
  res.redirect("/index");
});

app.post("/admin", async (req, res) => {
  is_admin = true;
  //console.log(is_admin);
  res.redirect("/index");
});
function fix_id(id) {
  //console.log(id);
  var out = "";
  for (var i = 0; i < id.length; i++) {
    if (id.charCodeAt(i) < 58) {
      out += id.charAt(i);
    } else {
      out += id.charCodeAt(i);
    }
  }
  //console.log(out);
  return out;
}

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

const express = require("express");
const app = express();
const Order = require("./models/order");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { db } = require("./models/order");

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

const dbURI =
  "mongodb+srv://gautam:gautam@cluster0.vxcm6pi.mongodb.net/milk_delivery_application?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Connect");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

app.get("/all-orders", (req, res) => {
  var date = req.body["date"];
  var month = req.body["month"];
  var year = req.body["year"];
  var f = {};
  f["date"] = date;
  f["month"] = month;
  f["year"] = year;

  Order.find(f, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log(docs);
      res.json({
        message: "printed in console !!!!",
        orders_day: docs,
      });
    }
  });
});

app.post("/new_order", (req, res) => {
  var n = req.body["name"];
  var p = req.body["phone_number"];
  const order = new Order({
    id: n[0] + "_" + p,
    name: req.body["name"],
    phone_number: req.body["phone_number"],
    address: req.body["address"],
    q1: req.body["q1"],
    q2: req.body["q2"],
    date: req.body["date"],
    month: req.body["month"],
    year: req.body["year"],
  });
  db.collection("orders").insertOne(order, (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.json({
    confirmation_message: "order placed !!!! ",
    order_id: n[0] + "_" + p,
  });
});

app.put("/update-order", (req, res) => {
  const n = req.body["name"];
  const p = req.body["phone_number"];
  const i = n[0] + "_" + p;
  db.collection("orders").findOneAndReplace(
    {
      id: req.body["id"],
    },
    {
      id: i,
      name: req.body["name"],
      phone_number: req.body["phone_number"],
      address: req.body["address"],
      q1: req.body["q1"],
      q2: req.body["q2"],
      date: req.body["date"],
      month: req.body["month"],
      year: req.body["year"],
    },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  res.json({
    message: "order updated !!!!",
    order_id: i,
  });
});

app.delete("/delete-order", (req, res) => {
  db.collection("orders").deleteOne(
    {
      id: req.body["id"],
    },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  res.json({
    message: "order deleted !!!!",
  });
});

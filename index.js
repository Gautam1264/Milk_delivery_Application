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

/*
const dbURI = "mongodb+srv://gautam:gautam@cluster0.2jonj.mongodb.net/address_book?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Connect");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

app.post("/add-many-contacts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      var contact = [];

      for (var i = 0; i < req.body["first_name"].length; i++) {
        contact.push(
          new Contact({
            name: req.body["first_name"][i] + "_" + req.body["last_name"][i],
            phone_number: req.body["phone_number"][i],
            city: req.body["city"][i],
          })
        );
      }

      console.log(contact);

      // Using insertMany method to add multiple contacts

      db.collection("contacts").insertMany(contact, (err) => {
        if (err) {
          console.log(err);
        }
      });

      res.json({
        message: "users added !!!!",
      });
    }
  });
});
app.post("/add-one-contact", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const contact = new Contact({
        name: req.body["first_name"] + "_" + req.body["last_name"],
        phone_number: req.body["phone_number"],
        city: req.body["city"],
      });

      // Using insertOne method to add single contact

      db.collection("contacts").insertOne(contact, (err) => {
        if (err) {
          console.log(err);
        }
      });

      res.json({
        message: "user added !!!!",
      });
    }
  });
});
app.delete("/delete-contact", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      // deleting the contact with details given and if does not exist in database it will simply do nothing

      db.collection("contacts").deleteOne(
        {
          name: req.body.first_name + "_" + req.body.last_name,
          phone_number: req.body.phone_number,
          city: req.body.city,
        },
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );

      res.json({
        message: "user deleted !!!!",
      });
    }
  });
});
app.get("/all-contacts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      // Take out all the contacts in the database with paging and print it in the console

      var list = [];
      Contact.find({}, (err, docs) => {
        if (err) {
          console.log(err);
        } else {
          var page = 1;
          var size = 3;
          var pg = {};

          var li = [];
          for (var j = 0; j < docs.length; j++) {
            li = [];
            for (var k = 0; k < size; k++) {
              if (j + k < docs.length) {
                li.push(docs[j + k]);
              }
            }
            j += size - 1;
            pg = {};
            pg["page_number"] = page;
            pg["size_length"] = size;
            pg["conts"] = li;

            list.push(pg);
            page++;
          }

          console.log(list);
        }
      });

      res.json({
        message: "printed in console  !!!!",
      });
    }
  });
});
app.post("/update-contact", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const contact = {
        name: req.body["first_name"] + "_" + req.body["last_name"],
        phone_number: req.body["phone_number"],
        city: req.body["city"],
      };
      const ucontact = {
        name: req.body["ufirst_name"] + "_" + req.body["ulast_name"],
        phone_number: req.body["uphone_number"],
        city: req.body["ucity"],
      };

      // updating the contact with details given by other details and if does not exist in database it will simply do nothing

      db.collection("contacts").replaceOne(
        {
          name: req.body["first_name"] + "_" + req.body["last_name"],
          phone_number: req.body["phone_number"],
          city: req.body["city"],
        },
        {
          name: req.body["ufirst_name"] + "_" + req.body["ulast_name"],
          phone_number: req.body["uphone_number"],
          city: req.body["ucity"],
        },
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );

      res.json({
        message: "user updated !!!!",
      });
    }
  });
});
app.get("/single-contact-details", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      // Given the name , it will print the coplete details

      Contact.find(
        { name: req.body["first_name"] + "_" + req.body["last_name"] },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log(docs);
          }
        }
      );

      res.json({
        message: "printed in console !!!!",
      });
    }
  });
});
app.get("/phase-match-results", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      // with given info , it will print all the contacts which have relevant info

      var key = Object.keys(req.body);
      var value = Object.values(req.body);
      var f = {};
      var name = "";
      for (var i = 0; i < key.length; i++) {
        if (key[i] == "first_name") {
          name += value[i] + "_" + value[i + 1];
          i++;
          f["name"] = name;
          continue;
        }
        f[key[i]] = value[i];
      }
      //console.log(f) ;

      Contact.find(f, (err, docs) => {
        if (err) {
          console.log(err);
        } else {
          console.log(docs);
        }
      });

      res.json({
        message: "printed in console !!!!",
      });
    }
  });
});
app.get("/get-token", (req, res) => {
  const user = {
    username: "Gautam Singla",
  };

  // generating json web token

  jwt.sign({ user: user }, "secretkey", (err, token) => {
    res.json({
      token,
    });
  });
});
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const btoken = bearer[1];
    req.token = btoken;
    next();
  } else {
    res.sendStatus(403);
  }
}
*/

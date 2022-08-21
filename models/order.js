const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    id: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    phone_number: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    q1: {
      type: Number,
      require: true,
    },
    q2: {
      type: Number,
      require: true,
    },
    date: {
      type: Number,
      require: true,
    },
    month: {
      type: Number,
      require: true,
    },
    year: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

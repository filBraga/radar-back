const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    produto: String,
    valor: Number,
    descricao: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

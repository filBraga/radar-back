const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Fil
const Product = require("./models/Product");

app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Express" });
});

app.post("/product", async (req, res) => {
  //   const {  } = req.body;
  const { produto, valor, descricao } = req.body;
  const product = {
    produto,
    valor,
    descricao,
  };
  try {
    const newProduct = await Product.create(product);
    const returnProduct = await Product.findById(newProduct._id);
    res.status(201).json(returnProduct);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.get("/product", async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.get("/product/find/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const regex = new RegExp(id, "i"); // i for case insensitive
    const product = await Product.find({ produto: { $regex: regex } });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findOne({ _id: id });
    if (!product) {
      res.status(422).json({ message: "Product not found!" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.put("/product/:id", async (req, res) => {
  const id = req.params.id;
  const { produto, valor, descricao } = req.body;
  const product = {
    produto,
    valor,
    descricao,
  };
  if (!produto || !valor || !descricao) {
    res.status(422).json({ message: "Missing information!" });
    return;
  }
  try {
    const updatedProduct = await Product.updateOne({ _id: id }, product);
    if (updatedProduct.matchedCount === 0) {
      res.status(422).json({ message: "Product not found!" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.patch("/product/:id", async (req, res) => {
  const id = req.params.id;
  const { produto, valor, descricao } = req.body;
  const product = {
    produto,
    valor,
    descricao,
  };
  try {
    const updatedProduct = await Product.updateOne({ _id: id }, product);
    if (updatedProduct.matchedCount === 0) {
      res.status(422).json({ message: "Product not found!" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.delete("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ id });
  if (!product) {
    res.status(422).json({ message: "Product not found!" });
    return;
  }
  try {
    await Product.deleteOne({ _id: id });
    res.status(200).json({ message: "Product removed successfully!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// DATABASE CONNECTION
mongoose
  .connect(
    "mongodb+srv://radarAdmin:jch6pqz5EHW.pkg4etm@restfulapidb.wilseyt.mongodb.net/test"
  )
  .then(() => {
    console.log("Conectou ao banco!");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));

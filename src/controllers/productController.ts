import { Request, Response } from "express";
import Product from "../models/productModel";

const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll();
  res.json(products);
};

const addProduct = async (req: Request, res: Response) => {
  const { name, price, stock } = req.body;
  const product = await Product.create({ name, price, stock });
  res.json(product);
};

export default { getProducts, addProduct };

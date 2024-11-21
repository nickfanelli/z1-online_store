import { Request, Response } from "express";
import Product from "../models/productModel";
import sequelize from "../db";

const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll();
  res.json(products);
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
  const { name, price, stock } = req.body;
  if(!name || name.length === 0 || !price || !stock) {
    res.status(400).json({ message: "Product must have a name, a price and stock quantity." });
    return;
  }

  if(price < 0 || stock < 0){
    res.status(400).json({ message: "Product price and stock can't be negative." });
    return;
  }

  const product = await Product.create({ name, price, stock });
  res.json(product);
};

const updateProducts = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction(); // Start a transaction to ensure atomic operation inventory update
  try {
    const { items } = req.body;
    if(!items) {
      throw new Error(`Can't update inventory stock without a list of products.`);
    }

    for (const item of items) {
      const product = await Product.findByPk(item.id, { transaction });
      if (!product) {
        throw new Error(`Product with ID ${item.id} not found.`);
      }

      if(item.name) {
        if(item.name.length === 0){
          res.status(400).json({ message: "Product must have a name, a price and stock quantity." });
          return;
        }
        product.name = item.name;
      }

      if(item.price) {
        if(item.price < 0) {
          res.status(400).json({ message: "Product price can't be negative." });
          return;
        }

        product.price = item.price;
      }

      if(item.stock) {
        if(item.stock < 0) {
          res.status(400).json({ message: "Product stock quantity can't be negative." });
          return;
        }

        product.stock = item.stock;
      }

      // Update product in inventory
      await product.save({ transaction });
    }
    
    // Commit transaction
    await transaction.commit();
    res.status(201).json({ message: "Products updated successfully", items });
  } catch(error: any) {
    // Rollback transaction in case of error
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }

}

export default { getProducts, addProduct, updateProducts };

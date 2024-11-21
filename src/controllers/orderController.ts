import { Request, Response } from "express";
import Product from "../models/productModel";
// import Cart from "../models/cartModel"
// import CartItem from "../models/cartItemModel"
import Order from "../models/orderModel";
// import { CartController } from "./cartController";
import sequelize from "../db";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    const transaction = await sequelize.transaction(); // Start a transaction to ensure atomic operation on order creation
    try {
      const { clientId } = req.body
      if(!clientId || clientId.length === 0) {
        throw new Error(`Can't process order from undefined client.`);
        return;
      }

      // I wanted to infer the order items from a client's cart. But I couldn't resolve TypeScript's
      // "inability" to recognize that a Cart could have a CartItem list, even though the association is defined
      // in the model
    //   const clientCart = await Cart.findOne({ where: { clientId }, include: [CartItem] });
    //   if(!clientCart) {
    //     throw new Error(`Cart not found.`);
    //     return;
    //   }

      
      const { items } = req.body; // Array of { productId, quantity }
      if (!items || items.length === 0) {
        res.status(400).json({ message: "Can't process an empty order." });
        return;
      }
      
      let total = 0;
  
      // Validate stock and calculate total price
      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction });
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }
  
        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }
  
        // Update stock
        product.stock -= item.quantity;
        await product.save({ transaction });
  
        // Calculate total
        total += product.price * item.quantity;
      }
  
      // Create order
      const order = await Order.create(
        {
          clientId,
          items,
          total,
        },
        { transaction }
      );
  
      // Clear client's cart
    //   req.params.clientId = clientId;
    //   await CartController.clearCart(req, res)
        // clearCart() method is not executing properly because the database is locked (due to the transaction)
        // I probably need to pass the transaction object like it's done with sequelize objects

      // Commit transaction
      await transaction.commit();
      res.status(201).json({ message: "Order created successfully", order });
    } catch (error: any) {
      // Rollback transaction in case of error
      await transaction.rollback();
      res.status(500).json({ message: error.message });
    }
  };
  
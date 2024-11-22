import { Request, Response } from "express";
import Product from "../models/productModel";
import Cart from "../models/cartModel"
import CartItem from "../models/cartItemModel"
import Order from "../models/orderModel";
import sequelize from "../db";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction(); // Start a transaction to ensure atomic operation on order creation
  try {
    const { clientId } = req.body
    if(!clientId || clientId.length === 0) {
      throw new Error(`Can't process order from undefined client.`);
    }

    // Purchase order is inferred from previously populated client's cart
    const clientCart = await Cart.findOne({ where: { clientId }, include: [CartItem] });
    if (!clientCart) {
      throw new Error(`Cart not found for this order.`);
    }

    if(!clientCart.CartItems || clientCart.CartItems.length === 0) {
      throw new Error(`Can't complete an order for an empty cart.`);
    }

    let total = 0;
    let items: {productId: number, quantity: number}[] = [];

    for (const cartItem of clientCart.CartItems) {
      const product = await Product.findByPk(cartItem.productId, { transaction });
      if (!product) {
        throw new Error(`Product with ID ${cartItem.productId} not found.`);
      }

      // Validate stock
      if (product.stock < cartItem.quantity) {
        throw new Error(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`
        );
      }

      // Update stock
      product.stock -= cartItem.quantity;
      await product.save({ transaction });

      items.push({productId: product.id, quantity: cartItem.quantity})

      // Calculate total
      total += product.price * cartItem.quantity;
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

    // Clear client's cart ... maybe?

    // Commit transaction
    await transaction.commit();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error: any) {
    // Rollback transaction in case of error
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};
  
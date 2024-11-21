import { Request, Response } from "express";
import Cart from "../models/cartModel"
import CartItem from "../models/cartItemModel";
import Product from "../models/productModel";

export class CartController {
    static async viewCart(req: Request, res: Response): Promise<void> {
        const { clientId } = req.params;

        const cart = await Cart.findOne({
            where: { clientId },
            include: CartItem,
        });

        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return; 
        }

        res.json(cart);
    }

    static async addItemToCart(req: Request, res: Response): Promise<void> {
        const { clientId } = req.params;
        const { productId, quantity } = req.body;
      
        let cart = await Cart.findOne({ where: { clientId } });
      
        if (!cart) {
          cart = await Cart.create({ clientId });
        }
      
        const product = await Product.findByPk(productId);
        if (!product) {
          res.status(404).json({ message: "Product not found" });
          return;
        }
      
        const cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
        if (cartItem) {
          cartItem.quantity += quantity;
          await cartItem.save();
        } else {
          await CartItem.create({ cartId: cart.id, productId, quantity });
        }
      
        res.status(200).json({ message: "Item added to cart" });
    }

    static async removeItemFromCart(req: Request, res: Response): Promise<void> {
        const { clientId } = req.params;
        const { productId } = req.body;
      
        const cart = await Cart.findOne({ where: { clientId } });
        if (!cart) {
          res.status(404).json({ message: "Cart not found" });
          return;
        }
      
        await CartItem.destroy({ where: { cartId: cart.id, productId } });
        // disconsidering for now a productId that might not be in the cart

        res.status(200).json({ message: "Item removed from cart" });
    }

    static async clearCart(req: Request, res: Response): Promise<void> {
        const { clientId } = req.params;
      
        const cart = await Cart.findOne({ where: { clientId } });
        if (!cart) {
          res.status(404).json({ message: "Cart not found" });
          return;
        }
      
        await CartItem.destroy({ where: { cartId: cart.id } });
        
        res.status(200).json({ message: "Cart cleared" });
    }
}

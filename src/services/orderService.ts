// import { Product } from "../models/productModel";
// import { Order } from "../models/orderModel";
// import sequelize from "../db";

// export const processOrder = async (cart: { productId: number; quantity: number }[]) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const orderItems: any[] = [];

//     for (const item of cart) {
//       const product = await Product.findByPk(item.productId, { transaction });
//       if (!product || product.stock < item.quantity) {
//         throw new Error("Insufficient stock for product ID: " + item.productId);
//       }

//       product.stock -= item.quantity;
//       await product.save({ transaction });
//       orderItems.push({ productId: product.id, quantity: item.quantity });
//     }

//     const order = await Order.create({ items: orderItems }, { transaction });
//     await transaction.commit();

//     return order;
//   } catch (err) {
//     await transaction.rollback();
//     throw err;
//   }
// };

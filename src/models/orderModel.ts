import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import Product from "./productModel";
import sequelize from "../db";

export default class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order, {omit: 'id'}>> {
  declare id: number;
  declare clientId: string;
  declare items: { productId: number; quantity: number }[]; // Order items
  declare total: number; // Total price for the order
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    clientId: { type: DataTypes.STRING, allowNull: false},
    items: { type: DataTypes.JSON, allowNull: false },
    total: { type: DataTypes.FLOAT, allowNull: false },
  },
  { sequelize, modelName: "Order" }
);

Order.hasMany(Product, { foreignKey: "productId" });

// Product.hasMany(Order, { foreignKey: "productId" });
// Order.belongsTo(Product, { foreignKey: "productId" });
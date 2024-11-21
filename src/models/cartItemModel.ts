import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../db";

export default class CartItem extends Model<InferAttributes<CartItem>, InferCreationAttributes<CartItem, {omit: 'id'}>> {
    declare id: number;
    declare cartId: number;
    declare productId: number;
    declare quantity: number;
}

CartItem.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      cartId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Carts", key: "id" }, onDelete: "CASCADE" },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, },
    },
    { sequelize, modelName: "CartItem" }
);

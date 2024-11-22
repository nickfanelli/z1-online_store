import { DataTypes, HasManyGetAssociationsMixin, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../db";
import CartItem from "./cartItemModel";

export default class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart, {omit: 'id'}>> {
    declare id: number;
    declare clientId: string;

    // CartItem is an optional property of Cart
    declare CartItems?: CartItem[];
}

Cart.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      clientId: { type: DataTypes.STRING, allowNull: false, unique: true }
    },
    { sequelize, modelName: "Cart" }
);
  
Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

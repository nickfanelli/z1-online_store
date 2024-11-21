import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../db";

export default class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product, {omit: 'id'}>> {
    declare id: number;
    declare name: string;
    declare price: number;
    declare stock: number;
}
  
Product.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.FLOAT, allowNull: false },
        stock: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: "Product" }
);

// Simple seeding for testing & playing
export async function seedProducts() {
    let productsInventory: Product[] = []
    
    const p1 =  await Product.create({
        name: "Sample item",
        price: 10,
        stock: 3
    });

    const p2 =  await Product.create({
        name: "Another item",
        price: 20,
        stock: 5
    });

    const p3 =  await Product.create({
        name: "Special item",
        price: 100,
        stock: 1
    });

    
    productsInventory.push(p1);
    productsInventory.push(p2);
    productsInventory.push(p3);

    console.log("Initial inventory: ")
    for (const product of productsInventory) {
        console.log(`\n ${JSON.stringify(product, null, 4)}`);
    }
}
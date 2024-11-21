import express, { Request, Response, NextFunction } from "express";
import productRoutes from "./api/routes/productRoutes";
import cartRoutes from "./api/routes/cartRoutes"
import orderRoutes from "./api/routes/orderRoutes";
import sequelize from "./db";

import { seedProducts } from "./models/productModel"

const app = express();
const PORT = 3000;

// JSON body parser
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (Object.keys(req.body).length) {
    console.log("Request Body:", req.body);
  }
  next(); // Pass control to the next middleware/route
});

// Mount paths
app.use("/products", productRoutes);
app.use("/cart", cartRoutes)
app.use("/orders", orderRoutes);

// Start the server
app.listen(PORT, async () => {
  await sequelize.sync({ force: true });
  await seedProducts();
  console.log(`Server is running on http://localhost:${PORT}`);
});

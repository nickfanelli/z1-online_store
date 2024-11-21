import express from "express";
import { CartController } from "../../controllers/cartController";

const router = express.Router();

router.get("/:clientId", CartController.viewCart);
router.post("/:clientId/add", CartController.addItemToCart);
router.post("/:clientId/remove", CartController.removeItemFromCart);
router.post("/:clientId/clear", CartController.clearCart);

export default router;

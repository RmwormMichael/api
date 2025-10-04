import express from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  getMyOrders,
  updateOrder,
  deleteOrder
} from "../controllers/ordersController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// ✅ Ya NO repetimos "/orders", porque en index.js ya lo declaraste así:
// app.use('/api/orders', ordersRoutes);

// Crear un nuevo pedido
router.post("/", checkAuth, createOrder);

// Obtener todos los pedidos (solo admin)
router.get("/", checkAuth, getOrders);

// Obtener pedidos del usuario autenticado
router.get("/my-orders", checkAuth, getMyOrders);

// Obtener un pedido por ID
router.get("/:id", checkAuth, getOrder);

// Actualizar un pedido por ID
router.put("/:id", checkAuth, updateOrder);

// Eliminar un pedido por ID
router.delete("/:id", checkAuth, deleteOrder);

export default router;

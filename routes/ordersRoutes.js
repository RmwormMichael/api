import express from "express";
import { createOrder, getOrders, getOrder, getMyOrders,  updateOrder, deleteOrder } from "../controllers/ordersController.js";
import checkAuth from "../middleware/checkAuth.js";  // Importa el middleware de autenticación

const router = express.Router();

// Rutas CRUD para los pedidos con protección JWT
router.post("/orders", checkAuth, createOrder);      // Crear un nuevo pedido
router.get("/orders", checkAuth, getOrders);         // Obtener todos los pedidos (para admin)
router.get("/orders/my-orders", checkAuth, getMyOrders);  // Para usuarios normales
router.get("/orders/:id", checkAuth, getOrder);      // Obtener un pedido por ID
router.put("/orders/:id", checkAuth, updateOrder);   // Actualizar un pedido
router.delete("/orders/:id", checkAuth, deleteOrder);// Eliminar un pedido

export default router;

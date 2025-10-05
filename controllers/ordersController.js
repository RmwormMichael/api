// CORRECCIÓN en ordersController.js
import Orders from "../models/orders.js";

// Crear un nuevo pedido - CORREGIDO
const createOrder = async (req, res) => {
    const { date_order, direction, description } = req.body;

    try {
        // ✅ CORRECCIÓN: Usar req.usuario.id_user del token, NO del body
        const orderData = {
            id_user: req.usuario.id_user, // ← SEGURIDAD: Usar el ID del usuario autenticado
            status: "en proceso",
            date_order,
            direction,
            description
        };

        await Orders.create(orderData);
        res.status(201).json({ msg: "Pedido creado correctamente" });
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        res.status(500).json({ msg: "Error al crear el pedido", error });
    }
};

// Obtener todos los pedidos (solo para admin)
const getOrders = async (req, res) => {
    try {
        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({ msg: "No autorizado" });
        }
        
        const orders = await Orders.getAll();
        res.json(orders);
    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        res.status(500).json({ msg: "Error al obtener los pedidos" });
    }
};

// Obtener un pedido por su ID
const getOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Orders.getById(id);
        if (!order) {
            return res.status(404).json({ msg: "Pedido no encontrado" });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener el pedido" });
    }
};

// Obtener todos los pedidos del usuario actual
const getMyOrders = async (req, res) => {
    try {
        console.log('Obteniendo órdenes para usuario:', req.usuario.id_user);
        const orders = await Orders.getByUserId(req.usuario.id_user);
        console.log('Órdenes encontradas:', orders);
        res.json(orders);
    } catch (error) {
        console.error("Error al obtener pedidos del usuario:", error);
        res.status(500).json({ msg: "Error al obtener tus pedidos" });
    }
};

// Actualizar un pedido - CORREGIDO (seguridad)
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status, date_order, direction, description } = req.body; // ❌ QUITAR id_user del body

    try {
        const order = await Orders.getById(id);
        if (!order) {
            return res.status(404).json({ msg: "Pedido no encontrado" });
        }

        // ✅ CORRECCIÓN: No permitir cambiar id_user por seguridad
        const updatedOrder = {};
        if (status !== undefined) updatedOrder.status = status;
        if (date_order !== undefined) updatedOrder.date_order = date_order;
        if (direction !== undefined) updatedOrder.direction = direction;
        if (description !== undefined) updatedOrder.description = description;

        if (Object.keys(updatedOrder).length === 0) {
            return res.status(400).json({ msg: "No se enviaron campos para actualizar" });
        }

        await Orders.update(id, updatedOrder);
        res.status(200).json({ msg: "Pedido actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar el pedido:", error);
        res.status(500).json({ msg: "Error al actualizar el pedido", error });
    }
};

// Eliminar un pedido
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Orders.getById(id);
        if (!order) {
            return res.status(404).json({ msg: "Pedido no encontrado" });
        }

        await Orders.delete(id);
        res.json({ msg: "Pedido eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el pedido:", error);
        res.status(500).json({ msg: "Error al eliminar el pedido", error });
    }
};

export { createOrder, getOrders, getOrder, getMyOrders, updateOrder, deleteOrder };
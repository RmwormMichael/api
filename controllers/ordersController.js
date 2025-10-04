// controllers/ordersController.js
import Orders from "../models/orders.js";

// Crear un nuevo pedido
const createOrder = async (req, res) => {
    const { date_order, direction, id_user, description } = req.body;

    try {
        const orderData = {
            id_user,
            status: "en proceso", // Estado por defecto
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
        // Verificar si el usuario es admin
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
        const orders = await Orders.getByUserId(req.usuario.id_user);
        res.json(orders);
    } catch (error) {
        console.error("Error al obtener pedidos del usuario:", error);
        res.status(500).json({ msg: "Error al obtener tus pedidos" });
    }
};



// Actualizar un pedido
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status, date_order, direction, id_user, description } = req.body;

    try {
        const order = await Orders.getById(id);
        if (!order) {
            return res.status(404).json({ msg: "Pedido no encontrado" });
        }

        // Crear el objeto solo con los campos que vienen en el body
        const updatedOrder = {};

        if (id_user !== undefined) updatedOrder.id_user = id_user;      // Mantiene el id_user si existe
        if (status !== undefined) updatedOrder.status = status;         // Actualiza el status si existe
        if (date_order !== undefined) updatedOrder.date_order = date_order;  
        if (direction !== undefined) updatedOrder.direction = direction;  
        if (description !== undefined) updatedOrder.description = description;

        // Si no hay campos para actualizar
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
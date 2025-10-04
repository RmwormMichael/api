import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectarDB from "./config/db.js";
import usuarioRoute from './routes/usuarioRoutes.js';
import ordersRoutes from "./routes/ordersRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

connectarDB();

// Permitir cualquier origen
app.use(cors({
  origin: "*", // ⚠️ permite cualquier URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


//Routing

app.use('/api/usuarios', usuarioRoute);
app.use('/api/orders', ordersRoutes);


const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


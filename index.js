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

const frontendUrl = process.env.FRONTEND_URL || "";
const whitelist = [
  frontendUrl ? frontendUrl.replace(/\/client.*/, "") : null,
  "http://127.0.0.1:5503"
].filter(Boolean);

   
  console.log("Whitelist:", whitelist);  // Verifica que ahora esté con el puerto correcto
  
// Configuración de CORS
const corsOptions = {
  origin: whitelist,
  methods: ['GET', 'POST','PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

  
  


//Routing

app.use('/api/usuarios', usuarioRoute);
app.use('/api/orders', ordersRoutes);


const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


// index.js
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

// Configuración de CORS más permisiva para desarrollo
const corsOptions = {
  origin: function(origin, callback) {
    // Permite requests sin origin (como Postman) y todos los orígenes en desarrollo
    if (!origin || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    const whitelist = [
      "https://globo-arte.onrender.com",
      "http://localhost:5173",
      "http://127.0.0.1:5503"
    ];
    
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors({
  origin: true, // ✅ Permite cualquier origen
  credentials: true, // ✅ Importante para autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Manejar preflight requests
app.options('*', cors());

// Routing
app.use('/api/usuarios', usuarioRoute);
app.use('/api/orders', ordersRoutes);

// Ruta de salud para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
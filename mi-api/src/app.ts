import express, { Request, Response } from 'express';
import userRoutes from './routes/user.routes.js';
import producto from './routes/producto.routes.js';
import venta from './routes/venta.routes.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", producto);
app.use("/api", venta);

// Ruta de prueba/salud
app.get('/api/status', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

export default app;

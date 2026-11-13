import express from 'express';
import apiRoutes from './routes/api.routes.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json({ limit: "100kb" }));
app.use("/api", apiRoutes);

// Ruta de prueba/salud
app.get('/api/status', (_req, res) => {
    res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

app.use((_req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});
app.use(errorHandler);

export default app;

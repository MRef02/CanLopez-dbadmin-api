import { Router } from "express";
import { getVenta, getVentas, createVenta, updateVenta, deleteVenta } from "../controllers/venta.controller.js";

const router = Router();

router.get('/venta/:id', getVenta);
router.get('/ventas', getVentas);
router.post('/venta', createVenta);
router.put('/venta/:id', updateVenta);
router.delete('/venta/:id', deleteVenta);

export default router;

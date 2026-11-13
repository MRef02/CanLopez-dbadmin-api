import { Router } from "express";
import { crearEnvio, actualizarCosto, registrarRastreo, listarEnvios } from "../controllers/envio.controller.js";
import { agregarPaquete } from "../controllers/almacen.controller.js";
import { listarEnviosCliente } from "../controllers/cliente.controller.js";

const router = Router();
router.post("/envios", crearEnvio);
router.put("/envios/:id/costo", actualizarCosto);
router.post("/almacenes/:id/paquetes", agregarPaquete);
router.post("/envios/:id/rastreo", registrarRastreo);
router.get("/envios", listarEnvios);
router.get("/clientes/:id/envios", listarEnviosCliente);
export default router;

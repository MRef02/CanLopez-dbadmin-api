import type { RequestHandler } from "express";
import { clienteService } from "../services/cliente.service.js";
import { id } from "../validation.js";

export const listarEnviosCliente: RequestHandler = async (req, res) => {
    res.json(await clienteService.listarEnvios(id(req.params.id)));
};

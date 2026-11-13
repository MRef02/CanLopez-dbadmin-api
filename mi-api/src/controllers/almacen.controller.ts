import type { RequestHandler } from "express";
import { almacenService } from "../services/almacen.service.js";
import { id, object, packageInput } from "../validation.js";

export const agregarPaquete: RequestHandler = async (req, res) => {
    const almacenId = id(req.params.id);
    const body = object(req.body);
    res.status(201).json(await almacenService.agregarPaquete(
        packageInput(body, almacenId), id(body.envioId, "envioId"),
    ));
};

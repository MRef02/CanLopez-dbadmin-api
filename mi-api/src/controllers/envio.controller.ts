import type { RequestHandler } from "express";
import { envioService } from "../services/envio.service.js";
import { HttpError } from "../middleware/error-handler.js";
import { object, id, money, packageInput, text, state, date } from "../validation.js";

export const crearEnvio: RequestHandler = async (req, res) => {
    const body = object(req.body);
    if (!Array.isArray(body.paquetes) || body.paquetes.length === 0 || body.paquetes.length > 100) {
        throw new HttpError(400, "paquetes debe contener entre 1 y 100 paquetes iniciales");
    }
    const envio = await envioService.crear({
        clienteId: id(body.clienteId, "clienteId"),
        direccinOrigenId: id(body.direccinOrigenId, "direccinOrigenId"),
        direccionDestinoId: id(body.direccionDestinoId, "direccionDestinoId"),
        costo: money(body.costo),
        paquetes: body.paquetes.map(p => packageInput(p)),
    });
    res.status(201).json(envio);
};

export const actualizarCosto: RequestHandler = async (req, res) => {
    const idEnvio = id(req.params.id);
    const body = object(req.body);
    res.json(await envioService.actualizarCosto(idEnvio, money(body.costo)));
};

export const registrarRastreo: RequestHandler = async (req, res) => {
    const idEnvio = id(req.params.id);
    const body = object(req.body);
    res.status(201).json(await envioService.registrarRastreo(idEnvio, {
        ubicacion: text(body.ubicacion, "ubicacion"),
        estado: state(body.estado),
        fecha: date(body.fecha),
    }));
};

export const listarEnvios: RequestHandler = async (_req, res) => {
    res.json(await envioService.listarActivos());
};

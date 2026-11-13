import { AppDataSource } from "../config/data-source.js";
import { Cliente } from "../entity/Cliente.js";
import { Envio } from "../entity/Envio.js";
import { HistorialRastreo } from "../entity/HistorialRastreo.js";
import { Paquete } from "../entity/Paquete.js";
import { In } from "typeorm";
import { HttpError } from "../middleware/error-handler.js";
import { lockAlmacenes } from "./almacen.service.js";
import type { EstadoEnvio } from "../entity/Envio.js";
import type { PaqueteInput } from "../validation.js";

interface CrearEnvioInput {
    clienteId: number;
    direccinOrigenId: number;
    direccionDestinoId: number;
    costo: string;
    paquetes: PaqueteInput[];
}

export const envioService = {
    async crear(input: CrearEnvioInput) {
        return AppDataSource.transaction("READ COMMITTED", async manager => {
            const cliente = await manager.getRepository(Cliente).findOneBy({ id_cliente: input.clienteId });
            if (!cliente) throw new HttpError(404, "No existe el cliente");
            await lockAlmacenes(manager, input.paquetes.map(paquete => paquete.almacenId));
            const envio = await manager.getRepository(Envio).save(manager.getRepository(Envio).create({
                clienteId: input.clienteId,
                direccinOrigenId: input.direccinOrigenId,
                direccionDestinoId: input.direccionDestinoId,
                costo: input.costo,
                fechaRegistro: new Date(),
                fechaEntrega: null,
                estado: "registrado",
            }));
            await manager.getRepository(Paquete).save(input.paquetes.map(paquete => ({
                ...paquete,
                envioId: envio.idEnvio,
            })));
            return manager.getRepository(Envio).findOne({
                where: { idEnvio: envio.idEnvio },
                relations: { paquetes: true },
            });
        });
    },

    async actualizarCosto(idEnvio: number, costo: string) {
        const repo = AppDataSource.getRepository(Envio);
        const envio = await repo.findOneBy({ idEnvio });
        if (!envio) throw new HttpError(404, "No existe el envío");
        envio.costo = costo;
        return repo.save(envio);
    },

    async registrarRastreo(idEnvio: number, input: { ubicacion: string; estado: EstadoEnvio; fecha: Date }) {
        const envio = await AppDataSource.getRepository(Envio).findOneBy({ idEnvio });
        if (!envio) throw new HttpError(404, "No existe el envío");
        return AppDataSource.getRepository(HistorialRastreo).save(
            AppDataSource.getRepository(HistorialRastreo).create({ envioId: idEnvio, ...input }),
        );
    },

    async listarActivos() {
        return AppDataSource.getRepository(Envio).find({
            where: { estado: In(["registrado", "transito"]) },
            relations: { cliente: true, paquetes: true, destino: true, rastreos: true },
            order: { fechaRegistro: "DESC", idEnvio: "DESC" },
        });
    },
};

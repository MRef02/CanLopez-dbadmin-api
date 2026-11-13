import { AppDataSource } from "../config/data-source.js";
import { Cliente } from "../entity/Cliente.js";
import { Envio } from "../entity/Envio.js";
import { HttpError } from "../middleware/error-handler.js";

export const clienteService = {
    async listarEnvios(clienteId: number) {
        const cliente = await AppDataSource.getRepository(Cliente).findOneBy({ id_cliente: clienteId });
        if (!cliente) throw new HttpError(404, "No existe el cliente");
        return AppDataSource.getRepository(Envio).find({
            where: { clienteId },
            relations: { cliente: true, paquetes: true, destino: true, rastreos: true },
            order: { fechaRegistro: "DESC", idEnvio: "DESC", rastreos: { fecha: "ASC", idRastreo: "ASC" } },
        });
    },
};

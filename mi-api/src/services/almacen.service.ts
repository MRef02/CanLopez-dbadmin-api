import type { EntityManager } from "typeorm";
import { AppDataSource } from "../config/data-source.js";
import { Almacen } from "../entity/Almacen.js";
import { Envio } from "../entity/Envio.js";
import { Paquete } from "../entity/Paquete.js";
import { HttpError } from "../middleware/error-handler.js";
import type { PaqueteInput } from "../validation.js";

export async function lockAlmacenes(manager: EntityManager, ids: number[]): Promise<void> {
    for (const idAlmacen of [...new Set(ids)].sort((a, b) => a - b)) {
        const almacen = await manager.getRepository(Almacen).findOne({
            where: { idAlmacen },
            lock: { mode: "pessimistic_write" },
        });
        if (!almacen) throw new HttpError(404, `No existe el almacén ${idAlmacen}`);
    }
}

export const almacenService = {
    async agregarPaquete(input: PaqueteInput, envioId: number) {
        return AppDataSource.transaction("READ COMMITTED", async manager => {
            const envio = await manager.getRepository(Envio).findOneBy({ idEnvio: envioId });
            if (!envio) throw new HttpError(404, "No existe el envío");
            await lockAlmacenes(manager, [input.almacenId]);
            const repo = manager.getRepository(Paquete);
            return repo.save(repo.create({ ...input, envioId }));
        });
    },
};

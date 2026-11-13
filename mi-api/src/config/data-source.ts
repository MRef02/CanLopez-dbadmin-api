import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";
import { Cliente } from "../entity/Cliente.js";
import { Direccion } from "../entity/Direccion.js";
import { Almacen } from "../entity/Almacen.js";
import { Envio } from "../entity/Envio.js";
import { Paquete } from "../entity/Paquete.js";
import { HistorialRastreo } from "../entity/HistorialRastreo.js";
import { AuditoriaEnvio } from "../entity/AuditoriaEnvio.js";

export const AppDataSource = new DataSource({
    type: "mysql", // O "mariadb"
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3310),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "secret",
    database: process.env.DB_NAME || "logiexpress",
    synchronize: false, // Se mantiene false ya que las tablas fueron creadas previamente por SQL
    logging: false,
    entities: [Cliente, Direccion, Almacen, Envio, Paquete, HistorialRastreo, AuditoriaEnvio],
    subscribers: [],
    migrations: [],
});

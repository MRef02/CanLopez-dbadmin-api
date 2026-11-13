import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Cliente } from "./Cliente.js";
import { Almacen } from "./Almacen.js";
import { Direccion } from "./Direccion.js";
import { Paquete } from "./Paquete.js";
import { HistorialRastreo } from "./HistorialRastreo.js";
import { AuditoriaEnvio } from "./AuditoriaEnvio.js";

export const estadosEnvio = ["registrado", "transito", "entregado", "cancelado"] as const;
export type EstadoEnvio = typeof estadosEnvio[number];

@Entity("envio")
export class Envio {
    @PrimaryGeneratedColumn() idEnvio!: number;
    @Column({ type: "int" }) clienteId!: number;
    // Nombre exacto de la base existente: no renombrar la columna desde la API.
    @Column({ type: "int" }) direccinOrigenId!: number;
    @Column({ type: "int" }) direccionDestinoId!: number;
    @Column({ type: "decimal", precision: 10, scale: 2 }) costo!: string;
    @Column({ type: "datetime" }) fechaRegistro!: Date;
    @Column({ type: "datetime", nullable: true }) fechaEntrega!: Date | null;
    @Column({ type: "enum", enum: [...estadosEnvio] }) estado!: EstadoEnvio;
    @ManyToOne(() => Cliente, cliente => cliente.envios)
    @JoinColumn({ name: "clienteId" }) cliente!: Relation<Cliente>;
    @ManyToOne(() => Almacen, almacen => almacen.envios)
    @JoinColumn({ name: "direccinOrigenId" }) origen!: Relation<Almacen>;
    @ManyToOne(() => Direccion)
    @JoinColumn({ name: "direccionDestinoId" }) destino!: Relation<Direccion>;
    @OneToMany(() => Paquete, paquete => paquete.envio) paquetes!: Relation<Paquete[]>;
    @OneToMany(() => HistorialRastreo, rastreo => rastreo.envio) rastreos!: Relation<HistorialRastreo[]>;
    @OneToMany(() => AuditoriaEnvio, auditoria => auditoria.envio) auditorias!: Relation<AuditoriaEnvio[]>;
}

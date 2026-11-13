import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import type { Relation } from "typeorm";
import { Envio } from "./Envio.js";
import { Direccion } from "./Direccion.js";

@Entity("cliente")
export class Cliente {
    @PrimaryGeneratedColumn() id_cliente!: number;
    @Column({ type: "varchar", length: 101 }) nombre!: string;
    @Column({ type: "varchar", length: 100, nullable: true }) apellido!: string | null;
    @Column({ type: "enum", enum: ["activo", "inactivo"] }) estado!: string;
    @Column({ type: "decimal", precision: 10, scale: 2 }) limiteCredito!: string;
    @OneToMany(() => Envio, envio => envio.cliente) envios!: Relation<Envio[]>;
    @OneToMany(() => Direccion, direccion => direccion.cliente) direcciones!: Relation<Direccion[]>;
}

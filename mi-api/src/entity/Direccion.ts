import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Cliente } from "./Cliente.js";

@Entity("direcciones")
export class Direccion {
    @PrimaryGeneratedColumn() idDirecciones!: number;
    @Column({ type: "int" }) clienteID!: number;
    @Column({ type: "varchar", length: 142 }) calle!: string;
    @Column({ type: "varchar", length: 143 }) ciudad!: string;
    @Column({ type: "varchar", length: 144 }) estado!: string;
    @ManyToOne(() => Cliente, cliente => cliente.direcciones, { onDelete: "CASCADE" })
    @JoinColumn({ name: "clienteID" }) cliente!: Relation<Cliente>;
}

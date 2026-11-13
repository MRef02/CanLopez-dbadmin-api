import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import type { Relation } from "typeorm";
import { Paquete } from "./Paquete.js";
import { Envio } from "./Envio.js";

@Entity("almacen")
export class Almacen {
    @PrimaryGeneratedColumn() idAlmacen!: number;
    @Column({ type: "varchar", length: 111 }) nombreAlmacen!: string;
    @Column({ type: "varchar", length: 67 }) calle!: string;
    @Column({ type: "varchar", length: 68 }) ciudad!: string;
    @Column({ type: "varchar", length: 69 }) estado!: string;
    @Column({ type: "int", unsigned: true }) capacidad!: number;
    @OneToMany(() => Paquete, paquete => paquete.almacen) paquetes!: Relation<Paquete[]>;
    @OneToMany(() => Envio, envio => envio.origen) envios!: Relation<Envio[]>;
}

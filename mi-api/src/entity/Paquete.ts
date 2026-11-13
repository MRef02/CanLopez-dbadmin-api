import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Envio } from "./Envio.js";
import { Almacen } from "./Almacen.js";

@Entity("paquete")
export class Paquete {
    @PrimaryGeneratedColumn() idPaquete!: number;
    @Column({ type: "int", nullable: true }) envioId!: number | null;
    @Column({ type: "int" }) almacenId!: number;
    @Column({ type: "float" }) peso!: number;
    @Column({ type: "varchar", length: 100 }) dimensiones!: string;
    @Column({ type: "varchar", length: 100 }) contenido!: string;
    @ManyToOne(() => Envio, envio => envio.paquetes, { nullable: true })
    @JoinColumn({ name: "envioId" }) envio!: Relation<Envio> | null;
    @ManyToOne(() => Almacen, almacen => almacen.paquetes)
    @JoinColumn({ name: "almacenId" }) almacen!: Relation<Almacen>;
}

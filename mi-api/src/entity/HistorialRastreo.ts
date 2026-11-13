import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Envio } from "./Envio.js";
import type { EstadoEnvio } from "./Envio.js";

@Entity("rastreo")
export class HistorialRastreo {
    @PrimaryGeneratedColumn() idRastreo!: number;
    @Column({ type: "int" }) envioId!: number;
    @Column({ type: "datetime" }) fecha!: Date;
    @Column({ type: "varchar", length: 100 }) ubicacion!: string;
    @Column({ type: "enum", enum: ["registrado", "transito", "entregado", "cancelado"] })
    estado!: EstadoEnvio;
    @ManyToOne(() => Envio, envio => envio.rastreos)
    @JoinColumn({ name: "envioId" }) envio!: Relation<Envio>;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Envio } from "./Envio.js";

@Entity("auditoria_envios")
export class AuditoriaEnvio {
    @PrimaryGeneratedColumn() idAuditoria!: number;
    @Column({ type: "int" }) envioId!: number;
    @Column({ type: "float", nullable: true }) costoAnterior!: number | null;
    @Column({ type: "float", nullable: true }) costoNuevo!: number | null;
    @Column({ type: "datetime" }) fecha!: Date;
    @Column({ type: "varchar", length: 100 }) usuario!: string;
    @ManyToOne(() => Envio, envio => envio.auditorias)
    @JoinColumn({ name: "envioId" }) envio!: Relation<Envio>;
}

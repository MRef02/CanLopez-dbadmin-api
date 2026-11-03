import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, type Relation } from "typeorm";
import { Categoria } from "./Categoria.js";
import { DetalleVenta } from "./DetalleVenta.js";

@Entity("productos")
export class Producto {
    @PrimaryGeneratedColumn({ name: "producto_id" })
    productoId!: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre!: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    precio!: number;

    @Column({ type: "int", default: 0 })
    stock!: number;

    @Column({ name: "categoria_id", type: "int", nullable: true })
    categoriaId!: number;

    // Relación Muchos a Uno: Muchos productos pertenecen a una categoría
    @ManyToOne(() => Categoria, (categoria) => categoria.productos, { onDelete: "SET NULL" })
    @JoinColumn({ name: "categoria_id" })
    categoria!: Relation<Categoria>;

    // Relación Uno a Muchos: Un producto puede estar en varios detalles de venta
    @OneToMany(() => DetalleVenta, (detalle) => detalle.producto)
    detallesVenta!: Relation<DetalleVenta[]>;
}

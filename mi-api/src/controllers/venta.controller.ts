import { Request, Response } from "express";
import { ventaRepository } from '../repository/VentaRepository.js';
import { Venta } from '../entity/Venta.js';


export const getVenta = async (req: Request, res: Response) => {
    const venta: Venta | null = await ventaRepository.findById(Number(req.params.id));

    if (!venta) {
        return res.status(404).json({ message: "Venta no encontrada" });
    }

    return res.json({ venta });
}

export const getVentas = async (req: Request, res: Response) => {
    const ventas: Venta[] = await ventaRepository.findAll();
    return res.json({ ventas });
}

export const createVenta = async (req: Request, res: Response) => {
    const venta: Venta = await ventaRepository.create(req.body);
    return res.status(201).json({ venta });
}

export const updateVenta = async (req: Request, res: Response) => {
    const venta: Venta | null = await ventaRepository.update(Number(req.params.id), req.body);

    if (!venta) {
        return res.status(404).json({ message: "Venta no encontrada" });
    }

    return res.json({ venta });
}

export const deleteVenta = async (req: Request, res: Response) => {
    const eliminado: boolean = await ventaRepository.delete(Number(req.params.id));

    if (!eliminado) {
        return res.status(404).json({ message: "Venta no encontrada" });
    }

    return res.json({ message: "Venta eliminada" });
}

import { HttpError } from "./middleware/error-handler.js";
import { estadosEnvio } from "./entity/Envio.js";
import type { EstadoEnvio } from "./entity/Envio.js";

export function object(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new HttpError(400, "Envía un objeto JSON");
    }
    return value as Record<string, unknown>;
}

export function id(value: unknown, name = "id"): number {
    if (!["string", "number"].includes(typeof value) || !/^[1-9]\d*$/.test(String(value))) {
        throw new HttpError(400, `${name} debe ser un entero positivo`);
    }
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number > 2147483647) {
        throw new HttpError(400, `${name} está fuera del rango permitido`);
    }
    return number;
}

export function money(value: unknown): string {
    if (!["string", "number"].includes(typeof value) ||
        !/^\d{1,8}(\.\d{1,2})?$/.test(String(value))) {
        throw new HttpError(400, "costo debe ser de 0 a 99999999.99, con máximo dos decimales");
    }
    return Number(value).toFixed(2);
}

export function text(value: unknown, name: string, max = 100): string {
    if (typeof value !== "string" || !value.trim() || value.length > max) {
        throw new HttpError(400, `${name} es obligatorio y admite hasta ${max} caracteres`);
    }
    return value.trim();
}

export function state(value: unknown): EstadoEnvio {
    if (typeof value !== "string" || !estadosEnvio.includes(value as EstadoEnvio)) {
        throw new HttpError(400, "estado debe ser registrado, transito, entregado o cancelado");
    }
    return value as EstadoEnvio;
}

export function date(value: unknown): Date {
    if (value === undefined) return new Date();
    if (typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) ||
        !Number.isFinite(Date.parse(value))) {
        throw new HttpError(400, "fecha debe tener formato ISO con zona horaria, por ejemplo 2026-11-13T10:00:00-06:00");
    }
    const day = value.slice(0, 10);
    if (new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) !== day) {
        throw new HttpError(400, "fecha contiene un día inválido");
    }
    return new Date(value);
}

export interface PaqueteInput {
    almacenId: number;
    peso: number;
    dimensiones: string;
    contenido: string;
}

export function packageInput(value: unknown, almacenId?: number): PaqueteInput {
    const body = object(value);
    if (typeof body.peso !== "number" || !Number.isFinite(body.peso) ||
        body.peso <= 0 || body.peso > 3.4028234663852886e38) {
        throw new HttpError(400, "peso debe ser un número positivo dentro del rango FLOAT");
    }
    return {
        almacenId: almacenId ?? id(body.almacenId, "almacenId"),
        peso: body.peso,
        dimensiones: text(body.dimensiones, "dimensiones"),
        contenido: text(body.contenido, "contenido"),
    };
}

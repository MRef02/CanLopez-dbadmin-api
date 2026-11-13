import type { ErrorRequestHandler } from "express";

export class HttpError extends Error {
    constructor(public readonly statusCode: number, message: string) {
        super(message);
        this.name = "HttpError";
    }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof HttpError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
    }

    console.error("Error no controlado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
};

# Guía de Implementación: Endpoints GET con Node.js y TypeScript

Esta guía detalla la implementación de dos endpoints de tipo `GET` con respuestas estructuradas en formato JSON.

---

## 📋 Endpoints a Crear

1. **`GET /api/users`**: Retorna información general del sistema en formato JSON.
2. **`GET /api/users/:id`**: Recibe un parámetro de ruta (`id`) y retorna un usuario específico.

---

## 🛠️ Código Paso a Paso

### 1. Controlador (`src/controllers/user.controller.ts`)

Contiene la lógica para procesar las peticiones HTTP y estructurar las respuestas JSON:

```typescript
import { Request, Response } from 'express';

// GET /api/users
export const getUsers = (req: Request, res: Response) => {
    res.json({
        code: "200_OK",
        data: {
            appName: "Mi API Node",
            version: "1.0.0"
        }
    });
};

// GET /api/users/:id
export const getUserById = (req: Request, res: Response) => {
    const { id } = req.params;

    res.json({
        code: "200_OK",
        data: {
            id: id,
            name: "Carlos",
            lastname: "Mendoza"
        }
    });
};
```

### 2. Rutas (`src/routes/user.routes.ts`)

Mapea los endpoints con las funciones definidas en el controlador:

```typescript
import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/user.controller.js';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);

export default router;
```

### 3. Registro en la Aplicación (`src/app.ts`)

Monta el router en la instancia principal de Express:

```typescript
import express from 'express';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(express.json());
app.use('/api', userRoutes);

export default app;
```

---

## 🔍 Estructura de las Respuestas JSON

### Endpoint 1: `GET http://localhost:3000/api/users`

**Respuesta:**
```json
{
  "code": "200_OK",
  "data": {
    "appName": "Mi API Node",
    "version": "1.0.0"
  }
}
```

### Endpoint 2: `GET http://localhost:3000/api/users/123`

**Respuesta:**
```json
{
  "code": "200_OK",
  "data": {
    "id": "123",
    "name": "Carlos",
    "lastname": "Mendoza"
  }
}
```

---

## 🔑 Puntos Clave

* **Parámetros Dinámicos (`req.params`):** El id enviado en la URL (`/users/123`) se captura usando `req.params.id`.
* **Formato Estándar:** El método `res.json()` convierte automáticamente los objetos JavaScript en JSON con las cabeceras HTTP necesarias.
* **Separación de Responsabilidades:** Las rutas solo mapean direcciones URL a funciones, mientras que los controladores gestionan las respuestas.
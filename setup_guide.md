# Guía de Inicio: API con Node.js, Express y TypeScript

Esta guía detalla los pasos y puntos clave para estructurar y ejecutar una API básica, limpia y modular en Node.js utilizando TypeScript.

---

## 🚀 Pasos a Seguir

### 1. Inicializar el Proyecto y Dependencias

Crea el directorio del proyecto, inicializa `npm` e instala los paquetes necesarios (incluyendo dependencias de desarrollo para TypeScript y tipados):

```bash
mkdir mi-api && cd mi-api
npm init -y
npm install express dotenv
npm install -D typescript tsx @types/node @types/express
```

> **Nota:** Usamos `tsx` para ejecutar y observar cambios en archivos TypeScript en tiempo de desarrollo sin necesidad de compilar manualmente.

---

### 2. Configurar TypeScript

Genera el archivo `tsconfig.json`:

```bash
npx tsc --init
```

Asegúrate de ajustar los siguientes valores en tu `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

### 3. Estructurar el Proyecto

Crea la siguiente arquitectura interna dentro del directorio `src/`:

```text
mi-api/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── app.ts
│   └── server.ts
├── .env
├── tsconfig.json
└── package.json
```

---

### 4. Crear la Aplicación y el Servidor

#### **`src/app.ts`** (Configuración de Express)
```typescript
import express, { Request, Response } from 'express';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba/salud
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

export default app;
```

#### **`src/server.ts`** (Punto de entrada)
```typescript
import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

---

### 5. Configurar Scripts en `package.json`

Añade los comandos para entorno de desarrollo y compilación de producción:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

Para iniciar el entorno de desarrollo con recarga automática:

```bash
npm run dev
```

---

## 🔑 Puntos Claves a Tomar en Cuenta

* **Extensiones en Imports (`.js`):** Al usar la resolución ESM moderna (`NodeNext`), las importaciones de archivos locales deben incluir explicitamente la extensión `.js` (ej. `import app from './app.js';`), aun cuando el archivo de código fuente sea `.ts`.
* **Tipado Estricto:** Mantén `"strict": true` activo en tu `tsconfig.json`. Evita usar el tipo `any` y define interfaces o types para solicitudes (`req.body`, `req.query`) y respuestas de endpoints.
* **Separación de Capas:** Aísla la configuración de la app (`app.ts`), la escucha de red (`server.ts`), las rutas y los controladores. Esta estructura facilitará integrar la base de datos (MySQL) posteriormente sin refactorizaciones complejas.
* **Variables de Entorno:** Utiliza un archivo `.env` desde la etapa inicial para manejar variables globales como puertos, variables de entorno de producción/desarrollo y futuras credenciales de BD.
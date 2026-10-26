# EJERCICIO 04 · CREAR DATOS DESDE EL MÓVIL: Food Spots 🍜

## Objetivo
Construir y comprobar `POST /restaurantes` utilizando datos persistidos en PostgreSQL (`databridge_e04`) mediante TypeORM (`repository.create()` y `repository.save()`), un DTO de entrada (`CreateRestauranteDto`) y un formulario en React Native con Expo que incorpora el campo `precioMedio`.

## Estructura
```text
EJERCICIO-04/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── restaurantes/
│   │       ├── restaurante.entity.ts
│   │       ├── create-restaurante.dto.ts
│   │       ├── restaurantes.module.ts
│   │       ├── restaurantes.service.ts
│   │       └── restaurantes.controller.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── App.tsx
│   ├── package.json
│   └── app.json
└── README.md
```

## Backend (NestJS + TypeORM)
- **Base de datos**: `databridge_e04` en PostgreSQL.
- **Entity**: `Restaurante` (`id`, `nombre`, `tipo`, `ciudad`, `puntuacion`, `precioMedio`).
- **DTO**: `CreateRestauranteDto` que incluye `precioMedio`.
- **Operaciones**:
  - `POST /restaurantes`: Recibe el Body, construye la entidad en memoria y la persiste.
  - `GET /restaurantes`: Lista los restaurantes creados.

## Frontend (React Native + Expo)
- `App.tsx` implementa el formulario interactivo para capturar nombre, tipo, ciudad y `precioMedio`, envía la petición HTTP POST y dibuja la tarjeta del restaurante persistido.

## Comprobación
1. **Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Crear restaurante (POST)**:
   ```bash
   curl -i -X POST http://localhost:3000/restaurantes \
     -H "Content-Type: application/json" \
     -d "{\"nombre\":\"La Trattoria\",\"tipo\":\"Italiano\",\"ciudad\":\"Zaragoza\",\"precioMedio\":25}"
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npx expo start
   ```

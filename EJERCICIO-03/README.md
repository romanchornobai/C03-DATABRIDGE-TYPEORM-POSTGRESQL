# EJERCICIO 03 · LEER UN REGISTRO CONCRETO: Pet Profile 🐾

## Objetivo
Construir y comprobar `GET /mascotas/:id` utilizando datos persistidos en PostgreSQL (`databridge_e03`) con TypeORM (`findOneBy({ id })`), control de errores 404 (`NotFoundException`) y representar la ficha en React Native con Expo incluyendo el atributo persistente `nivelEnergia`.

## Estructura
```text
EJERCICIO-03/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── mascotas/
│   │       ├── mascota.entity.ts
│   │       ├── mascotas.module.ts
│   │       ├── mascotas.service.ts
│   │       └── mascotas.controller.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── App.tsx
│   ├── package.json
│   └── app.json
└── README.md
```

## Backend (NestJS + TypeORM)
- **Base de datos**: `databridge_e03` en PostgreSQL.
- **Entity**: `Mascota` (`id`, `nombre`, `raza`, `edad`, `ciudad`, `nivelEnergia`).
- **Operaciones**:
  - `GET /mascotas/:id`: Usa `ParseIntPipe` y `findOneBy({ id })`.
  - Si no existe el recurso, lanza `NotFoundException` (HTTP 404).

## Frontend (React Native + Expo)
- `App.tsx` solicita `GET /mascotas/1` y presenta la ficha estilizada de la mascota junto a su indicador de `nivelEnergia`.

## Comprobación
1. **Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Consultar API (Éxito)**:
   ```bash
   curl http://localhost:3000/mascotas/1
   ```
3. **Consultar API (404 Not Found)**:
   ```bash
   curl http://localhost:3000/mascotas/999
   ```
4. **Frontend**:
   ```bash
   cd frontend
   npx expo start
   ```

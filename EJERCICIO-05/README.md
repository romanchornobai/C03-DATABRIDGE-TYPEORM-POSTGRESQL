# EJERCICIO 05 · ACTUALIZAR DATOS: Travel Book ✈️

## Objetivo
Construir y comprobar `PATCH /viajes/:id` utilizando datos persistidos en PostgreSQL (`databridge_e05`) mediante TypeORM (`repository.merge()` y `repository.save()`), un DTO de actualización (`UpdateViajeDto`) con propiedades opcionales, permitiendo editar tanto el `estado` como la `fecha` desde una interfaz en React Native con Expo.

## Estructura
```text
EJERCICIO-05/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── viajes/
│   │       ├── viaje.entity.ts
│   │       ├── update-viaje.dto.ts
│   │       ├── viajes.module.ts
│   │       ├── viajes.service.ts
│   │       └── viajes.controller.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── App.tsx
│   ├── package.json
│   └── app.json
└── README.md
```

## Backend (NestJS + TypeORM)
- **Base de datos**: `databridge_e05` en PostgreSQL.
- **Entity**: `Viaje` (`id`, `destino`, `pais`, `estado`, `fecha`).
- **DTO**: `UpdateViajeDto` (`estado?: string; fecha?: string;`).
- **Operaciones**:
  - `GET /viajes/:id`: Recupera los datos actuales del viaje.
  - `PATCH /viajes/:id`: Actualiza parcialmente los campos recibidos mediante `merge()` y `save()`.

## Frontend (React Native + Expo)
- `App.tsx` muestra la ficha del viaje, un formulario para modificar `estado` y `fecha`, y envía la petición `PATCH /viajes/1`.

## Comprobación
1. **Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Actualizar fecha y estado (PATCH)**:
   ```bash
   curl -i -X PATCH http://localhost:3000/viajes/1 \
     -H "Content-Type: application/json" \
     -d "{\"estado\":\"REALIZADO\",\"fecha\":\"2027-04-10\"}"
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npx expo start
   ```

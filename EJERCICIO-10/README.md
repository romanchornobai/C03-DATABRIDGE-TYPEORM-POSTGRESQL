# EJERCICIO 10 · FULL STACK CHALLENGE: Wander 🌍

## Objetivo
Desarrollar una solución Full Stack completa con autonomía técnica integrando un CRUD completo (`GET`, `POST`, `PATCH`, `DELETE`) en NestJS con PostgreSQL (`databridge_e10`), TypeORM y una aplicación en React Native con Expo.

## Mejoras Incorporadas (Persistencia + API + UI)
1. **Prioridad del destino (`prioridad: 'ALTA' | 'MEDIA' | 'BAJA'`)**:
   - Persistida en PostgreSQL como columna en la tabla `destinos`.
   - Modificable en la creación y representada con badges visuales distintivos según la urgencia del viaje.
2. **Estado de Visita (`visitado: boolean`)**:
   - Permite alternar entre `Visitado ✓` y `Pendiente` mediante un endpoint dedicado `PATCH /destinos/:id/visitar`.
   - Modifica el estado en la base de datos y se refresca de forma reactiva en la interfaz.

## Estructura
```text
EJERCICIO-10/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── destinos/
│   │       ├── destino.entity.ts
│   │       ├── create-destino.dto.ts
│   │       ├── update-destino.dto.ts
│   │       ├── destinos.module.ts
│   │       ├── destinos.service.ts
│   │       └── destinos.controller.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── App.tsx
│   ├── package.json
│   └── app.json
└── README.md
```

## Backend (NestJS + TypeORM)
- **Base de datos**: `databridge_e10` en PostgreSQL.
- **Entity**: `Destino` (`id`, `ciudad`, `pais`, `descripcion`, `prioridad`, `visitado`).
- **Operaciones**:
  - `GET /destinos`: Lista todos los destinos.
  - `GET /destinos/:id`: Detalle de un destino.
  - `POST /destinos`: Crea un nuevo destino.
  - `PATCH /destinos/:id`: Modifica campos de forma parcial.
  - `PATCH /destinos/:id/visitar`: Alterna el estado de visita (`visitado = !visitado`).
  - `DELETE /destinos/:id`: Elimina el registro en PostgreSQL.

## Frontend (React Native + Expo)
- `App.tsx` implementa:
  - Formulario de alta con selector de prioridad (`ALTA`, `MEDIA`, `BAJA`).
  - Alternancia interactiva de estado de visita tocando el badge.
  - Edición rápida de notas.
  - Eliminación con refresco reactivo.

## Comprobación
1. **Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Ciclo CRUD en API**:
   ```bash
   # Create
   curl -i -X POST http://localhost:3000/destinos \
     -H "Content-Type: application/json" \
     -d '{"ciudad":"Reikiavik","pais":"Islandia","descripcion":"Auroras","prioridad":"ALTA"}'

   # Read
   curl http://localhost:3000/destinos

   # Update / Alternar visita
   curl -i -X PATCH http://localhost:3000/destinos/1/visitar

   # Delete
   curl -i -X DELETE http://localhost:3000/destinos/1
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npx expo start
   ```

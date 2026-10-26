# EJERCICIO 07 · CRUD COMPLETO: Sneaker Vault 👟

## Objetivo
Construir y comprobar un flujo CRUD integral (`GET`, `POST`, `PATCH`, `DELETE` en `/sneakers`) utilizando PostgreSQL (`databridge_e07`), TypeORM y una interfaz en React Native con Expo. Incorporar el campo persistente `stock: number`, y una regla reactiva en la interfaz que represente `AGOTADO` cuando `stock === 0`.

## Estructura
```text
EJERCICIO-07/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── sneakers/
│   │       ├── sneaker.entity.ts
│   │       ├── create-sneaker.dto.ts
│   │       ├── update-sneaker.dto.ts
│   │       ├── sneakers.module.ts
│   │       ├── sneakers.service.ts
│   │       └── sneakers.controller.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── App.tsx
│   ├── package.json
│   └── app.json
└── README.md
```

## Backend (NestJS + TypeORM)
- **Base de datos**: `databridge_e07` en PostgreSQL.
- **Entity**: `Sneaker` (`id`, `marca`, `modelo`, `precio`, `talla`, `stock`).
- **DTOs**: `CreateSneakerDto`, `UpdateSneakerDto`.
- **Operaciones**:
  - `GET /sneakers`: Colección completa.
  - `GET /sneakers/:id`: Consulta individual.
  - `POST /sneakers`: Creación de recurso.
  - `PATCH /sneakers/:id`: Modificación parcial (precio, stock, etc.).
  - `DELETE /sneakers/:id`: Eliminación física en PostgreSQL.

## Frontend (React Native + Expo)
- `App.tsx` integra todas las operaciones:
  - Crear nuevas sneakers.
  - Ajustar o rebajar precios.
  - Modificar stock en tiempo real (+1 / -1).
  - Regla visual: Si `stock === 0`, muestra badge rojo **AGOTADO**.
  - Eliminar y refrescar la colección (`cargar()`).

## Comprobación
1. **Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Ciclo CRUD en API**:
   ```bash
   # Create
   curl -i -X POST http://localhost:3000/sneakers -H "Content-Type: application/json" -d '{"marca":"Nike","modelo":"Air Max 1","precio":149.99,"talla":42,"stock":4}'

   # Read All
   curl http://localhost:3000/sneakers

   # Update (rebajar precio o cambiar stock)
   curl -i -X PATCH http://localhost:3000/sneakers/1 -H "Content-Type: application/json" -d '{"precio":139.99,"stock":0}'

   # Delete
   curl -i -X DELETE http://localhost:3000/sneakers/1
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npx expo start
   ```

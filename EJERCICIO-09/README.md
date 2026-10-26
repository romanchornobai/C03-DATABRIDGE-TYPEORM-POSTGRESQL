# EJERCICIO 09 · CONSULTAR Y FILTRAR: Event Radar 🎟️

## Objetivo
Construir y comprobar el filtrado dinámico mediante Query Params (`GET /eventos?ciudad=...&categoria=...`) en NestJS utilizando PostgreSQL (`databridge_e09`) y TypeORM (`FindOptionsWhere`). Crear una interfaz en React Native con Expo que combine ambos filtros en tiempo real.

## Estructura
```text
EJERCICIO-09/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── eventos/
│   │       ├── evento.entity.ts
│   │       ├── eventos.module.ts
│   │       ├── eventos.service.ts
│   │       └── eventos.controller.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── App.tsx
│   ├── package.json
│   └── app.json
└── README.md
```

## Backend (NestJS + TypeORM)
- **Base de datos**: `databridge_e09` en PostgreSQL.
- **Entity**: `Evento` (`id`, `nombre`, `ciudad`, `categoria`, `fecha`).
- **Operación**:
  - `GET /eventos`: Lee `@Query('ciudad')` y `@Query('categoria')`, construyendo de forma condicional un objeto `where` para TypeORM.

## Frontend (React Native + Expo)
- `App.tsx` implementa filtros rápidos y personalizados por ciudad y categoría, construyendo la query string dinámica `?ciudad=...&categoria=...` y refrescando la cartelera.

## Comprobación
1. **Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Consultar sin filtros (Todos)**:
   ```bash
   curl http://localhost:3000/eventos
   ```
3. **Filtrar por ciudad**:
   ```bash
   curl "http://localhost:3000/eventos?ciudad=Zaragoza"
   ```
4. **Filtro combinado (ciudad + categoría)**:
   ```bash
   curl "http://localhost:3000/eventos?ciudad=Zaragoza&categoria=Tecnolog%C3%ADa"
   ```
5. **Frontend**:
   ```bash
   cd frontend
   npx expo start
   ```

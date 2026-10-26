# EJERCICIO 02 · LEER UNA COLECCIÓN: CineBox 🎬

## Objetivo
Construir y comprobar `GET /peliculas` utilizando datos persistidos en PostgreSQL (`databridge_e02`) con TypeORM (`repository.find()`) y mostrarlos en React Native con Expo, incluyendo el atributo persistente `favorita` (representado mediante `♥` / `♡`).

## Estructura
```text
EJERCICIO-02/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── peliculas/
│   │       ├── pelicula.entity.ts
│   │       ├── peliculas.module.ts
│   │       ├── peliculas.service.ts
│   │       └── peliculas.controller.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── App.tsx
│   ├── package.json
│   └── app.json
└── README.md
```

## Backend (NestJS + TypeORM)
- **Base de datos**: `databridge_e02` en PostgreSQL.
- **Entity**: `Pelicula` (`id`, `titulo`, `genero`, `anio`, `puntuacion`, `favorita`).
- **Operación**: `repository.find({ order: { puntuacion: 'DESC' } })`.

## Frontend (React Native + Expo)
- `App.tsx` consulta `GET /peliculas` y renderiza la lista con `FlatList`.
- Representación visual del campo favorita:
  - `♥` si `favorita === true`
  - `♡` si `favorita === false`

## Comprobación
1. **Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Consultar API**:
   ```bash
   curl http://localhost:3000/peliculas
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npx expo start
   ```

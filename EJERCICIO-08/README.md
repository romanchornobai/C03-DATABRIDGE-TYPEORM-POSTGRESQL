# EJERCICIO 08 · RELACIONAR DATOS: My Playlists 🎵

## Objetivo
Construir y comprobar una relación relacional completa en PostgreSQL (`databridge_e08`) utilizando TypeORM:
- `@OneToMany`: Una `Playlist` tiene muchas `Cancion`.
- `@ManyToOne`: Una `Cancion` pertenece a una `Playlist` (alojando la clave foránea `playlistId`).
- Recuperar la entidad padre junto con sus hijas usando `relations: { canciones: true }`.
- Reto: Permitir añadir canciones a una playlist concreta con `POST /playlists/:id/canciones`.

## Estructura
```text
EJERCICIO-08/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── playlists/
│   │       ├── playlist.entity.ts
│   │       ├── cancion.entity.ts
│   │       ├── create-cancion.dto.ts
│   │       ├── playlists.module.ts
│   │       ├── playlists.service.ts
│   │       └── playlists.controller.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── App.tsx
│   ├── package.json
│   └── app.json
└── README.md
```

## Backend (NestJS + TypeORM)
- **Base de datos**: `databridge_e08` en PostgreSQL.
- **Entidades**:
  - `Playlist` (`id`, `nombre`, `canciones`).
  - `Cancion` (`id`, `titulo`, `artista`, `playlist`).
- **Operaciones**:
  - `GET /playlists/:id`: Devuelve la playlist con su array de `canciones` cargado.
  - `POST /playlists/:id/canciones`: Busca la playlist padre y le asocia una nueva canción persistente.

## Frontend (React Native + Expo)
- `App.tsx` consulta `GET /playlists/1` y dibuja la lista de canciones relacionadas, e integra un formulario interactivo para registrar canciones nuevas en la playlist.

## Comprobación
1. **Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Consultar Playlist con canciones (GET)**:
   ```bash
   curl http://localhost:3000/playlists/1
   ```
3. **Añadir canción a la Playlist (POST)**:
   ```bash
   curl -i -X POST http://localhost:3000/playlists/1/canciones \
     -H "Content-Type: application/json" \
     -d "{\"titulo\":\"Midnight City\",\"artista\":\"M83\"}"
   ```
4. **Frontend**:
   ```bash
   cd frontend
   npx expo start
   ```

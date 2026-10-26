# EJERCICIO 06 · ELIMINAR Y SINCRONIZAR LA INTERFAZ: My Library 📚

## Objetivo
Construir y comprobar `DELETE /libros/:id` utilizando datos persistidos en PostgreSQL (`databridge_e06`) con TypeORM (`repository.remove()`), sincronizar el estado reactivo en React Native (`filter()`) para reflejar los cambios en la UI sin reiniciar, e implementar el reto de **Marcar como leído** utilizando `PATCH /libros/:id/leido`.

## Estructura
```text
EJERCICIO-06/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── libros/
│   │       ├── libro.entity.ts
│   │       ├── libros.module.ts
│   │       ├── libros.service.ts
│   │       └── libros.controller.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── App.tsx
│   ├── package.json
│   └── app.json
└── README.md
```

## Backend (NestJS + TypeORM)
- **Base de datos**: `databridge_e06` en PostgreSQL.
- **Entity**: `Libro` (`id`, `titulo`, `autor`, `genero`, `leido: boolean`).
- **Operaciones**:
  - `GET /libros`: Lista todos los libros.
  - `DELETE /libros/:id`: Busca el libro (lanza 404 si no existe) y lo elimina mediante `repository.remove()`.
  - `PATCH /libros/:id/leido`: Modifica la propiedad `leido` sin alterar el resto de atributos.

## Frontend (React Native + Expo)
- `App.tsx` lista los libros y ofrece dos acciones por tarjeta:
  - **Eliminar**: Pide confirmación nativa con `Alert.alert`, envía `DELETE` al backend y sincroniza la lista localmente con `filter()`.
  - **Marcar como leído**: Envía `PATCH` y actualiza inmediatamente la etiqueta entre `Leído ✓` y `Pendiente`.

## Comprobación
1. **Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Listar libros**:
   ```bash
   curl http://localhost:3000/libros
   ```
3. **Marcar como leído (PATCH)**:
   ```bash
   curl -i -X PATCH http://localhost:3000/libros/1/leido \
     -H "Content-Type: application/json" \
     -d "{\"leido\":true}"
   ```
4. **Eliminar libro (DELETE)**:
   ```bash
   curl -i -X DELETE http://localhost:3000/libros/1
   ```
5. **Frontend**:
   ```bash
   cd frontend
   npx expo start
   ```

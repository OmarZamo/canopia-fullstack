# Canopia — Reto Full-Stack

Aplicación **full-stack** con **autenticación JWT** y **CRUD de productos**.

- **Backend:** Node.js + Express + TypeScript + Prisma (MySQL)
- **Frontend:** Angular 19 + PrimeNG 19
- **Seguridad:** JWT con expiración de **5 minutos**

---

## Requisitos

- **MySQL** 8 en local
- **Git**
- **Base de datos** existente: `BDPruebaTecnicaCanopia`

> Sugerencia: use `127.0.0.1` en `DATABASE_URL` si su servicio MySQL no acepta `localhost`.

---

## Variables de entorno

Copia el archivo de ejemplo y ajusta según tu entorno:

```bash
cd server
cp .env.example .env
```

Contenido recomendado para `.env`:

```env
DATABASE_URL="mysql://canopia:pass123@127.0.0.1:3306/BDPruebaTecnicaCanopia"
JWT_SECRET="change_me"
JWT_EXPIRES_IN="5m"
PORT=3000
```

---

## Instalación de dependencias

Ejecuta estos comandos después de clonar el repositorio:

```bash
npm install
cd server
npm install
cd ../client
npm install
cd ..
```

---

## Primera ejecución (setup inicial)

Esta sección contempla la primera vez que se clona y levanta el proyecto.

- **Crear/confirmar la BD**  
Asegúrate de tener creada `BDPruebaTecnicaCanopia` en MySQL.

- **Cargar categorías iniciales (requeridas)**  
El CRUD de productos exige `category_id`. Inserta categorías activas (puedes ajustar nombres):

```sql
USE BDPruebaTecnicaCanopia;

INSERT INTO categories (name, description, status)
VALUES
  ('General', 'Categoría general', 1),
  ('Electrónica', 'Dispositivos y componentes', 1),
  ('Libros', 'Libros y material de lectura', 1);
```

- **Preparar el backend (API)**

```bash
cd server
npx prisma generate
npm run seed:user     # crea el usuario admin / Admin123!
```

- **Volver a la raíz y levantar todo con un solo comando**

```bash
cd ..
npm run dev           # inicia API (http://localhost:3000) y Web (http://localhost:4200)
```

- **Nota: si prefieres levantar por separado:**

```bash
# API
cd server && npm run dev

# Web
cd client && npm start
```

---

## Ejecuciones posteriores

Cuando el entorno ya está configurado (BD + categorías + .env generados):

```bash
npm run dev
```

---

## Credenciales de prueba

- **Usuario:** `admin`
- **Contraseña:** `Admin123!`

El token expira cada 5 minutos. El frontend redirige a `/login` al expirar o ante respuestas 401.

---






# Mundo Frappe - Sistema de Menú y Administración

Sistema completo de gestión de menú con Firebase Realtime Database para Mundo Frappe.

## Características

- **Página de Menú**: Visualización de productos organizados por categorías
- **Panel de Administración**: Gestión completa de categorías y productos
- **Subida de Imágenes**: Soporte para URLs y archivos locales
- **Firebase Realtime Database**: Almacenamiento en tiempo real
- **Firebase Storage**: Almacenamiento de imágenes

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## Estructura del Proyecto

- `/src/pages/Menu.jsx` - Página principal del menú
- `/src/pages/Admin.jsx` - Panel de administración
- `/src/services/database.js` - Servicios para Firebase Realtime Database
- `/src/services/storage.js` - Servicios para Firebase Storage
- `/src/firebase/config.js` - Configuración de Firebase

## Funcionalidades del Administrador

### Categorías
- Agregar nuevas categorías
- Editar categorías existentes
- Eliminar categorías
- Subir imágenes por URL o archivo

### Productos
- Agregar nuevos productos
- Editar productos existentes
- Eliminar productos
- Asignar precios y categorías
- Control de disponibilidad
- Subir imágenes por URL o archivo

## Tecnologías Utilizadas

- React 18
- React Router DOM
- Firebase (Realtime Database, Storage, Analytics)
- CSS3










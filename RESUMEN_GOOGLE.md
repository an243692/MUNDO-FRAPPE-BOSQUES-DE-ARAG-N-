# 🎯 RESUMEN: Cómo aparecer en Google (3 pasos)

## ⚡ Pasos Rápidos

### 1️⃣ Agrega el código de verificación de Google

1. Ve a: https://search.google.com/search-console
2. Agrega tu propiedad (tu URL de Firebase Hosting)
3. Elige verificación por "Etiqueta HTML"
4. Copia el código que te da (solo el contenido después de `content="`)
5. Abre `public/index.html`
6. Busca la línea 19 que dice: `<!-- <meta name="google-site-verification"...`
7. Descomenta esa línea y pega tu código
8. Guarda, luego ejecuta:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```
9. Vuelve a Search Console y haz clic en "Verificar"

### 2️⃣ Actualiza el sitemap con tu URL real

1. Abre `public/sitemap.xml`
2. Reemplaza `https://mundofrappe.com/` con tu URL real (la de Firebase Hosting)
3. También actualiza `public/robots.txt` (línea del Sitemap)
4. Ejecuta:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### 3️⃣ Envía el sitemap a Google

1. En Google Search Console, ve a "Sitemaps"
2. Ingresa: `sitemap.xml`
3. Haz clic en "Enviar"

## ✅ ¡Listo!

Espera 3 días a 4 semanas y tu sitio aparecerá en Google.

---

**📖 Para instrucciones detalladas, lee: `GUIA_GOOGLE.md`**






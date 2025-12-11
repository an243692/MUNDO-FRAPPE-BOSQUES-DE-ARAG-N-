# Guía de SEO - Mundo Frappe

## Archivos SEO Implementados

### 1. Meta Tags Básicos (`public/index.html`)
- ✅ Meta tags primarios (title, description, keywords)
- ✅ Open Graph tags para Facebook
- ✅ Twitter Cards
- ✅ Canonical URL
- ✅ Theme color

### 2. Archivos Estáticos
- ✅ `public/robots.txt` - Control de acceso para bots
- ✅ `public/sitemap.xml` - Mapa del sitio

### 3. SEO Dinámico (`src/components/SEO.jsx`)
- ✅ Componente SEO reutilizable con react-helmet-async
- ✅ Meta tags dinámicos basados en contenido
- ✅ Structured Data (Schema.org) automático

### 4. Structured Data
- ✅ Schema.org Restaurant
- ✅ Schema.org Menu y MenuSection
- ✅ Schema.org MenuItem
- ✅ Datos estructurados dinámicos basados en productos y categorías

## Personalización

### Cambiar el Dominio

Debes actualizar el dominio en los siguientes archivos:

1. **`public/index.html`**
   - Buscar y reemplazar: `https://mundofrappe.com/` por tu dominio real

2. **`public/robots.txt`**
   - Actualizar: `Sitemap: https://mundofrappe.com/sitemap.xml`

3. **`public/sitemap.xml`**
   - Actualizar todas las URLs: `https://mundofrappe.com/`

4. **`src/components/SEO.jsx`**
   - Actualizar: `const siteUrl = "https://mundofrappe.com";`

5. **`src/pages/Menu.jsx`**
   - El structured data ya usa el dominio del componente SEO

### Agregar Información del Negocio

Para agregar información del negocio (dirección, teléfono, etc.), edita `src/components/SEO.jsx`:

```javascript
const defaultStructuredData = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "Mundo Frappe",
  "description": "Cafetería especializada en frappes, cafés y bebidas deliciosas",
  "url": siteUrl,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tu dirección",
    "addressLocality": "Tu ciudad",
    "addressRegion": "Tu estado",
    "postalCode": "Tu código postal",
    "addressCountry": "MX"
  },
  "telephone": "+52-XX-XXXX-XXXX",
  "servesCuisine": "Bebidas",
  "priceRange": "$$"
};
```

### Agregar Imágenes para Redes Sociales

1. Crea dos imágenes:
   - `og-image.jpg` (1200x630px) - Para Facebook/Open Graph
   - `twitter-image.jpg` (1200x675px) - Para Twitter

2. Colócalas en la carpeta `public/`

3. Las imágenes se referenciarán automáticamente en los meta tags

### Generar Sitemap Dinámico

Actualmente el sitemap es estático. Para hacerlo dinámico, puedes:

1. Crear un script que genere el sitemap basado en tus categorías y productos
2. Actualizar el sitemap cada vez que agregues productos nuevos
3. O usar un servicio como `react-router-sitemap`

## Verificación SEO

### Herramientas Recomendadas

1. **Google Search Console**
   - Verificar el sitemap
   - Revisar errores de indexación
   - Monitorear rendimiento

2. **Google Rich Results Test**
   - Verificar structured data
   - URL: https://search.google.com/test/rich-results

3. **Facebook Sharing Debugger**
   - Verificar Open Graph tags
   - URL: https://developers.facebook.com/tools/debug/

4. **Twitter Card Validator**
   - Verificar Twitter Cards
   - URL: https://cards-dev.twitter.com/validator

### Checklist SEO

- [ ] Dominio actualizado en todos los archivos
- [ ] Información del negocio agregada al structured data
- [ ] Imágenes OG y Twitter creadas y subidas
- [ ] Sitemap verificado en Google Search Console
- [ ] Structured data validado con Google Rich Results Test
- [ ] Meta tags verificados con herramientas de validación
- [ ] Robots.txt verificado (no bloquea contenido importante)

## Mejoras Futuras

- [ ] Agregar breadcrumbs structured data
- [ ] Implementar sitemap dinámico
- [ ] Agregar hreflang tags si hay múltiples idiomas
- [ ] Optimizar imágenes con lazy loading y formatos modernos
- [ ] Implementar AMP (Accelerated Mobile Pages)
- [ ] Agregar FAQ structured data si aplica

## Notas Importantes

- Los archivos `robots.txt` y `sitemap.xml` se copian automáticamente desde `public/` a `build/` durante el build
- El structured data se genera dinámicamente basado en tus productos y categorías
- Los meta tags se actualizan automáticamente cuando cambias de categoría en el menú
- Firebase Hosting ya está configurado para servir correctamente estos archivos






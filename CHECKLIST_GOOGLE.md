# ✅ Checklist para aparecer en Google

## 📝 Pasos a seguir (marca cada uno cuando lo completes)

### Paso 1: Obtener tu URL
- [ ] Ir a Firebase Console: https://console.firebase.google.com
- [ ] Buscar la sección "Hosting"
- [ ] Anotar la URL de tu sitio (ejemplo: `https://mundo-frappe-bosques.web.app`)

### Paso 2: Verificar en Google Search Console
- [ ] Ir a: https://search.google.com/search-console
- [ ] Hacer clic en "Agregar propiedad"
- [ ] Seleccionar "Prefijo de URL" e ingresar tu URL de Firebase
- [ ] Seleccionar método de verificación: "Etiqueta HTML"
- [ ] Copiar el código de verificación (solo el contenido después de `content="`)

### Paso 3: Agregar código de verificación al sitio
- [ ] Abrir archivo: `public/index.html`
- [ ] Buscar línea 19 (comentario sobre Google Search Console)
- [ ] Descomentar la línea y pegar tu código de verificación
- [ ] Guardar el archivo

### Paso 4: Actualizar URLs en archivos
- [ ] Abrir `public/sitemap.xml`
- [ ] Reemplazar `https://mundofrappe.com/` con tu URL real
- [ ] Guardar el archivo
- [ ] Abrir `public/robots.txt`
- [ ] Reemplazar `https://mundofrappe.com/sitemap.xml` con tu URL real + `/sitemap.xml`
- [ ] Guardar el archivo

### Paso 5: Desplegar cambios
- [ ] Abrir terminal en la carpeta del proyecto
- [ ] Ejecutar: `npm run build`
- [ ] Ejecutar: `firebase deploy --only hosting`
- [ ] Esperar a que termine el despliegue

### Paso 6: Completar verificación
- [ ] Volver a Google Search Console
- [ ] Hacer clic en "Verificar"
- [ ] Confirmar que dice "Verificación exitosa"

### Paso 7: Enviar sitemap
- [ ] En Google Search Console, ir a "Sitemaps" en el menú lateral
- [ ] Ingresar: `sitemap.xml`
- [ ] Hacer clic en "Enviar"
- [ ] Verificar que dice "Correcto" o "Pendiente"

### Paso 8: Solicitar indexación (opcional)
- [ ] En Google Search Console, ir a "Inspección de URLs"
- [ ] Ingresar tu URL principal
- [ ] Hacer clic en "Solicitar indexación"

## ⏰ Después de completar

### Verificación inmediata
- [ ] Abrir en navegador: `https://tu-dominio.com/robots.txt` (debe funcionar)
- [ ] Abrir en navegador: `https://tu-dominio.com/sitemap.xml` (debe funcionar)
- [ ] Buscar en Google: `site:tu-dominio.com` (puede tardar días en aparecer)

### Esperar indexación
- ⏰ **Tiempo estimado**: 3 días a 4 semanas
- 📊 Monitorear en Google Search Console > Cobertura
- 🔍 Buscar periódicamente en Google: `site:tu-dominio.com`

## 📚 Documentación de referencia

- **Guía completa**: Lee `GUIA_GOOGLE.md` para instrucciones detalladas
- **Resumen rápido**: Lee `RESUMEN_GOOGLE.md` para versión corta
- **Guía SEO**: Lee `SEO.md` para optimización avanzada

## ❓ Problemas comunes

### "No puedo verificar"
- ✅ Verifica que hayas desplegado después de agregar el meta tag
- ✅ Espera 5-10 minutos después del deploy
- ✅ Revisa que el meta tag esté exactamente como Google lo dio

### "El sitemap tiene errores"
- ✅ Verifica que la URL del sitemap use `https://`
- ✅ Asegúrate de que `sitemap.xml` tenga formato XML válido

### "No aparece en Google después de semanas"
- ✅ Verifica que robots.txt no esté bloqueando (debe decir `Allow: /`)
- ✅ Solicita indexación manualmente
- ✅ Comparte tu sitio en redes sociales para generar tráfico

---

**🎯 Objetivo**: Tu sitio aparecerá en Google cuando alguien busque términos relacionados con tu negocio.






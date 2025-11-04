# 📲 Guía de Instalación - Cuaderno Digital PWA

## 🌐 Requisitos Previos

Para instalar la PWA necesitas:
- Un navegador compatible (Chrome, Edge, Safari, Firefox)
- Conexión a internet (solo para la primera instalación)
- La aplicación debe estar servida vía HTTPS o localhost

## 🖥️ Método 1: Probar Localmente

### Opción A: Usando Python (Recomendado)

1. Abre una terminal en la carpeta del proyecto
2. Ejecuta el servidor:
   ```bash
   python server.py
   ```
3. Abre tu navegador en `http://localhost:8000`
4. Sigue las instrucciones de instalación más abajo

### Opción B: Usando Node.js

1. Instala `http-server` globalmente:
   ```bash
   npm install -g http-server
   ```
2. Ejecuta el servidor:
   ```bash
   http-server -p 8000
   ```
3. Abre tu navegador en `http://localhost:8000`

### Opción C: Usando PHP

```bash
php -S localhost:8000
```

### Opción D: Live Server (VS Code)

1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

## 🚀 Método 2: Desplegar en un Servidor Web

### GitHub Pages

1. Sube el proyecto a un repositorio de GitHub
2. Ve a Settings → Pages
3. Selecciona la rama principal (main/master)
4. Guarda y espera unos minutos
5. Tu app estará disponible en `https://tu-usuario.github.io/tu-repo`

### Netlify

1. Sube el proyecto a GitHub
2. Crea una cuenta en [Netlify](https://netlify.com)
3. Click en "New site from Git"
4. Conecta tu repositorio
5. Deploy automático

### Vercel

1. Instala Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Desde la carpeta del proyecto:
   ```bash
   vercel
   ```
3. Sigue las instrucciones en pantalla

## 📱 Instalar la PWA

### En Chrome/Edge (Windows, Mac, Linux)

1. Abre la aplicación en el navegador
2. Haz clic en el **menú hamburguesa (☰)** en la esquina superior izquierda
3. Selecciona **"Instalar App"**
4. Confirma en el diálogo que aparece
5. La app se instalará y aparecerá un icono en tu escritorio

**Alternativa:**
- Busca el icono de instalación (➕ o ⬇️) en la barra de direcciones
- Haz clic y confirma

### En Safari (iOS)

1. Abre la aplicación en Safari
2. Toca el botón **Compartir** (cuadrado con flecha hacia arriba)
3. Desplázate y selecciona **"Añadir a pantalla de inicio"**
4. Edita el nombre si lo deseas
5. Toca **"Añadir"**

### En Safari (macOS)

1. Abre la aplicación en Safari
2. Ve a **Archivo → Añadir a Dock**
3. La app aparecerá en tu Dock

### En Chrome/Edge (Android)

1. Abre la aplicación en Chrome/Edge
2. Toca el **menú hamburguesa (☰)** en la app
3. Selecciona **"Instalar App"**
4. Confirma en el banner que aparece
5. La app se instalará en tu pantalla de inicio

**Alternativa:**
- Toca el menú del navegador (⋮)
- Selecciona "Instalar app" o "Añadir a pantalla de inicio"

## ✅ Verificar que la PWA está instalada

### Windows/Linux
- Busca "Cuaderno Digital" en el menú de inicio
- Verás el icono de la aplicación

### macOS
- Busca en el Dock o Launchpad
- La app tendrá su propio icono

### iOS/Android
- Busca el icono en tu pantalla de inicio
- Abre la app como cualquier otra aplicación

## 🔧 Características de la PWA Instalada

✅ **Funciona offline** - Una vez instalada, puedes usarla sin internet
✅ **Acceso rápido** - Icono en escritorio/pantalla de inicio
✅ **Experiencia nativa** - Se ve y se comporta como una app instalada
✅ **Actualizaciones automáticas** - Se actualiza sola cuando hay conexión
✅ **Notificaciones** (futuro) - Potencial para notificaciones push
✅ **Sin barra del navegador** - Pantalla completa dedicada

## 🗑️ Desinstalar la PWA

### Windows
1. Haz clic derecho en el icono de la app
2. Selecciona "Desinstalar"

### macOS
1. Haz clic derecho en el icono del Dock
2. Opciones → Quitar del Dock
3. O arrastra el icono fuera del Dock

### iOS
1. Mantén presionado el icono
2. Selecciona "Eliminar app"
3. Confirma

### Android
1. Mantén presionado el icono
2. Selecciona "Desinstalar"
3. Confirma

## 🐛 Solución de Problemas

### No veo la opción "Instalar App"

**Causas posibles:**
- La app ya está instalada
- El navegador no soporta PWA
- La app no está servida vía HTTPS o localhost
- Los archivos del Service Worker tienen errores

**Soluciones:**
1. Verifica que estés usando Chrome, Edge o Safari
2. Asegúrate de estar en `https://` o `localhost`
3. Abre la consola del navegador (F12) y busca errores
4. Intenta en modo incógnito/privado

### La app no funciona offline

1. Abre las DevTools (F12)
2. Ve a la pestaña "Application" → "Service Workers"
3. Verifica que el Service Worker esté activo
4. Si no, haz clic en "Unregister" y recarga la página

### No se actualiza la app

1. Cierra completamente la aplicación
2. Limpia la caché del navegador
3. Abre la app de nuevo
4. O fuerza la actualización desde las DevTools

### Problemas de caché

Si ves contenido antiguo:
1. Abre DevTools (F12)
2. Pestaña "Application" → "Storage"
3. Click en "Clear site data"
4. Recarga la página

## 📚 Recursos Adicionales

- [¿Qué es una PWA?](https://web.dev/progressive-web-apps/)
- [Service Workers](https://developer.mozilla.org/es/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/es/docs/Web/Manifest)

## 💬 Soporte

Si tienes problemas con la instalación:
1. Verifica la consola del navegador (F12)
2. Revisa que todos los archivos estén presentes
3. Asegúrate de tener la última versión de los archivos

---

¡Disfruta de tu Cuaderno Digital! 📝✨


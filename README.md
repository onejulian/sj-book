# 📓 Cuaderno Digital

Una aplicación web moderna para organizar tus ideas, notas y pensamientos de manera jerárquica y eficiente.

## ✨ Características

### 📱 Progressive Web App (PWA)
- **Instalable**: Instala la app en tu dispositivo como una aplicación nativa
- **Funciona sin internet**: Accede a tus notas incluso sin conexión
- **Actualizaciones automáticas**: El contenido se actualiza automáticamente cuando hay conexión
- **Experiencia nativa**: Se comporta como una app instalada

### 🗂️ Organización Jerárquica
- **Secciones**: Categoriza tus contenidos por temas principales
- **Páginas**: Agrupa notas relacionadas dentro de cada sección
- **Entradas**: Captura tus ideas detalladas con título y contenido

### 🔍 Búsqueda Inteligente
- Busca en todos los niveles: secciones, páginas y entradas
- Filtrado en tiempo real mientras escribes
- Búsqueda por título y contenido

### 💾 Gestión de Datos

#### Exportar Datos
1. Haz clic en el menú hamburguesa (☰) en la pantalla de Secciones
2. Selecciona **"Exportar datos"**
3. Se descargará automáticamente un archivo JSON con toda tu información
4. El archivo incluye la fecha y hora del backup en el nombre

#### Importar Datos
1. Haz clic en el menú hamburguesa (☰) en la pantalla de Secciones
2. Selecciona **"Importar datos"**
3. Elige un archivo JSON exportado previamente
4. El sistema validará que el archivo tenga el formato correcto
5. Si es válido, se mostrará una advertencia explicando que:
   - Se reemplazará todo el contenido actual
   - La acción es **irreversible**
   - Se recomienda exportar los datos actuales antes de continuar
6. Confirma para completar la importación

⚠️ **Importante**: 
- Solo se pueden importar archivos exportados desde esta aplicación
- La importación reemplaza completamente todos los datos actuales
- Se recomienda hacer backups regulares usando la función de exportar

### 🎨 Personalización
- 12 iconos diferentes para personalizar tus secciones
- Tema oscuro para reducir la fatiga visual
- Interfaz moderna y minimalista

### 📱 Almacenamiento Local
- Todos los datos se guardan en tu navegador
- No requiere conexión a internet
- Privacidad total: tus datos nunca salen de tu dispositivo

## 🚀 Inicio Rápido

### Opción 1: Uso Directo (Solo lectura de archivos locales)
1. Descarga el proyecto
2. Abre `index.html` en tu navegador
3. ⚠️ Nota: La PWA no funcionará sin un servidor

### Opción 2: Con Servidor Local (Recomendado para PWA)
```bash
# Usando Python (incluido en el proyecto)
python server.py

# O con Node.js
npx http-server -p 8000

# O con PHP
php -S localhost:8000
```
Luego abre `http://localhost:8000` en tu navegador.

### 📲 Instalar como PWA
1. Abre la aplicación en tu navegador (Chrome, Edge, Safari)
2. Haz clic en el **menú hamburguesa (☰)**
3. Selecciona **"Instalar App"** (solo aparece si la app puede ser instalada)
4. Confirma la instalación
5. ¡Listo! La app aparecerá en tu escritorio/pantalla de inicio

📖 **Guía completa de instalación:** Ver [INSTALL.md](INSTALL.md)

**Beneficios de instalar:**
- ✅ Acceso rápido desde tu escritorio o pantalla de inicio
- ✅ Funciona sin conexión a internet
- ✅ No ocupa espacio en la barra de navegación
- ✅ Experiencia de app nativa
- ✅ Actualizaciones automáticas

### Crear Contenido
- **Nueva Sección**: Botón (+) en la pantalla principal → Elige nombre e icono
- **Nueva Página**: Entra a una sección → Botón (+) → Ingresa el nombre
- **Nueva Entrada**: Entra a una página → Botón (+) → Escribe título y contenido

### Editar o Eliminar
- Pasa el mouse sobre cualquier elemento
- Aparecerán botones de **Editar** y **Eliminar**
- Los cambios se guardan automáticamente

### Buscar
- Haz clic en el icono de búsqueda (🔍) en cualquier pantalla
- Escribe para filtrar los resultados en tiempo real
- Haz clic de nuevo en el icono para cerrar la búsqueda

## 🛠️ Tecnologías

- HTML5
- JavaScript (ES6+)
- Tailwind CSS
- Material Symbols (iconos)
- LocalStorage API
- Service Worker (PWA)
- Web App Manifest

## 📋 Estructura de Datos

```json
{
  "sections": [
    {
      "id": "unique-id",
      "name": "Nombre de la Sección",
      "icon": "icono-material",
      "lastModified": 1234567890,
      "pages": [
        {
          "id": "unique-id",
          "name": "Nombre de la Página",
          "date": 1234567890,
          "entries": [
            {
              "id": "unique-id",
              "title": "Título de la Entrada",
              "content": "Contenido de la entrada...",
              "lastModified": 1234567890
            }
          ]
        }
      ]
    }
  ]
}
```

## 🔒 Privacidad y Seguridad

- Todos los datos se almacenan localmente en tu navegador
- No hay servidores externos ni transferencia de datos
- Puedes usar la aplicación completamente offline
- Tus notas permanecen 100% privadas

## 💡 Consejos

1. **Instala la app**: Para una mejor experiencia, instálala como PWA
2. **Haz backups regulares**: Exporta tus datos periódicamente para evitar pérdidas
3. **Organiza desde el principio**: Piensa en categorías claras para tus secciones
4. **Usa la búsqueda**: Es más rápido que navegar manualmente cuando tienes muchas notas
5. **Nombres descriptivos**: Facilita encontrar lo que buscas más adelante
6. **Limpia regularmente**: Elimina entradas obsoletas para mantener todo organizado
7. **Funciona offline**: Una vez instalada, puedes usarla sin internet

## 📝 Archivos del Proyecto

### HTML
- `index.html` - Pantalla de bienvenida
- `sections.html` - Vista de secciones
- `pages.html` - Vista de páginas
- `entries.html` - Vista de entradas

### JavaScript
- `app.js` - Lógica central y gestión de almacenamiento
- `sections.js` - Funcionalidad de secciones
- `pages.js` - Funcionalidad de páginas
- `entries.js` - Funcionalidad de entradas
- `pwa-installer.js` - Gestor de instalación PWA

### PWA
- `manifest.json` - Configuración de la aplicación web
- `service-worker.js` - Caché y funcionamiento offline
- `public/icons/` - Iconos para diferentes dispositivos

## 🎯 Versión

**v1.1** - Versión con PWA completa
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Búsqueda en todos los niveles
- ✅ Importación/Exportación de datos
- ✅ PWA instalable
- ✅ Funcionamiento offline
- ✅ Service Worker para caché
- ✅ Instalación desde menú hamburguesa

---

Hecho con ❤️ para organizar tus ideas


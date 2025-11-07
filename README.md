# 📓 Cuaderno Digital

Una Progressive Web App (PWA) moderna construida con **Vue 3** y **Rspack** para organizar tus ideas, notas y pensamientos de manera jerárquica y eficiente. Funciona completamente offline y respeta tu privacidad al mantener todos los datos en tu dispositivo.

[![Vue 3](https://img.shields.io/badge/Vue-3.4-42b883?style=flat&logo=vue.js)](https://vuejs.org/)
[![Rspack](https://img.shields.io/badge/Rspack-1.1-1e90ff?style=flat)](https://www.rspack.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5a0fc8?style=flat)](https://web.dev/progressive-web-apps/)

🌐 **Demo en vivo:** [sj-book.juliandavid.co](https://sj-book.juliandavid.co)

## 📑 Tabla de Contenidos

- [Características](#-características)
- [Inicio Rápido](#-inicio-rápido)
- [Uso de la Aplicación](#uso-de-la-aplicación)
- [Tecnologías](#️-tecnologías)
- [Estructura de Datos](#-estructura-de-datos)
- [Privacidad y Seguridad](#-privacidad-y-seguridad)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Desarrollo](#-desarrollo)
- [Versión Actual](#-versión-actual)
- [Licencia](#-licencia)
- [Contribuciones](#-contribuciones)

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

### Requisitos Previos
- Node.js (v16 o superior)
- npm o yarn

### Instalación

1. **Clona el repositorio y instala dependencias:**
```bash
# Clonar el proyecto
git clone [url-del-repositorio]
cd sj-book

# Instalar dependencias
npm install
```

2. **Modo Desarrollo:**
```bash
# Inicia el servidor de desarrollo con hot-reload
npm run dev
```
Abre `http://localhost:3000` en tu navegador. Los cambios se reflejarán automáticamente.

3. **Build para Producción:**
```bash
# Genera los archivos optimizados en /dist
npm run build

# Preview del build de producción
npm run preview
```

### Uso sin Build (Solo Producción Pre-compilada)
Si tienes el directorio `dist/` ya generado:
```bash
# Sirve la carpeta dist con cualquier servidor HTTP
npx serve dist -p 8000
```
Luego abre `http://localhost:8000` en tu navegador.

### 📲 Instalar como PWA
1. Abre la aplicación en tu navegador (Chrome, Edge, Safari)
2. Haz clic en el **menú hamburguesa (☰)**
3. Selecciona **"Instalar App"** (solo aparece si la app puede ser instalada)
4. Confirma la instalación
5. ¡Listo! La app aparecerá en tu escritorio/pantalla de inicio

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

**En Desktop:**
- Pasa el mouse sobre cualquier elemento
- Aparecerán botones de **Editar** y **Eliminar**
- Los cambios se guardan automáticamente

**En Móvil/Tablet:**
- Mantén presionado un elemento por 0.5 segundos
- Aparecerá un menú contextual con opciones de Editar y Eliminar
- Sentirás una pequeña vibración cuando el menú se active

### Buscar
- Haz clic en el icono de búsqueda (🔍) en cualquier pantalla
- Escribe para filtrar los resultados en tiempo real
- Haz clic de nuevo en el icono para cerrar la búsqueda

## 🛠️ Tecnologías

### Framework y Build Tools
- **Vue 3** - Framework progresivo con Composition API
- **Rspack** - Bundler moderno de alto rendimiento (compatible con Webpack)
- **Vue Loader** - Compilación de componentes Single File Component (.vue)

### Estilos
- **Tailwind CSS 3** - Framework CSS utility-first
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Compatibilidad automática entre navegadores
- **@tailwindcss/forms** - Estilos mejorados para formularios

### PWA y Offline
- **Service Worker** - Funcionalidad offline y caché
- **Web App Manifest** - Configuración de PWA instalable
- **LocalStorage API** - Persistencia de datos local

### UI/UX
- **Material Symbols** - Sistema de iconos de Google
- **Inter Font** - Tipografía moderna y legible
- Diseño responsivo mobile-first
- Menú contextual con long-press para móviles

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

## 📁 Estructura del Proyecto

```
sj-book/
├── src/
│   ├── main.js                    # Punto de entrada de la aplicación
│   ├── App.vue                    # Componente raíz
│   │
│   ├── components/                # Componentes Vue
│   │   ├── ContextMenu.vue        # Menú contextual global
│   │   │
│   │   ├── views/                 # Vistas principales
│   │   │   ├── SectionsView.vue   # Vista de secciones
│   │   │   ├── PagesView.vue      # Vista de páginas
│   │   │   └── EntriesView.vue    # Vista de entradas
│   │   │
│   │   ├── items/                 # Componentes de lista
│   │   │   ├── SectionItem.vue    # Item individual de sección
│   │   │   ├── PageItem.vue       # Item individual de página
│   │   │   └── EntryItem.vue      # Item individual de entrada
│   │   │
│   │   └── modals/                # Modales/Diálogos
│   │       ├── SectionModal.vue   # Modal para secciones
│   │       ├── PageModal.vue      # Modal para páginas
│   │       ├── ImportModal.vue    # Modal de importación
│   │       ├── ImportErrorModal.vue
│   │       ├── DeleteModal.vue    # Modal de confirmación
│   │       └── AboutModal.vue     # Modal de información
│   │
│   ├── composables/               # Composables de Vue (lógica reutilizable)
│   │   ├── useNavigation.js       # Sistema de navegación con hash
│   │   ├── useStorage.js          # Gestión de localStorage
│   │   ├── useContextMenu.js      # Lógica de menú contextual
│   │   ├── usePWAInstaller.js     # Instalación PWA
│   │   └── useUtils.js            # Utilidades generales
│   │
│   └── styles/
│       └── main.css               # Estilos globales y Tailwind
│
├── public/                        # Archivos estáticos
│   ├── icons/                     # Iconos PWA (varios tamaños)
│   └── favicon/
│       └── favicon.svg
│
├── dist/                          # Build de producción (generado)
│
├── index.html                     # Template HTML
├── manifest.json                  # Configuración PWA
├── service-worker.js              # Service Worker para offline
├── rspack.config.js               # Configuración de Rspack
├── tailwind.config.js             # Configuración de Tailwind CSS
├── postcss.config.js              # Configuración de PostCSS
└── package.json                   # Dependencias y scripts
```

### Arquitectura

**Composables (Composition API):**
- Lógica reutilizable separada de la UI
- Estado reactivo compartido entre componentes
- Patrón moderno de Vue 3

**Componentes:**
- Single File Components (.vue)
- Estructura clara: Views → Items → Modals
- Props y events para comunicación

**Navegación:**
- Sistema basado en hash (#sections, #pages/:id, #entries/:sectionId/:pageId)
- Sin recarga de página (SPA)
- Estado sincronizado con la URL

## 👨‍💻 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Preview del build (requiere build previo)
npm run preview
```

### Guía de Desarrollo

**Agregar una nueva vista:**
1. Crear componente en `src/components/views/NuevaView.vue`
2. Agregar ruta en `useNavigation.js`
3. Importar y usar en `App.vue`

**Crear un composable:**
1. Crear archivo en `src/composables/useNuevo.js`
2. Exportar función con `export function useNuevo() { ... }`
3. Usar estado reactivo con `ref()` y `computed()`

**Estilos:**
- Tailwind CSS: usar clases utility en templates
- Estilos globales: agregar en `src/styles/main.css`
- Configuración de colores: `tailwind.config.js`

**Estructura de componente Vue:**
```vue
<template>
  <!-- HTML con Tailwind -->
</template>

<script setup>
// Imports
import { ref } from 'vue';

// Composables
const storage = useStorage();

// Estado local
const localData = ref(null);

// Métodos
function handleAction() { ... }
</script>
```

### Service Worker

El Service Worker se registra automáticamente en `main.js` y cachea los archivos necesarios para funcionamiento offline. Para modificar la estrategia de caché, edita `service-worker.js`.

### Build y Optimización

Rspack genera automáticamente:
- Archivos con hash para cache busting
- Code splitting (vendors separado)
- Assets optimizados
- Source maps para debugging

### Despliegue

**GitHub Pages:**
El proyecto incluye configuración para GitHub Pages. El archivo `CNAME` en la raíz y en `dist/` permite usar un dominio personalizado.

**Otros servicios:**
- **Netlify/Vercel**: Conecta tu repositorio y usa `npm run build` como comando de build y `dist/` como directorio de publicación
- **Servidor propio**: Copia el contenido de `dist/` a tu servidor web

**Importante:** 
- El build genera archivos en `dist/`
- Asegúrate de que el servidor sirva `index.html` para todas las rutas (SPA routing)
- Los archivos en `public/` se copian automáticamente al build

## 🎯 Versión Actual

**v3.0** - Migración a Vue 3 + Rspack

### Características Principales
- ✅ **Vue 3 + Composition API** - Framework reactivo moderno
- ✅ **Rspack Build Tool** - Compilación ultra-rápida
- ✅ **Arquitectura Composables** - Lógica reutilizable y testeable
- ✅ **Single File Components** - Componentes Vue organizados
- ✅ **Tailwind CSS 3** - Diseño utility-first
- ✅ **PWA Instalable** - Funciona como app nativa
- ✅ **Offline First** - Service Worker con caché inteligente

### Funcionalidades
- ✅ **CRUD completo** - Crear, Leer, Actualizar, Eliminar
- ✅ **Organización jerárquica** - Secciones → Páginas → Entradas
- ✅ **Búsqueda en tiempo real** - Filtrado instantáneo
- ✅ **Importación/Exportación** - Backup de datos en JSON
- ✅ **Menú contextual móvil** - Long-press con vibración háptica
- ✅ **Navegación hash-based** - SPA sin recargas
- ✅ **12 iconos personalizables** - Material Symbols
- ✅ **Tema oscuro** - UI moderna y elegante
- ✅ **Almacenamiento local** - Privacidad total
- ✅ **Responsive design** - Optimizado para móvil y desktop

### Mejoras Técnicas
- ⚡ Hot Module Replacement (HMR) en desarrollo
- 📦 Code splitting automático
- 🗜️ Build optimizado y minificado
- 🎯 Alias de rutas (@/) para imports limpios
- 🔄 Estado reactivo global con composables
- 🎨 PostCSS con Autoprefixer

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Ideas para Contribuir
- 🌍 Internacionalización (i18n)
- 🔐 Encriptación de datos
- ☁️ Sincronización en la nube (opcional)
- 📊 Estadísticas de uso
- 🎨 Temas personalizables
- 🔍 Búsqueda avanzada con filtros
- 📎 Soporte para adjuntar archivos
- 🏷️ Sistema de etiquetas/tags

## 💬 Soporte

Si encuentras algún error o tienes sugerencias, por favor abre un issue en GitHub.

---

Hecho con ❤️ para organizar tus ideas


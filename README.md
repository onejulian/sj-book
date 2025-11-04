# 📓 Cuaderno Digital

Una aplicación web moderna para organizar tus ideas, notas y pensamientos de manera jerárquica y eficiente.

## ✨ Características

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

## 🚀 Cómo Usar

### Primera vez
1. Abre `index.html` en tu navegador
2. La aplicación se carga con datos de ejemplo
3. Explora las diferentes pantallas para familiarizarte

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

1. **Haz backups regulares**: Exporta tus datos periódicamente para evitar pérdidas
2. **Organiza desde el principio**: Piensa en categorías claras para tus secciones
3. **Usa la búsqueda**: Es más rápido que navegar manualmente cuando tienes muchas notas
4. **Nombres descriptivos**: Facilita encontrar lo que buscas más adelante
5. **Limpia regularmente**: Elimina entradas obsoletas para mantener todo organizado

## 📝 Archivos del Proyecto

- `index.html` - Pantalla de bienvenida
- `sections.html` - Vista de secciones
- `pages.html` - Vista de páginas
- `entries.html` - Vista de entradas
- `app.js` - Lógica central y gestión de almacenamiento
- `sections.js` - Funcionalidad de secciones
- `pages.js` - Funcionalidad de páginas
- `entries.js` - Funcionalidad de entradas

## 🎯 Versión

**v1.0** - Versión inicial con funcionalidad completa de CRUD, búsqueda e importación/exportación de datos.

---

Hecho con ❤️ para organizar tus ideas


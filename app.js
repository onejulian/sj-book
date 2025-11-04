// ==========================================
// INICIALIZADOR DE LA APLICACIÓN
// ==========================================

// Inicializar datos de ejemplo si no existen
function initializeDefaultData() {
  const data = StorageManager.getData();
  if (!data.sections || data.sections.length === 0) {
    const defaultSections = [
      {
        id: Utils.generateId(),
        name: 'Diario Personal',
        icon: 'auto_stories',
        lastModified: Date.now() - 7 * 24 * 60 * 60 * 1000,
        pages: [
          {
            id: Utils.generateId(),
            name: 'Mis Reflexiones',
            date: Date.now() - 2 * 24 * 60 * 60 * 1000,
            entries: [
              {
                id: Utils.generateId(),
                title: 'Diario Personal',
                content: 'Hoy fue un día productivo. Logré terminar las maquetas de diseño y también tuve tiempo para leer. Me siento realizado y listo para nuevos desafíos.',
                lastModified: Date.now() - 2 * 24 * 60 * 60 * 1000
              }
            ]
          }
        ]
      },
      {
        id: Utils.generateId(),
        name: 'Reuniones de Trabajo',
        icon: 'business_center',
        lastModified: Date.now() - 2 * 24 * 60 * 60 * 1000,
        pages: [
          {
            id: Utils.generateId(),
            name: 'Planificación Sprint 24',
            date: Date.now() - 1 * 24 * 60 * 60 * 1000,
            entries: [
              {
                id: Utils.generateId(),
                title: 'Sesión de Brainstorming',
                content: 'Ideas iniciales para la nueva función. Exploramos conceptos sobre gamificación y uso compartido en redes sociales. Necesitamos validar estas suposiciones.',
                lastModified: Date.now() - 1 * 24 * 60 * 60 * 1000
              },
              {
                id: Utils.generateId(),
                title: 'Notas de la Reunión',
                content: 'Discutimos la hoja de ruta del Q3, los puntos clave incluyen centrarse en la retención de usuarios y mejorar el flujo de incorporación.',
                lastModified: Date.now()
              }
            ]
          }
        ]
      },
      {
        id: Utils.generateId(),
        name: 'Ideas de Proyectos',
        icon: 'lightbulb',
        lastModified: Date.now() - 1 * 24 * 60 * 60 * 1000,
        pages: []
      }
    ];
    StorageManager.saveSections(defaultSections);
  }
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar datos de ejemplo
  initializeDefaultData();
  
  // Configurar event listeners de las vistas
  SectionsView.init();
  PagesView.setupEventListeners();
  EntriesView.setupEventListeners();
  
  // Iniciar sistema de navegación
  NavigationManager.init();
});

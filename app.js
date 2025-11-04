// Gestor de almacenamiento local
class StorageManager {
  static STORAGE_KEY = 'notebook_data';

  static getData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : { sections: [] };
  }

  static saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  static getSections() {
    return this.getData().sections || [];
  }

  static saveSections(sections) {
    this.saveData({ sections });
  }

  static addSection(section) {
    const data = this.getData();
    data.sections.unshift(section); // Añadir al principio
    this.saveData(data);
  }

  static updateSection(id, updatedSection) {
    const data = this.getData();
    const index = data.sections.findIndex(s => s.id === id);
    if (index !== -1) {
      data.sections[index] = { ...data.sections[index], ...updatedSection };
      this.saveData(data);
    }
  }

  static deleteSection(id) {
    const data = this.getData();
    data.sections = data.sections.filter(s => s.id !== id);
    this.saveData(data);
  }

  static getSection(id) {
    const sections = this.getSections();
    return sections.find(s => s.id === id);
  }

  static addPage(sectionId, page) {
    const section = this.getSection(sectionId);
    if (section) {
      if (!section.pages) section.pages = [];
      section.pages.unshift(page); // Añadir al principio
      this.updateSection(sectionId, section);
    }
  }

  static updatePage(sectionId, pageId, updatedPage) {
    const section = this.getSection(sectionId);
    if (section && section.pages) {
      const index = section.pages.findIndex(p => p.id === pageId);
      if (index !== -1) {
        section.pages[index] = { ...section.pages[index], ...updatedPage };
        this.updateSection(sectionId, section);
      }
    }
  }

  static deletePage(sectionId, pageId) {
    const section = this.getSection(sectionId);
    if (section && section.pages) {
      section.pages = section.pages.filter(p => p.id !== pageId);
      this.updateSection(sectionId, section);
    }
  }

  static getPage(sectionId, pageId) {
    const section = this.getSection(sectionId);
    if (section && section.pages) {
      return section.pages.find(p => p.id === pageId);
    }
    return null;
  }

  static addEntry(sectionId, pageId, entry) {
    const page = this.getPage(sectionId, pageId);
    if (page) {
      if (!page.entries) page.entries = [];
      page.entries.unshift(entry); // Añadir al principio
      this.updatePage(sectionId, pageId, page);
    }
  }

  static updateEntry(sectionId, pageId, entryId, updatedEntry) {
    const page = this.getPage(sectionId, pageId);
    if (page && page.entries) {
      const index = page.entries.findIndex(e => e.id === entryId);
      if (index !== -1) {
        page.entries[index] = { ...page.entries[index], ...updatedEntry };
        this.updatePage(sectionId, pageId, page);
      }
    }
  }

  static deleteEntry(sectionId, pageId, entryId) {
    const page = this.getPage(sectionId, pageId);
    if (page && page.entries) {
      page.entries = page.entries.filter(e => e.id !== entryId);
      this.updatePage(sectionId, pageId, page);
    }
  }
}

// Utilidades
class Utils {
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays === 2) {
      return 'Hace 2 días';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else if (diffDays < 14) {
      return 'Semana pasada';
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }

  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
}

// Gestor de navegación
class NavigationManager {
  static setCurrentSection(sectionId) {
    sessionStorage.setItem('currentSection', sectionId);
  }

  static getCurrentSection() {
    return sessionStorage.getItem('currentSection');
  }

  static setCurrentPage(pageId) {
    sessionStorage.setItem('currentPage', pageId);
  }

  static getCurrentPage() {
    return sessionStorage.getItem('currentPage');
  }

  static clearNavigation() {
    sessionStorage.removeItem('currentSection');
    sessionStorage.removeItem('currentPage');
  }

  static goToPages(sectionId) {
    this.setCurrentSection(sectionId);
    window.location.href = 'pages.html';
  }

  static goToEntries(sectionId, pageId) {
    this.setCurrentSection(sectionId);
    this.setCurrentPage(pageId);
    window.location.href = 'entries.html';
  }

  static goToSections() {
    this.clearNavigation();
    window.location.href = 'sections.html';
  }

  static goBack(fromWhere) {
    if (fromWhere === 'entries') {
      const sectionId = this.getCurrentSection();
      sessionStorage.removeItem('currentPage');
      window.location.href = 'pages.html';
    } else if (fromWhere === 'pages') {
      this.clearNavigation();
      window.location.href = 'sections.html';
    }
  }
}

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


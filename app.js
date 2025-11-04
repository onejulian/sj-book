// ==========================================
// GESTOR DE ALMACENAMIENTO LOCAL
// ==========================================
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
    data.sections.unshift(section);
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
      section.pages.unshift(page);
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
      page.entries.unshift(entry);
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

// ==========================================
// UTILIDADES
// ==========================================
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

// ==========================================
// GESTOR DE NAVEGACIÓN SPA
// ==========================================
class NavigationManager {
  static init() {
    // Escuchar cambios de hash
    window.addEventListener('hashchange', () => this.handleRouteChange());
    
    // Manejar ruta inicial
    this.handleRouteChange();
  }

  static handleRouteChange() {
    const hash = window.location.hash || '#sections';
    const [route, ...params] = hash.substring(1).split('/');

    // Ocultar todas las vistas
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });

    // Mostrar vista correspondiente
    switch (route) {
      case 'sections':
        this.showSectionsView();
        break;
      case 'pages':
        if (params[0]) {
          this.showPagesView(params[0]);
        } else {
          this.goToSections();
        }
        break;
      case 'entries':
        if (params[0] && params[1]) {
          this.showEntriesView(params[0], params[1]);
        } else {
          this.goToSections();
        }
        break;
      default:
        this.goToSections();
    }
  }

  static showSectionsView() {
    document.getElementById('sectionsView').classList.add('active');
    App.renderSections();
  }

  static showPagesView(sectionId) {
    const section = StorageManager.getSection(sectionId);
    if (!section) {
      this.goToSections();
      return;
    }
    document.getElementById('pagesView').classList.add('active');
    App.currentSectionId = sectionId;
    App.renderPages();
  }

  static showEntriesView(sectionId, pageId) {
    const section = StorageManager.getSection(sectionId);
    const page = StorageManager.getPage(sectionId, pageId);
    if (!section || !page) {
      this.goToSections();
      return;
    }
    document.getElementById('entriesView').classList.add('active');
    App.currentSectionId = sectionId;
    App.currentPageId = pageId;
    App.renderEntries();
  }

  static goToSections() {
    window.location.hash = '#sections';
  }

  static goToPages(sectionId) {
    window.location.hash = `#pages/${sectionId}`;
  }

  static goToEntries(sectionId, pageId) {
    window.location.hash = `#entries/${sectionId}/${pageId}`;
  }

  static goBack(from) {
    if (from === 'pages') {
      this.goToSections();
    } else if (from === 'entries') {
      this.goToPages(App.currentSectionId);
    }
  }
}

// ==========================================
// APLICACIÓN PRINCIPAL
// ==========================================
class App {
  static currentSectionId = null;
  static currentPageId = null;
  static editingSectionId = null;
  static editingPageId = null;
  static editingEntryId = null;
  static deletingSectionId = null;
  static deletingPageId = null;
  static deletingEntryId = null;
  static selectedIcon = 'lightbulb';
  static pendingImportData = null;

  static init() {
    this.initializeDefaultData();
    this.setupEventListeners();
    NavigationManager.init();
  }

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================
  static initializeDefaultData() {
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

  static setupEventListeners() {
    // ==========================================
    // NAVEGACIÓN
    // ==========================================
    document.getElementById('pagesBackBtn').addEventListener('click', () => {
      NavigationManager.goBack('pages');
    });

    document.getElementById('entriesBackBtn').addEventListener('click', () => {
      NavigationManager.goBack('entries');
    });

    // ==========================================
    // MENÚ PRINCIPAL
    // ==========================================
    document.getElementById('menuBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenuDropdown();
    });

    document.addEventListener('click', (e) => {
      const menuBtn = document.getElementById('menuBtn');
      const menuDropdown = document.getElementById('menuDropdown');
      if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
        menuDropdown.classList.add('hidden');
      }
    });

    document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
    document.getElementById('importDataBtn').addEventListener('click', () => this.triggerImport());
    document.getElementById('aboutBtn').addEventListener('click', () => {
      this.closeMenuDropdown();
      this.openAboutModal();
    });

    document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));

    // ==========================================
    // BÚSQUEDA
    // ==========================================
    document.getElementById('sectionsSearchBtn').addEventListener('click', () => {
      this.toggleSearch('sections');
    });
    document.getElementById('sectionsSearchInput').addEventListener('input', (e) => {
      this.renderSections(e.target.value);
    });

    document.getElementById('pagesSearchBtn').addEventListener('click', () => {
      this.toggleSearch('pages');
    });
    document.getElementById('pagesSearchInput').addEventListener('input', (e) => {
      this.renderPages(e.target.value);
    });

    document.getElementById('entriesSearchBtn').addEventListener('click', () => {
      this.toggleSearch('entries');
    });
    document.getElementById('entriesSearchInput').addEventListener('input', (e) => {
      this.renderEntries(e.target.value);
    });

    // ==========================================
    // BOTONES AÑADIR
    // ==========================================
    document.getElementById('addSectionBtn').addEventListener('click', () => {
      this.editingSectionId = null;
      this.openSectionModal();
    });

    document.getElementById('addPageBtn').addEventListener('click', () => {
      this.editingPageId = null;
      this.openPageModal();
    });

    document.getElementById('addEntryBtn').addEventListener('click', () => {
      this.editingEntryId = null;
      this.openEntryModal();
    });

    // ==========================================
    // MODAL ABOUT
    // ==========================================
    document.getElementById('closeAboutModal').addEventListener('click', () => this.closeAboutModal());
    document.getElementById('aboutModal').addEventListener('click', (e) => {
      if (e.target.id === 'aboutModal') this.closeAboutModal();
    });

    // ==========================================
    // MODAL SECCIÓN
    // ==========================================
    document.getElementById('closeSectionModal').addEventListener('click', () => this.closeSectionModal());
    document.getElementById('cancelSectionBtn').addEventListener('click', () => this.closeSectionModal());
    document.getElementById('saveSectionBtn').addEventListener('click', () => this.saveSection());
    document.getElementById('sectionModal').addEventListener('click', (e) => {
      if (e.target.id === 'sectionModal') this.closeSectionModal();
    });

    // Selección de iconos
    document.querySelectorAll('.icon-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('bg-primary/40'));
        btn.classList.add('bg-primary/40');
        this.selectedIcon = btn.dataset.icon;
      });
    });

    // ==========================================
    // MODAL PÁGINA
    // ==========================================
    document.getElementById('closePageModal').addEventListener('click', () => this.closePageModal());
    document.getElementById('cancelPageBtn').addEventListener('click', () => this.closePageModal());
    document.getElementById('savePageBtn').addEventListener('click', () => this.savePage());
    document.getElementById('pageModal').addEventListener('click', (e) => {
      if (e.target.id === 'pageModal') this.closePageModal();
    });

    // ==========================================
    // MODAL ENTRADA
    // ==========================================
    document.getElementById('closeEntryModal').addEventListener('click', () => this.closeEntryModal());
    document.getElementById('cancelEntryBtn').addEventListener('click', () => this.closeEntryModal());
    document.getElementById('saveEntryBtn').addEventListener('click', () => this.saveEntry());
    document.getElementById('entryModal').addEventListener('click', (e) => {
      if (e.target.id === 'entryModal') this.closeEntryModal();
    });

    // ==========================================
    // MODALES ELIMINAR
    // ==========================================
    document.getElementById('cancelDeleteSectionBtn').addEventListener('click', () => this.closeDeleteSectionModal());
    document.getElementById('confirmDeleteSectionBtn').addEventListener('click', () => this.confirmDeleteSection());
    document.getElementById('deleteSectionModal').addEventListener('click', (e) => {
      if (e.target.id === 'deleteSectionModal') this.closeDeleteSectionModal();
    });

    document.getElementById('cancelDeletePageBtn').addEventListener('click', () => this.closeDeletePageModal());
    document.getElementById('confirmDeletePageBtn').addEventListener('click', () => this.confirmDeletePage());
    document.getElementById('deletePageModal').addEventListener('click', (e) => {
      if (e.target.id === 'deletePageModal') this.closeDeletePageModal();
    });

    document.getElementById('cancelDeleteEntryBtn').addEventListener('click', () => this.closeDeleteEntryModal());
    document.getElementById('confirmDeleteEntryBtn').addEventListener('click', () => this.confirmDeleteEntry());
    document.getElementById('deleteEntryModal').addEventListener('click', (e) => {
      if (e.target.id === 'deleteEntryModal') this.closeDeleteEntryModal();
    });

    // ==========================================
    // MODALES IMPORTAR
    // ==========================================
    document.getElementById('cancelImportBtn').addEventListener('click', () => this.closeImportModal());
    document.getElementById('confirmImportBtn').addEventListener('click', () => this.confirmImport());
    document.getElementById('importModal').addEventListener('click', (e) => {
      if (e.target.id === 'importModal') this.closeImportModal();
    });

    document.getElementById('closeErrorBtn').addEventListener('click', () => this.closeImportErrorModal());
    document.getElementById('importErrorModal').addEventListener('click', (e) => {
      if (e.target.id === 'importErrorModal') this.closeImportErrorModal();
    });
  }

  // ==========================================
  // RENDERIZADO - SECCIONES
  // ==========================================
  static renderSections(filter = '') {
    const container = document.getElementById('sectionsList');
    const emptyState = document.getElementById('sectionsEmptyState');
    const sections = StorageManager.getSections();
    
    let filteredSections = sections;
    if (filter) {
      filteredSections = sections.filter(s => 
        s.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    container.innerHTML = '';
    
    if (filteredSections.length === 0) {
      emptyState.classList.remove('hidden');
      emptyState.classList.add('flex');
    } else {
      emptyState.classList.add('hidden');
      emptyState.classList.remove('flex');
      
      filteredSections.forEach(section => {
        const totalEntries = this.getTotalEntries(section);
        const sectionEl = this.createSectionElement(section, totalEntries);
        container.appendChild(sectionEl);
      });
    }
  }

  static createSectionElement(section, totalEntries) {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-4 bg-background-dark/50 p-3 rounded-xl min-h-[72px] justify-between cursor-pointer hover:bg-white/5 transition-colors duration-200 group';
    
    div.innerHTML = `
      <div class="flex items-center gap-4 flex-1" onclick="NavigationManager.goToPages('${section.id}')">
        <div class="text-white flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-12">
          <span class="material-symbols-outlined text-primary text-2xl">${section.icon || 'folder'}</span>
        </div>
        <div class="flex flex-col justify-center">
          <p class="text-white text-base font-medium leading-normal line-clamp-1">${Utils.escapeHtml(section.name)}</p>
          <p class="text-white/60 text-sm font-normal leading-normal line-clamp-2">${totalEntries} ${totalEntries === 1 ? 'entrada' : 'entradas'}</p>
        </div>
      </div>
      <div class="shrink-0 flex items-center gap-2">
        <p class="text-white/60 text-sm font-normal leading-normal">${Utils.formatDate(section.lastModified)}</p>
        <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button onclick="event.stopPropagation(); App.editSection('${section.id}')" class="p-2 hover:bg-white/10 rounded-lg">
            <span class="material-symbols-outlined text-primary text-xl">edit</span>
          </button>
          <button onclick="event.stopPropagation(); App.openDeleteSectionModal('${section.id}')" class="p-2 hover:bg-white/10 rounded-lg">
            <span class="material-symbols-outlined text-red-500 text-xl">delete</span>
          </button>
        </div>
      </div>
    `;
    
    return div;
  }

  static getTotalEntries(section) {
    if (!section.pages) return 0;
    return section.pages.reduce((total, page) => {
      return total + (page.entries ? page.entries.length : 0);
    }, 0);
  }

  // ==========================================
  // RENDERIZADO - PÁGINAS
  // ==========================================
  static renderPages(filter = '') {
    const container = document.getElementById('pagesList');
    const emptyState = document.getElementById('pagesEmptyState');
    const section = StorageManager.getSection(this.currentSectionId);
    
    if (!section) {
      NavigationManager.goToSections();
      return;
    }

    // Actualizar título
    document.getElementById('pagesTitle').textContent = section.name;
    
    let pages = section.pages || [];
    
    if (filter) {
      pages = pages.filter(p => 
        p.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    container.innerHTML = '';
    
    if (pages.length === 0) {
      emptyState.classList.remove('hidden');
      emptyState.classList.add('flex');
    } else {
      emptyState.classList.add('hidden');
      emptyState.classList.remove('flex');
      
      pages.forEach(page => {
        const pageEl = this.createPageElement(page);
        container.appendChild(pageEl);
      });
    }
  }

  static createPageElement(page) {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-4 bg-transparent px-4 min-h-[72px] py-2 justify-between hover:bg-white/5 dark:hover:bg-white/5 transition-colors rounded-lg group';
    
    const entryCount = page.entries ? page.entries.length : 0;
    
    div.innerHTML = `
      <div class="flex items-center gap-4 flex-grow cursor-pointer" onclick="NavigationManager.goToEntries('${this.currentSectionId}', '${page.id}')">
        <div class="text-white flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-12">
          <span class="material-symbols-outlined text-primary">article</span>
        </div>
        <div class="flex flex-col justify-center overflow-hidden">
          <p class="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">${Utils.escapeHtml(page.name)}</p>
          <p class="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-2">${Utils.formatDate(page.date)} • ${entryCount} ${entryCount === 1 ? 'entrada' : 'entradas'}</p>
        </div>
      </div>
      <div class="shrink-0 flex items-center gap-2">
        <div class="text-slate-500 dark:text-slate-500 flex size-7 items-center justify-center">
          <span class="material-symbols-outlined text-2xl">arrow_forward_ios</span>
        </div>
        <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
          <button onclick="event.stopPropagation(); App.editPage('${page.id}')" class="p-2 hover:bg-white/10 rounded-lg">
            <span class="material-symbols-outlined text-primary text-xl">edit</span>
          </button>
          <button onclick="event.stopPropagation(); App.openDeletePageModal('${page.id}')" class="p-2 hover:bg-white/10 rounded-lg">
            <span class="material-symbols-outlined text-red-500 text-xl">delete</span>
          </button>
        </div>
      </div>
    `;
    
    return div;
  }

  // ==========================================
  // RENDERIZADO - ENTRADAS
  // ==========================================
  static renderEntries(filter = '') {
    const container = document.getElementById('entriesList');
    const emptyState = document.getElementById('entriesEmptyState');
    const page = StorageManager.getPage(this.currentSectionId, this.currentPageId);
    
    if (!page) {
      NavigationManager.goBack('entries');
      return;
    }

    // Actualizar título
    document.getElementById('entriesTitle').textContent = page.name;
    
    let entries = page.entries || [];
    
    if (filter) {
      entries = entries.filter(e => 
        e.title.toLowerCase().includes(filter.toLowerCase()) ||
        e.content.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    container.innerHTML = '';
    
    if (entries.length === 0) {
      emptyState.classList.remove('hidden');
      emptyState.classList.add('flex');
    } else {
      emptyState.classList.add('hidden');
      emptyState.classList.remove('flex');
      
      entries.forEach(entry => {
        const entryEl = this.createEntryElement(entry);
        container.appendChild(entryEl);
      });
    }
  }

  static createEntryElement(entry) {
    const div = document.createElement('div');
    div.className = 'flex gap-4 bg-background-light dark:bg-background-dark py-3 justify-between items-center rounded-lg hover:bg-primary/10 transition-colors group';
    
    div.innerHTML = `
      <div class="flex items-start gap-4 flex-grow">
        <div class="text-white/60 flex items-center justify-center rounded-lg shrink-0 size-12 group-hover:text-white/90">
          <span class="material-symbols-outlined text-2xl">description</span>
        </div>
        <div class="flex flex-1 flex-col justify-center">
          <p class="text-white text-base font-medium leading-normal">${Utils.escapeHtml(entry.title)}</p>
          <p class="text-[#92adc9] text-sm font-normal leading-normal">Modificado: ${Utils.formatDate(entry.lastModified)}</p>
          <p class="text-[#92adc9] text-sm font-normal leading-normal line-clamp-2 mt-1">
            ${Utils.escapeHtml(entry.content)}
          </p>
        </div>
      </div>
      <div class="shrink-0 pr-2 flex gap-2">
        <button onclick="App.editEntry('${entry.id}')" class="text-primary font-medium leading-normal text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Editar
        </button>
        <button onclick="App.openDeleteEntryModal('${entry.id}')" class="text-red-500 font-medium leading-normal text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Eliminar
        </button>
      </div>
    `;
    
    return div;
  }

  // ==========================================
  // BÚSQUEDA
  // ==========================================
  static toggleSearch(view) {
    const searchBar = document.getElementById(`${view}SearchBar`);
    const searchInput = document.getElementById(`${view}SearchInput`);
    
    if (searchBar.classList.contains('hidden')) {
      searchBar.classList.remove('hidden');
      searchInput.focus();
    } else {
      searchBar.classList.add('hidden');
      searchInput.value = '';
      
      // Renderizar sin filtro
      if (view === 'sections') this.renderSections();
      else if (view === 'pages') this.renderPages();
      else if (view === 'entries') this.renderEntries();
    }
  }

  // ==========================================
  // MENÚ
  // ==========================================
  static toggleMenuDropdown() {
    const dropdown = document.getElementById('menuDropdown');
    dropdown.classList.toggle('hidden');
  }

  static closeMenuDropdown() {
    document.getElementById('menuDropdown').classList.add('hidden');
  }

  static openAboutModal() {
    document.getElementById('aboutModal').classList.remove('hidden');
  }

  static closeAboutModal() {
    document.getElementById('aboutModal').classList.add('hidden');
  }

  // ==========================================
  // MODAL SECCIÓN
  // ==========================================
  static openSectionModal() {
    const modal = document.getElementById('sectionModal');
    const title = document.getElementById('sectionModalTitle');
    const nameInput = document.getElementById('sectionName');
    
    if (this.editingSectionId) {
      const section = StorageManager.getSection(this.editingSectionId);
      title.textContent = 'Editar Sección';
      nameInput.value = section.name;
      this.selectedIcon = section.icon || 'lightbulb';
      
      document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.classList.remove('bg-primary/40');
        if (btn.dataset.icon === this.selectedIcon) {
          btn.classList.add('bg-primary/40');
        }
      });
    } else {
      title.textContent = 'Nueva Sección';
      nameInput.value = '';
      this.selectedIcon = 'lightbulb';
      
      document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.remove('bg-primary/40'));
      document.querySelector('.icon-btn').classList.add('bg-primary/40');
    }
    
    modal.classList.remove('hidden');
    nameInput.focus();
  }

  static closeSectionModal() {
    document.getElementById('sectionModal').classList.add('hidden');
    this.editingSectionId = null;
  }

  static saveSection() {
    const nameInput = document.getElementById('sectionName');
    const name = nameInput.value.trim();
    
    if (!name) {
      alert('Por favor ingresa un nombre para la sección');
      return;
    }
    
    if (this.editingSectionId) {
      StorageManager.updateSection(this.editingSectionId, {
        name,
        icon: this.selectedIcon,
        lastModified: Date.now()
      });
    } else {
      const newSection = {
        id: Utils.generateId(),
        name,
        icon: this.selectedIcon,
        lastModified: Date.now(),
        pages: []
      };
      StorageManager.addSection(newSection);
    }
    
    this.closeSectionModal();
    this.renderSections();
  }

  static editSection(sectionId) {
    this.editingSectionId = sectionId;
    this.openSectionModal();
  }

  // ==========================================
  // MODAL PÁGINA
  // ==========================================
  static openPageModal() {
    const modal = document.getElementById('pageModal');
    const title = document.getElementById('pageModalTitle');
    const nameInput = document.getElementById('pageName');
    
    if (this.editingPageId) {
      const page = StorageManager.getPage(this.currentSectionId, this.editingPageId);
      title.textContent = 'Editar Página';
      nameInput.value = page.name;
    } else {
      title.textContent = 'Nueva Página';
      nameInput.value = '';
    }
    
    modal.classList.remove('hidden');
    nameInput.focus();
  }

  static closePageModal() {
    document.getElementById('pageModal').classList.add('hidden');
    this.editingPageId = null;
  }

  static savePage() {
    const nameInput = document.getElementById('pageName');
    const name = nameInput.value.trim();
    
    if (!name) {
      alert('Por favor ingresa un nombre para la página');
      return;
    }
    
    if (this.editingPageId) {
      StorageManager.updatePage(this.currentSectionId, this.editingPageId, {
        name,
        date: Date.now()
      });
      StorageManager.updateSection(this.currentSectionId, {
        lastModified: Date.now()
      });
    } else {
      const newPage = {
        id: Utils.generateId(),
        name,
        date: Date.now(),
        entries: []
      };
      StorageManager.addPage(this.currentSectionId, newPage);
      StorageManager.updateSection(this.currentSectionId, {
        lastModified: Date.now()
      });
    }
    
    this.closePageModal();
    this.renderPages();
  }

  static editPage(pageId) {
    this.editingPageId = pageId;
    this.openPageModal();
  }

  // ==========================================
  // MODAL ENTRADA
  // ==========================================
  static openEntryModal() {
    const modal = document.getElementById('entryModal');
    const title = document.getElementById('entryModalTitle');
    const titleInput = document.getElementById('entryTitle');
    const contentInput = document.getElementById('entryContent');
    
    if (this.editingEntryId) {
      const section = StorageManager.getSection(this.currentSectionId);
      const page = section.pages.find(p => p.id === this.currentPageId);
      const entry = page.entries.find(e => e.id === this.editingEntryId);
      
      title.textContent = 'Editar Entrada';
      titleInput.value = entry.title;
      contentInput.value = entry.content;
    } else {
      title.textContent = 'Nueva Entrada';
      titleInput.value = '';
      contentInput.value = '';
    }
    
    modal.classList.remove('hidden');
    titleInput.focus();
  }

  static closeEntryModal() {
    document.getElementById('entryModal').classList.add('hidden');
    this.editingEntryId = null;
  }

  static saveEntry() {
    const titleInput = document.getElementById('entryTitle');
    const contentInput = document.getElementById('entryContent');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title) {
      alert('Por favor ingresa un título para la entrada');
      return;
    }
    
    if (!content) {
      alert('Por favor ingresa contenido para la entrada');
      return;
    }
    
    if (this.editingEntryId) {
      StorageManager.updateEntry(this.currentSectionId, this.currentPageId, this.editingEntryId, {
        title,
        content,
        lastModified: Date.now()
      });
    } else {
      const newEntry = {
        id: Utils.generateId(),
        title,
        content,
        lastModified: Date.now()
      };
      StorageManager.addEntry(this.currentSectionId, this.currentPageId, newEntry);
    }
    
    StorageManager.updatePage(this.currentSectionId, this.currentPageId, {
      date: Date.now()
    });
    StorageManager.updateSection(this.currentSectionId, {
      lastModified: Date.now()
    });
    
    this.closeEntryModal();
    this.renderEntries();
  }

  static editEntry(entryId) {
    this.editingEntryId = entryId;
    this.openEntryModal();
  }

  // ==========================================
  // MODALES ELIMINAR
  // ==========================================
  static openDeleteSectionModal(sectionId) {
    this.deletingSectionId = sectionId;
    document.getElementById('deleteSectionModal').classList.remove('hidden');
  }

  static closeDeleteSectionModal() {
    document.getElementById('deleteSectionModal').classList.add('hidden');
    this.deletingSectionId = null;
  }

  static confirmDeleteSection() {
    if (this.deletingSectionId) {
      StorageManager.deleteSection(this.deletingSectionId);
      this.closeDeleteSectionModal();
      this.renderSections();
    }
  }

  static openDeletePageModal(pageId) {
    this.deletingPageId = pageId;
    document.getElementById('deletePageModal').classList.remove('hidden');
  }

  static closeDeletePageModal() {
    document.getElementById('deletePageModal').classList.add('hidden');
    this.deletingPageId = null;
  }

  static confirmDeletePage() {
    if (this.deletingPageId) {
      StorageManager.deletePage(this.currentSectionId, this.deletingPageId);
      StorageManager.updateSection(this.currentSectionId, {
        lastModified: Date.now()
      });
      this.closeDeletePageModal();
      this.renderPages();
    }
  }

  static openDeleteEntryModal(entryId) {
    this.deletingEntryId = entryId;
    document.getElementById('deleteEntryModal').classList.remove('hidden');
  }

  static closeDeleteEntryModal() {
    document.getElementById('deleteEntryModal').classList.add('hidden');
    this.deletingEntryId = null;
  }

  static confirmDeleteEntry() {
    if (this.deletingEntryId) {
      StorageManager.deleteEntry(this.currentSectionId, this.currentPageId, this.deletingEntryId);
      StorageManager.updatePage(this.currentSectionId, this.currentPageId, {
        date: Date.now()
      });
      StorageManager.updateSection(this.currentSectionId, {
        lastModified: Date.now()
      });
      this.closeDeleteEntryModal();
      this.renderEntries();
    }
  }

  // ==========================================
  // EXPORTAR / IMPORTAR
  // ==========================================
  static exportData() {
    this.closeMenuDropdown();
    
    const data = StorageManager.getData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    a.download = `cuaderno-digital-backup-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static triggerImport() {
    this.closeMenuDropdown();
    document.getElementById('fileInput').click();
  }

  static handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (this.validateImportData(data)) {
          this.pendingImportData = data;
          this.openImportModal();
        } else {
          this.openImportErrorModal();
        }
      } catch (error) {
        this.openImportErrorModal();
      }
      
      e.target.value = '';
    };
    
    reader.readAsText(file);
  }

  static validateImportData(data) {
    if (!data || typeof data !== 'object') {
      return false;
    }
    
    if (!Array.isArray(data.sections)) {
      return false;
    }
    
    for (const section of data.sections) {
      if (!section.id || typeof section.name !== 'string') {
        return false;
      }
      
      if (!Array.isArray(section.pages)) {
        return false;
      }
      
      for (const page of section.pages) {
        if (!page.id || typeof page.name !== 'string') {
          return false;
        }
        
        if (!Array.isArray(page.entries)) {
          return false;
        }
        
        for (const entry of page.entries) {
          if (!entry.id || typeof entry.title !== 'string' || typeof entry.content !== 'string') {
            return false;
          }
        }
      }
    }
    
    return true;
  }

  static openImportModal() {
    document.getElementById('importModal').classList.remove('hidden');
  }

  static closeImportModal() {
    document.getElementById('importModal').classList.add('hidden');
    this.pendingImportData = null;
  }

  static confirmImport() {
    if (this.pendingImportData) {
      StorageManager.saveData(this.pendingImportData);
      this.closeImportModal();
      this.renderSections();
    }
  }

  static openImportErrorModal() {
    document.getElementById('importErrorModal').classList.remove('hidden');
  }

  static closeImportErrorModal() {
    document.getElementById('importErrorModal').classList.add('hidden');
  }
}

// ==========================================
// INICIAR APLICACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

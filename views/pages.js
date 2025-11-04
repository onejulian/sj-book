// ==========================================
// VISTA DE PÁGINAS
// ==========================================
class PagesView {
  static currentSectionId = null;
  static editingPageId = null;
  static deletingPageId = null;

  static init(sectionId) {
    this.currentSectionId = sectionId;
    this.render();
  }

  static setupEventListeners() {
    // Navegación
    document.getElementById('pagesBackBtn').addEventListener('click', () => {
      NavigationManager.goBack('pages');
    });

    // Búsqueda
    document.getElementById('pagesSearchBtn').addEventListener('click', () => this.toggleSearch());
    document.getElementById('pagesSearchInput').addEventListener('input', (e) => {
      this.render(e.target.value);
    });

    // Añadir página
    document.getElementById('addPageBtn').addEventListener('click', () => {
      this.editingPageId = null;
      this.openPageModal();
    });

    // Modal Página
    document.getElementById('closePageModal').addEventListener('click', () => this.closePageModal());
    document.getElementById('cancelPageBtn').addEventListener('click', () => this.closePageModal());
    document.getElementById('savePageBtn').addEventListener('click', () => this.savePage());
    document.getElementById('pageModal').addEventListener('click', (e) => {
      if (e.target.id === 'pageModal') this.closePageModal();
    });

    // Modal eliminar
    document.getElementById('cancelDeletePageBtn').addEventListener('click', () => this.closeDeleteModal());
    document.getElementById('confirmDeletePageBtn').addEventListener('click', () => this.confirmDelete());
    document.getElementById('deletePageModal').addEventListener('click', (e) => {
      if (e.target.id === 'deletePageModal') this.closeDeleteModal();
    });
  }

  static render(filter = '') {
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
    div.dataset.pageId = page.id;
    
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
        <div class="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 ml-2">
          <button onclick="event.stopPropagation(); PagesView.editPage('${page.id}')" class="p-2 hover:bg-white/10 rounded-lg">
            <span class="material-symbols-outlined text-primary text-xl">edit</span>
          </button>
          <button onclick="event.stopPropagation(); PagesView.openDeleteModal('${page.id}')" class="p-2 hover:bg-white/10 rounded-lg">
            <span class="material-symbols-outlined text-red-500 text-xl">delete</span>
          </button>
        </div>
      </div>
    `;
    
    // Configurar long press para móviles
    ContextMenu.setupLongPress(
      div,
      page.id,
      (id) => this.editPage(id),
      (id) => this.openDeleteModal(id)
    );
    
    return div;
  }

  // Búsqueda
  static toggleSearch() {
    const searchBar = document.getElementById('pagesSearchBar');
    const searchInput = document.getElementById('pagesSearchInput');
    
    if (searchBar.classList.contains('hidden')) {
      searchBar.classList.remove('hidden');
      searchInput.focus();
    } else {
      searchBar.classList.add('hidden');
      searchInput.value = '';
      this.render();
    }
  }

  // Modal Página
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
    this.render();
  }

  static editPage(pageId) {
    this.editingPageId = pageId;
    this.openPageModal();
  }

  // Modal Eliminar
  static openDeleteModal(pageId) {
    this.deletingPageId = pageId;
    document.getElementById('deletePageModal').classList.remove('hidden');
  }

  static closeDeleteModal() {
    document.getElementById('deletePageModal').classList.add('hidden');
    this.deletingPageId = null;
  }

  static confirmDelete() {
    if (this.deletingPageId) {
      StorageManager.deletePage(this.currentSectionId, this.deletingPageId);
      StorageManager.updateSection(this.currentSectionId, {
        lastModified: Date.now()
      });
      this.closeDeleteModal();
      this.render();
    }
  }
}

// Exponer globalmente
window.PagesView = PagesView;


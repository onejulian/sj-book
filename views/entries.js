// ==========================================
// VISTA DE ENTRADAS
// ==========================================
class EntriesView {
  static currentSectionId = null;
  static currentPageId = null;
  static editingEntryId = null;
  static deletingEntryId = null;

  static init(sectionId, pageId) {
    this.currentSectionId = sectionId;
    this.currentPageId = pageId;
    this.render();
  }

  static setupEventListeners() {
    // Navegación
    document.getElementById('entriesBackBtn').addEventListener('click', () => {
      NavigationManager.goBack('entries');
    });

    // Búsqueda
    document.getElementById('entriesSearchBtn').addEventListener('click', () => this.toggleSearch());
    document.getElementById('entriesSearchInput').addEventListener('input', (e) => {
      this.render(e.target.value);
    });

    // Añadir entrada
    document.getElementById('addEntryBtn').addEventListener('click', () => {
      this.editingEntryId = null;
      this.openEntryModal();
    });

    // Modal Entrada
    document.getElementById('closeEntryModal').addEventListener('click', () => this.closeEntryModal());
    document.getElementById('cancelEntryBtn').addEventListener('click', () => this.closeEntryModal());
    document.getElementById('saveEntryBtn').addEventListener('click', () => this.saveEntry());
    document.getElementById('entryModal').addEventListener('click', (e) => {
      if (e.target.id === 'entryModal') this.closeEntryModal();
    });

    // Modal eliminar
    document.getElementById('cancelDeleteEntryBtn').addEventListener('click', () => this.closeDeleteModal());
    document.getElementById('confirmDeleteEntryBtn').addEventListener('click', () => this.confirmDelete());
    document.getElementById('deleteEntryModal').addEventListener('click', (e) => {
      if (e.target.id === 'deleteEntryModal') this.closeDeleteModal();
    });
  }

  static render(filter = '') {
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
    div.className = 'flex flex-col gap-3 bg-background-light dark:bg-background-dark p-4 rounded-lg hover:bg-primary/10 transition-colors group border border-white/10';
    
    div.innerHTML = `
      <div class="flex items-start gap-4 justify-between">
        <div class="flex items-start gap-4 flex-grow">
          <div class="text-white/60 flex items-center justify-center rounded-lg shrink-0 size-12 group-hover:text-white/90">
            <span class="material-symbols-outlined text-2xl">description</span>
          </div>
          <div class="flex flex-1 flex-col">
            <p class="text-white text-lg font-semibold leading-tight mb-1">${Utils.escapeHtml(entry.title)}</p>
            <p class="text-[#92adc9] text-sm font-normal leading-normal">Modificado: ${Utils.formatDate(entry.lastModified)}</p>
          </div>
        </div>
        <div class="shrink-0 flex gap-2">
          <button onclick="EntriesView.editEntry('${entry.id}')" class="text-primary font-medium leading-normal text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Editar
          </button>
          <button onclick="EntriesView.openDeleteModal('${entry.id}')" class="text-red-500 font-medium leading-normal text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Eliminar
          </button>
        </div>
      </div>
      <div class="pl-16">
        <p class="text-white/90 text-base font-normal leading-relaxed whitespace-pre-wrap">
${Utils.escapeHtml(entry.content)}
        </p>
      </div>
    `;
    
    return div;
  }

  // Búsqueda
  static toggleSearch() {
    const searchBar = document.getElementById('entriesSearchBar');
    const searchInput = document.getElementById('entriesSearchInput');
    
    if (searchBar.classList.contains('hidden')) {
      searchBar.classList.remove('hidden');
      searchInput.focus();
    } else {
      searchBar.classList.add('hidden');
      searchInput.value = '';
      this.render();
    }
  }

  // Modal Entrada
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
    this.render();
  }

  static editEntry(entryId) {
    this.editingEntryId = entryId;
    this.openEntryModal();
  }

  // Modal Eliminar
  static openDeleteModal(entryId) {
    this.deletingEntryId = entryId;
    document.getElementById('deleteEntryModal').classList.remove('hidden');
  }

  static closeDeleteModal() {
    document.getElementById('deleteEntryModal').classList.add('hidden');
    this.deletingEntryId = null;
  }

  static confirmDelete() {
    if (this.deletingEntryId) {
      StorageManager.deleteEntry(this.currentSectionId, this.currentPageId, this.deletingEntryId);
      StorageManager.updatePage(this.currentSectionId, this.currentPageId, {
        date: Date.now()
      });
      StorageManager.updateSection(this.currentSectionId, {
        lastModified: Date.now()
      });
      this.closeDeleteModal();
      this.render();
    }
  }
}

// Exponer globalmente
window.EntriesView = EntriesView;


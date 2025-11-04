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

    // Añadir entrada (mostrar editor nuevo)
    document.getElementById('addEntryBtn').addEventListener('click', () => {
      this.showNewEntryEditor();
    });

    // Editor nuevo - Botones
    document.getElementById('cancelNewEntry').addEventListener('click', () => this.hideNewEntryEditor());
    document.getElementById('cancelNewEntryBtn').addEventListener('click', () => this.hideNewEntryEditor());
    document.getElementById('saveNewEntryBtn').addEventListener('click', () => this.saveNewEntry());

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
    
    if (entries.length === 0 && !filter) {
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
    div.id = `entry-${entry.id}`;
    div.className = 'flex flex-col gap-3 bg-background-light dark:bg-background-dark p-4 rounded-lg hover:bg-primary/10 transition-colors group border border-white/10';
    div.dataset.entryId = entry.id;
    
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
        <div class="shrink-0 hidden md:flex gap-2">
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
    
    // Configurar long press para móviles
    ContextMenu.setupLongPress(
      div,
      entry.id,
      (id) => this.editEntry(id),
      (id) => this.openDeleteModal(id)
    );
    
    return div;
  }

  static createEditEntryElement(entry) {
    const div = document.createElement('div');
    div.id = `entry-editor-${entry.id}`;
    div.className = 'flex flex-col gap-3 bg-background-dark p-4 rounded-lg border-2 border-primary shadow-lg';
    
    div.innerHTML = `
      <div class="flex items-center justify-between">
        <h3 class="text-white text-lg font-semibold">Editar Entrada</h3>
        <button onclick="EntriesView.cancelEditEntry('${entry.id}')" class="text-white/60 hover:text-white">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div>
        <input type="text" id="editEntryTitle-${entry.id}" value="${Utils.escapeHtml(entry.title)}" 
          class="w-full bg-white/10 text-white text-lg font-semibold placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
      </div>
      <div>
        <textarea id="editEntryContent-${entry.id}" rows="8" 
          class="w-full bg-white/10 text-white text-base placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none">${Utils.escapeHtml(entry.content)}</textarea>
      </div>
      <div class="flex gap-3">
        <button onclick="EntriesView.cancelEditEntry('${entry.id}')" class="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
          Cancelar
        </button>
        <button onclick="EntriesView.saveEditEntry('${entry.id}')" class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          Guardar
        </button>
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

  // Editor Nuevo
  static showNewEntryEditor() {
    const editor = document.getElementById('entryEditorNew');
    editor.classList.remove('hidden');
    editor.classList.add('flex');
    
    // Limpiar campos
    document.getElementById('newEntryTitle').value = '';
    document.getElementById('newEntryContent').value = '';
    
    // Hacer scroll al editor y enfocar
    editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      document.getElementById('newEntryTitle').focus();
    }, 300);
  }

  static hideNewEntryEditor() {
    const editor = document.getElementById('entryEditorNew');
    editor.classList.add('hidden');
    editor.classList.remove('flex');
  }

  static saveNewEntry() {
    const titleInput = document.getElementById('newEntryTitle');
    const contentInput = document.getElementById('newEntryContent');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title) {
      alert('Por favor ingresa un título para la entrada');
      titleInput.focus();
      return;
    }
    
    if (!content) {
      alert('Por favor ingresa contenido para la entrada');
      contentInput.focus();
      return;
    }
    
    const newEntry = {
      id: Utils.generateId(),
      title,
      content,
      lastModified: Date.now()
    };
    
    StorageManager.addEntry(this.currentSectionId, this.currentPageId, newEntry);
    StorageManager.updatePage(this.currentSectionId, this.currentPageId, {
      date: Date.now()
    });
    StorageManager.updateSection(this.currentSectionId, {
      lastModified: Date.now()
    });
    
    this.hideNewEntryEditor();
    this.render();
  }

  // Editar Entrada (inline)
  static editEntry(entryId) {
    const section = StorageManager.getSection(this.currentSectionId);
    const page = section.pages.find(p => p.id === this.currentPageId);
    const entry = page.entries.find(e => e.id === entryId);
    
    if (!entry) return;
    
    // Obtener el elemento de la entrada
    const entryElement = document.getElementById(`entry-${entryId}`);
    if (!entryElement) return;
    
    // Crear el editor
    const editorElement = this.createEditEntryElement(entry);
    
    // Reemplazar la entrada con el editor
    entryElement.replaceWith(editorElement);
    
    // Hacer scroll al editor y enfocar
    editorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      document.getElementById(`editEntryTitle-${entryId}`).focus();
    }, 300);
  }

  static cancelEditEntry(entryId) {
    // Volver a renderizar para restaurar la entrada original
    this.render();
  }

  static saveEditEntry(entryId) {
    const titleInput = document.getElementById(`editEntryTitle-${entryId}`);
    const contentInput = document.getElementById(`editEntryContent-${entryId}`);
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title) {
      alert('Por favor ingresa un título para la entrada');
      titleInput.focus();
      return;
    }
    
    if (!content) {
      alert('Por favor ingresa contenido para la entrada');
      contentInput.focus();
      return;
    }
    
    StorageManager.updateEntry(this.currentSectionId, this.currentPageId, entryId, {
      title,
      content,
      lastModified: Date.now()
    });
    
    StorageManager.updatePage(this.currentSectionId, this.currentPageId, {
      date: Date.now()
    });
    StorageManager.updateSection(this.currentSectionId, {
      lastModified: Date.now()
    });
    
    this.render();
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

// ==========================================
// VISTA DE SECCIONES
// ==========================================
class SectionsView {
  static editingSectionId = null;
  static deletingSectionId = null;
  static selectedIcon = 'lightbulb';
  static pendingImportData = null;

  static init() {
    this.setupEventListeners();
  }

  static setupEventListeners() {
    // Menú
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

    // Búsqueda
    document.getElementById('sectionsSearchBtn').addEventListener('click', () => this.toggleSearch());
    document.getElementById('sectionsSearchInput').addEventListener('input', (e) => {
      this.render(e.target.value);
    });

    // Añadir sección
    document.getElementById('addSectionBtn').addEventListener('click', () => {
      this.editingSectionId = null;
      this.openSectionModal();
    });

    // Modal About
    document.getElementById('closeAboutModal').addEventListener('click', () => this.closeAboutModal());
    document.getElementById('aboutModal').addEventListener('click', (e) => {
      if (e.target.id === 'aboutModal') this.closeAboutModal();
    });

    // Modal Sección
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

    // Modal eliminar
    document.getElementById('cancelDeleteSectionBtn').addEventListener('click', () => this.closeDeleteModal());
    document.getElementById('confirmDeleteSectionBtn').addEventListener('click', () => this.confirmDelete());
    document.getElementById('deleteSectionModal').addEventListener('click', (e) => {
      if (e.target.id === 'deleteSectionModal') this.closeDeleteModal();
    });

    // Modales importar
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

  static render(filter = '') {
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
          <button onclick="event.stopPropagation(); SectionsView.editSection('${section.id}')" class="p-2 hover:bg-white/10 rounded-lg">
            <span class="material-symbols-outlined text-primary text-xl">edit</span>
          </button>
          <button onclick="event.stopPropagation(); SectionsView.openDeleteModal('${section.id}')" class="p-2 hover:bg-white/10 rounded-lg">
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

  // Búsqueda
  static toggleSearch() {
    const searchBar = document.getElementById('sectionsSearchBar');
    const searchInput = document.getElementById('sectionsSearchInput');
    
    if (searchBar.classList.contains('hidden')) {
      searchBar.classList.remove('hidden');
      searchInput.focus();
    } else {
      searchBar.classList.add('hidden');
      searchInput.value = '';
      this.render();
    }
  }

  // Menú
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

  // Modal Sección
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
    this.render();
  }

  static editSection(sectionId) {
    this.editingSectionId = sectionId;
    this.openSectionModal();
  }

  // Modal Eliminar
  static openDeleteModal(sectionId) {
    this.deletingSectionId = sectionId;
    document.getElementById('deleteSectionModal').classList.remove('hidden');
  }

  static closeDeleteModal() {
    document.getElementById('deleteSectionModal').classList.add('hidden');
    this.deletingSectionId = null;
  }

  static confirmDelete() {
    if (this.deletingSectionId) {
      StorageManager.deleteSection(this.deletingSectionId);
      this.closeDeleteModal();
      this.render();
    }
  }

  // Exportar / Importar
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
    if (!data || typeof data !== 'object') return false;
    if (!Array.isArray(data.sections)) return false;
    
    for (const section of data.sections) {
      if (!section.id || typeof section.name !== 'string') return false;
      if (!Array.isArray(section.pages)) return false;
      
      for (const page of section.pages) {
        if (!page.id || typeof page.name !== 'string') return false;
        if (!Array.isArray(page.entries)) return false;
        
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
      this.render();
    }
  }

  static openImportErrorModal() {
    document.getElementById('importErrorModal').classList.remove('hidden');
  }

  static closeImportErrorModal() {
    document.getElementById('importErrorModal').classList.add('hidden');
  }
}

// Exponer globalmente
window.SectionsView = SectionsView;


// Lógica específica para la página de secciones
let selectedIcon = 'lightbulb';
let editingSectionId = null;
let deletingSectionId = null;
let pendingImportData = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  initializeDefaultData();
  renderSections();
  setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
  // Botón menú (toggle dropdown)
  document.getElementById('menuBtn').addEventListener('click', toggleMenuDropdown);
  
  // Cerrar dropdown al hacer clic fuera
  document.addEventListener('click', (e) => {
    const menuBtn = document.getElementById('menuBtn');
    const menuDropdown = document.getElementById('menuDropdown');
    if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.classList.add('hidden');
    }
  });
  
  // Opciones del menú
  document.getElementById('exportDataBtn').addEventListener('click', exportData);
  document.getElementById('importDataBtn').addEventListener('click', triggerImport);
  document.getElementById('aboutBtn').addEventListener('click', () => {
    closeMenuDropdown();
    openAboutModal();
  });
  
  // File input
  document.getElementById('fileInput').addEventListener('change', handleFileSelect);
  
  // Búsqueda
  document.getElementById('searchBtn').addEventListener('click', toggleSearch);
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  
  // Botón añadir sección
  document.getElementById('addSectionBtn').addEventListener('click', () => {
    editingSectionId = null;
    openSectionModal();
  });
  
  // Modal About
  document.getElementById('closeAboutModal').addEventListener('click', closeAboutModal);
  document.getElementById('aboutModal').addEventListener('click', (e) => {
    if (e.target.id === 'aboutModal') closeAboutModal();
  });
  
  // Modal Sección
  document.getElementById('closeSectionModal').addEventListener('click', closeSectionModal);
  document.getElementById('cancelSectionBtn').addEventListener('click', closeSectionModal);
  document.getElementById('saveSectionBtn').addEventListener('click', saveSection);
  document.getElementById('sectionModal').addEventListener('click', (e) => {
    if (e.target.id === 'sectionModal') closeSectionModal();
  });
  
  // Selección de iconos
  document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('bg-primary/40'));
      btn.classList.add('bg-primary/40');
      selectedIcon = btn.dataset.icon;
    });
  });
  
  // Modal eliminar
  document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
  document.getElementById('deleteModal').addEventListener('click', (e) => {
    if (e.target.id === 'deleteModal') closeDeleteModal();
  });
  
  // Modal importar
  document.getElementById('cancelImportBtn').addEventListener('click', closeImportModal);
  document.getElementById('confirmImportBtn').addEventListener('click', confirmImport);
  document.getElementById('importModal').addEventListener('click', (e) => {
    if (e.target.id === 'importModal') closeImportModal();
  });
  
  // Modal error importar
  document.getElementById('closeErrorBtn').addEventListener('click', closeImportErrorModal);
  document.getElementById('importErrorModal').addEventListener('click', (e) => {
    if (e.target.id === 'importErrorModal') closeImportErrorModal();
  });
}

// Renderizar secciones
function renderSections(filter = '') {
  const container = document.getElementById('sectionsList');
  const emptyState = document.getElementById('emptyState');
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
      const totalEntries = getTotalEntries(section);
      const sectionEl = createSectionElement(section, totalEntries);
      container.appendChild(sectionEl);
    });
  }
}

// Crear elemento de sección
function createSectionElement(section, totalEntries) {
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
        <button onclick="event.stopPropagation(); editSection('${section.id}')" class="p-2 hover:bg-white/10 rounded-lg">
          <span class="material-symbols-outlined text-primary text-xl">edit</span>
        </button>
        <button onclick="event.stopPropagation(); openDeleteModal('${section.id}')" class="p-2 hover:bg-white/10 rounded-lg">
          <span class="material-symbols-outlined text-red-500 text-xl">delete</span>
        </button>
      </div>
    </div>
  `;
  
  return div;
}

// Obtener total de entradas en una sección
function getTotalEntries(section) {
  if (!section.pages) return 0;
  return section.pages.reduce((total, page) => {
    return total + (page.entries ? page.entries.length : 0);
  }, 0);
}

// Modal About
function openAboutModal() {
  document.getElementById('aboutModal').classList.remove('hidden');
}

function closeAboutModal() {
  document.getElementById('aboutModal').classList.add('hidden');
}

// Búsqueda
function toggleSearch() {
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  
  if (searchBar.classList.contains('hidden')) {
    searchBar.classList.remove('hidden');
    searchInput.focus();
  } else {
    searchBar.classList.add('hidden');
    searchInput.value = '';
    renderSections();
  }
}

function handleSearch(e) {
  const filter = e.target.value;
  renderSections(filter);
}

// Modal Sección
function openSectionModal() {
  const modal = document.getElementById('sectionModal');
  const title = document.getElementById('sectionModalTitle');
  const nameInput = document.getElementById('sectionName');
  
  if (editingSectionId) {
    const section = StorageManager.getSection(editingSectionId);
    title.textContent = 'Editar Sección';
    nameInput.value = section.name;
    selectedIcon = section.icon || 'lightbulb';
    
    // Resaltar icono seleccionado
    document.querySelectorAll('.icon-btn').forEach(btn => {
      btn.classList.remove('bg-primary/40');
      if (btn.dataset.icon === selectedIcon) {
        btn.classList.add('bg-primary/40');
      }
    });
  } else {
    title.textContent = 'Nueva Sección';
    nameInput.value = '';
    selectedIcon = 'lightbulb';
    
    // Resaltar primer icono
    document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.remove('bg-primary/40'));
    document.querySelector('.icon-btn').classList.add('bg-primary/40');
  }
  
  modal.classList.remove('hidden');
  nameInput.focus();
}

function closeSectionModal() {
  document.getElementById('sectionModal').classList.add('hidden');
  editingSectionId = null;
}

function saveSection() {
  const nameInput = document.getElementById('sectionName');
  const name = nameInput.value.trim();
  
  if (!name) {
    alert('Por favor ingresa un nombre para la sección');
    return;
  }
  
  if (editingSectionId) {
    // Editar sección existente
    StorageManager.updateSection(editingSectionId, {
      name,
      icon: selectedIcon,
      lastModified: Date.now()
    });
  } else {
    // Crear nueva sección
    const newSection = {
      id: Utils.generateId(),
      name,
      icon: selectedIcon,
      lastModified: Date.now(),
      pages: []
    };
    StorageManager.addSection(newSection);
  }
  
  closeSectionModal();
  renderSections();
}

function editSection(sectionId) {
  editingSectionId = sectionId;
  openSectionModal();
}

// Modal Eliminar
function openDeleteModal(sectionId) {
  deletingSectionId = sectionId;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.add('hidden');
  deletingSectionId = null;
}

function confirmDelete() {
  if (deletingSectionId) {
    StorageManager.deleteSection(deletingSectionId);
    closeDeleteModal();
    renderSections();
  }
}

// Menu Dropdown
function toggleMenuDropdown() {
  const dropdown = document.getElementById('menuDropdown');
  dropdown.classList.toggle('hidden');
}

function closeMenuDropdown() {
  document.getElementById('menuDropdown').classList.add('hidden');
}

// Exportar datos
function exportData() {
  closeMenuDropdown();
  
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

// Importar datos
function triggerImport() {
  closeMenuDropdown();
  document.getElementById('fileInput').click();
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      
      // Validar estructura
      if (validateImportData(data)) {
        pendingImportData = data;
        openImportModal();
      } else {
        openImportErrorModal();
      }
    } catch (error) {
      openImportErrorModal();
    }
    
    // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = '';
  };
  
  reader.readAsText(file);
}

function validateImportData(data) {
  // Verificar que sea un objeto
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Verificar que tenga la propiedad sections
  if (!Array.isArray(data.sections)) {
    return false;
  }
  
  // Validar estructura de cada sección
  for (const section of data.sections) {
    // Verificar propiedades básicas de sección
    if (!section.id || typeof section.name !== 'string') {
      return false;
    }
    
    // Verificar que pages sea un array (puede estar vacío)
    if (!Array.isArray(section.pages)) {
      return false;
    }
    
    // Validar estructura de cada página
    for (const page of section.pages) {
      if (!page.id || typeof page.name !== 'string') {
        return false;
      }
      
      // Verificar que entries sea un array (puede estar vacío)
      if (!Array.isArray(page.entries)) {
        return false;
      }
      
      // Validar estructura de cada entrada
      for (const entry of page.entries) {
        if (!entry.id || typeof entry.title !== 'string' || typeof entry.content !== 'string') {
          return false;
        }
      }
    }
  }
  
  return true;
}

// Modales de importación
function openImportModal() {
  document.getElementById('importModal').classList.remove('hidden');
}

function closeImportModal() {
  document.getElementById('importModal').classList.add('hidden');
  pendingImportData = null;
}

function confirmImport() {
  if (pendingImportData) {
    StorageManager.saveData(pendingImportData);
    closeImportModal();
    renderSections();
  }
}

function openImportErrorModal() {
  document.getElementById('importErrorModal').classList.remove('hidden');
}

function closeImportErrorModal() {
  document.getElementById('importErrorModal').classList.add('hidden');
}


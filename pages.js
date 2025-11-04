// Lógica específica para la página de páginas
let currentSectionId = null;
let editingPageId = null;
let deletingPageId = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  currentSectionId = NavigationManager.getCurrentSection();
  
  if (!currentSectionId) {
    // Si no hay sección seleccionada, redirigir a secciones
    NavigationManager.goToSections();
    return;
  }
  
  initializeDefaultData();
  loadSectionData();
  renderPages();
  setupEventListeners();
});

// Cargar datos de la sección
function loadSectionData() {
  const section = StorageManager.getSection(currentSectionId);
  if (section) {
    document.getElementById('sectionTitle').textContent = section.name;
  } else {
    NavigationManager.goToSections();
  }
}

// Configurar event listeners
function setupEventListeners() {
  // Botón volver
  document.getElementById('backBtn').addEventListener('click', () => {
    NavigationManager.goBack('pages');
  });
  
  // Búsqueda
  document.getElementById('searchBtn').addEventListener('click', toggleSearch);
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  
  // Botón añadir página
  document.getElementById('addPageBtn').addEventListener('click', () => {
    editingPageId = null;
    openPageModal();
  });
  
  // Modal Página
  document.getElementById('closePageModal').addEventListener('click', closePageModal);
  document.getElementById('cancelPageBtn').addEventListener('click', closePageModal);
  document.getElementById('savePageBtn').addEventListener('click', savePage);
  document.getElementById('pageModal').addEventListener('click', (e) => {
    if (e.target.id === 'pageModal') closePageModal();
  });
  
  // Modal eliminar
  document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
  document.getElementById('deleteModal').addEventListener('click', (e) => {
    if (e.target.id === 'deleteModal') closeDeleteModal();
  });
}

// Renderizar páginas
function renderPages(filter = '') {
  const container = document.getElementById('pagesList');
  const emptyState = document.getElementById('emptyState');
  const section = StorageManager.getSection(currentSectionId);
  
  if (!section) {
    NavigationManager.goToSections();
    return;
  }
  
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
      const pageEl = createPageElement(page);
      container.appendChild(pageEl);
    });
  }
}

// Crear elemento de página
function createPageElement(page) {
  const div = document.createElement('div');
  div.className = 'flex items-center gap-4 bg-transparent px-4 min-h-[72px] py-2 justify-between hover:bg-white/5 dark:hover:bg-white/5 transition-colors rounded-lg group';
  
  const entryCount = page.entries ? page.entries.length : 0;
  
  div.innerHTML = `
    <div class="flex items-center gap-4 flex-grow cursor-pointer" onclick="NavigationManager.goToEntries('${currentSectionId}', '${page.id}')">
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
        <button onclick="event.stopPropagation(); editPage('${page.id}')" class="p-2 hover:bg-white/10 rounded-lg">
          <span class="material-symbols-outlined text-primary text-xl">edit</span>
        </button>
        <button onclick="event.stopPropagation(); openDeleteModal('${page.id}')" class="p-2 hover:bg-white/10 rounded-lg">
          <span class="material-symbols-outlined text-red-500 text-xl">delete</span>
        </button>
      </div>
    </div>
  `;
  
  return div;
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
    renderPages();
  }
}

function handleSearch(e) {
  const filter = e.target.value;
  renderPages(filter);
}

// Modal Página
function openPageModal() {
  const modal = document.getElementById('pageModal');
  const title = document.getElementById('pageModalTitle');
  const nameInput = document.getElementById('pageName');
  
  if (editingPageId) {
    const page = StorageManager.getPage(currentSectionId, editingPageId);
    title.textContent = 'Editar Página';
    nameInput.value = page.name;
  } else {
    title.textContent = 'Nueva Página';
    nameInput.value = '';
  }
  
  modal.classList.remove('hidden');
  nameInput.focus();
}

function closePageModal() {
  document.getElementById('pageModal').classList.add('hidden');
  editingPageId = null;
}

function savePage() {
  const nameInput = document.getElementById('pageName');
  const name = nameInput.value.trim();
  
  if (!name) {
    alert('Por favor ingresa un nombre para la página');
    return;
  }
  
  if (editingPageId) {
    // Editar página existente
    StorageManager.updatePage(currentSectionId, editingPageId, {
      name,
      date: Date.now()
    });
    // Actualizar también la sección
    StorageManager.updateSection(currentSectionId, {
      lastModified: Date.now()
    });
  } else {
    // Crear nueva página
    const newPage = {
      id: Utils.generateId(),
      name,
      date: Date.now(),
      entries: []
    };
    StorageManager.addPage(currentSectionId, newPage);
    // Actualizar también la sección
    StorageManager.updateSection(currentSectionId, {
      lastModified: Date.now()
    });
  }
  
  closePageModal();
  renderPages();
}

function editPage(pageId) {
  editingPageId = pageId;
  openPageModal();
}

// Modal Eliminar
function openDeleteModal(pageId) {
  deletingPageId = pageId;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.add('hidden');
  deletingPageId = null;
}

function confirmDelete() {
  if (deletingPageId) {
    StorageManager.deletePage(currentSectionId, deletingPageId);
    // Actualizar también la sección
    StorageManager.updateSection(currentSectionId, {
      lastModified: Date.now()
    });
    closeDeleteModal();
    renderPages();
  }
}


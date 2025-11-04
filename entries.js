// Lógica específica para la página de entradas
let currentSectionId = null;
let currentPageId = null;
let editingEntryId = null;
let deletingEntryId = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  currentSectionId = NavigationManager.getCurrentSection();
  currentPageId = NavigationManager.getCurrentPage();
  
  if (!currentSectionId || !currentPageId) {
    // Si no hay sección o página seleccionada, redirigir
    NavigationManager.goToSections();
    return;
  }
  
  initializeDefaultData();
  loadPageData();
  renderEntries();
  setupEventListeners();
});

// Cargar datos de la página
function loadPageData() {
  const page = StorageManager.getPage(currentSectionId, currentPageId);
  if (page) {
    document.getElementById('pageTitle').textContent = page.name;
  } else {
    NavigationManager.goBack('entries');
  }
}

// Configurar event listeners
function setupEventListeners() {
  // Botón volver
  document.getElementById('backBtn').addEventListener('click', () => {
    NavigationManager.goBack('entries');
  });
  
  // Búsqueda
  document.getElementById('searchBtn').addEventListener('click', toggleSearch);
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  
  // Botón añadir entrada
  document.getElementById('addEntryBtn').addEventListener('click', () => {
    editingEntryId = null;
    openEntryModal();
  });
  
  // Modal Entrada
  document.getElementById('closeEntryModal').addEventListener('click', closeEntryModal);
  document.getElementById('cancelEntryBtn').addEventListener('click', closeEntryModal);
  document.getElementById('saveEntryBtn').addEventListener('click', saveEntry);
  document.getElementById('entryModal').addEventListener('click', (e) => {
    if (e.target.id === 'entryModal') closeEntryModal();
  });
  
  // Modal eliminar
  document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
  document.getElementById('deleteModal').addEventListener('click', (e) => {
    if (e.target.id === 'deleteModal') closeDeleteModal();
  });
}

// Renderizar entradas
function renderEntries(filter = '') {
  const container = document.getElementById('entriesList');
  const emptyState = document.getElementById('emptyState');
  const page = StorageManager.getPage(currentSectionId, currentPageId);
  
  if (!page) {
    NavigationManager.goBack('entries');
    return;
  }
  
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
      const entryEl = createEntryElement(entry);
      container.appendChild(entryEl);
    });
  }
}

// Crear elemento de entrada
function createEntryElement(entry) {
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
      <button onclick="editEntry('${entry.id}')" class="text-primary font-medium leading-normal text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        Editar
      </button>
      <button onclick="openDeleteModal('${entry.id}')" class="text-red-500 font-medium leading-normal text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        Eliminar
      </button>
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
    renderEntries();
  }
}

function handleSearch(e) {
  const filter = e.target.value;
  renderEntries(filter);
}

// Modal Entrada
function openEntryModal() {
  const modal = document.getElementById('entryModal');
  const title = document.getElementById('entryModalTitle');
  const titleInput = document.getElementById('entryTitle');
  const contentInput = document.getElementById('entryContent');
  
  if (editingEntryId) {
    const section = StorageManager.getSection(currentSectionId);
    const page = section.pages.find(p => p.id === currentPageId);
    const entry = page.entries.find(e => e.id === editingEntryId);
    
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

function closeEntryModal() {
  document.getElementById('entryModal').classList.add('hidden');
  editingEntryId = null;
}

function saveEntry() {
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
  
  if (editingEntryId) {
    // Editar entrada existente
    StorageManager.updateEntry(currentSectionId, currentPageId, editingEntryId, {
      title,
      content,
      lastModified: Date.now()
    });
  } else {
    // Crear nueva entrada
    const newEntry = {
      id: Utils.generateId(),
      title,
      content,
      lastModified: Date.now()
    };
    StorageManager.addEntry(currentSectionId, currentPageId, newEntry);
  }
  
  // Actualizar también la página y la sección
  StorageManager.updatePage(currentSectionId, currentPageId, {
    date: Date.now()
  });
  StorageManager.updateSection(currentSectionId, {
    lastModified: Date.now()
  });
  
  closeEntryModal();
  renderEntries();
}

function editEntry(entryId) {
  editingEntryId = entryId;
  openEntryModal();
}

// Modal Eliminar
function openDeleteModal(entryId) {
  deletingEntryId = entryId;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.add('hidden');
  deletingEntryId = null;
}

function confirmDelete() {
  if (deletingEntryId) {
    StorageManager.deleteEntry(currentSectionId, currentPageId, deletingEntryId);
    // Actualizar también la página y la sección
    StorageManager.updatePage(currentSectionId, currentPageId, {
      date: Date.now()
    });
    StorageManager.updateSection(currentSectionId, {
      lastModified: Date.now()
    });
    closeDeleteModal();
    renderEntries();
  }
}


<template>
  <div class="fixed inset-0 w-full flex flex-col bg-background-dark text-white overflow-x-hidden overflow-y-auto">
    <!-- Top App Bar -->
    <header class="sticky top-0 z-10 bg-background-dark/80 backdrop-blur-sm">
      <div class="flex items-center p-4 pb-2 justify-between">
        <div class="flex size-12 shrink-0 items-center justify-start relative">
          <button 
            @click="toggleMenuDropdown" 
            class="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 transition-colors relative"
          >
            <span class="material-symbols-outlined text-white text-2xl">menu</span>
            <!-- Badge de actualización disponible -->
            <span 
              v-if="pwaUpdate.updateAvailable.value" 
              class="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full border-2 border-background-dark animate-pulse"
            ></span>
          </button>
          <!-- Dropdown Menu -->
          <div 
            v-show="showMenuDropdown" 
            class="absolute top-14 left-0 bg-background-dark border border-white/20 rounded-xl shadow-xl min-w-[200px] overflow-hidden z-50"
          >
            <button 
              v-if="pwaUpdate.updateAvailable.value"
              @click="applyUpdate" 
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left bg-primary/10"
            >
              <span class="material-symbols-outlined text-primary text-xl">update</span>
              <div class="flex flex-col">
                <span class="text-white text-sm font-semibold">Actualización disponible</span>
                <span class="text-white/60 text-xs">Toca para actualizar</span>
              </div>
            </button>
            <div v-if="pwaUpdate.updateAvailable.value" class="border-t border-white/10"></div>
            <button 
              @click="exportData" 
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <span class="material-symbols-outlined text-primary text-xl">download</span>
              <span class="text-white text-sm">Exportar datos</span>
            </button>
            <button 
              @click="triggerImport" 
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <span class="material-symbols-outlined text-primary text-xl">upload</span>
              <span class="text-white text-sm">Importar datos</span>
            </button>
            <div class="border-t border-white/10"></div>
            <button 
              v-if="pwaInstaller.canInstall.value"
              @click="installPWA" 
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <span class="material-symbols-outlined text-primary text-xl">install_mobile</span>
              <span class="text-white text-sm">Instalar App</span>
            </button>
            <div v-if="pwaInstaller.canInstall.value" class="border-t border-white/10"></div>
            <button 
              @click="openAboutModal" 
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <span class="material-symbols-outlined text-primary text-xl">info</span>
              <span class="text-white text-sm">Acerca de</span>
            </button>
          </div>
        </div>
        <h1 class="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Mis Secciones
        </h1>
        <div class="flex w-12 items-center justify-end">
          <button 
            @click="toggleSearch" 
            class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 w-12 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
          >
            <span class="material-symbols-outlined text-white text-2xl">search</span>
          </button>
        </div>
      </div>
      <!-- Search Bar -->
      <div 
        v-show="showSearch" 
        class="px-4 pb-3 bg-background-dark/80 backdrop-blur-sm sticky top-[60px] z-10"
      >
        <div class="relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar secciones..." 
            class="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
          >
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-white/50">search</span>
        </div>
      </div>
    </header>
    
    <!-- Main Content: List of Sections -->
    <main class="flex-1 px-4 py-4">
      <div v-if="filteredSections.length > 0" class="flex flex-col gap-2">
        <SectionItem
          v-for="section in filteredSections"
          :key="section.id"
          :section="section"
          @edit="editSection"
          @delete="openDeleteModal"
        />
      </div>
      <!-- Empty State -->
      <div 
        v-else 
        class="flex flex-col items-center justify-center text-center mt-20 px-6 py-12 bg-white/5 rounded-xl"
      >
        <span class="material-symbols-outlined text-primary text-6xl mb-4">note_stack</span>
        <h3 class="text-white text-lg font-bold">Aún no tienes secciones</h3>
        <p class="text-white/60 mt-1 max-w-xs">
          ¡Crea la primera usando el botón '+' para empezar a organizar tus notas!
        </p>
      </div>
    </main>
    
    <!-- Floating Action Button -->
    <div class="sticky bottom-0 right-0 p-6 flex justify-end">
      <button 
        @click="openSectionModal(null)" 
        class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 w-14 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all duration-200"
      >
        <span class="material-symbols-outlined text-white text-3xl">add</span>
      </button>
    </div>

    <!-- Modals -->
    <SectionModal 
      v-if="showSectionModal"
      :section="editingSection"
      @close="closeSectionModal"
      @save="saveSection"
    />

    <AboutModal 
      v-if="showAbout"
      @close="closeAboutModal"
    />

    <DeleteModal
      v-if="showDeleteModal"
      title="Eliminar Sección"
      message="¿Estás seguro de que deseas eliminar esta sección? Se eliminarán todas las páginas y entradas asociadas. Esta acción no se puede deshacer."
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />

    <ImportModal
      v-if="showImportModal"
      @close="closeImportModal"
      @confirm="confirmImport"
    />

    <ImportErrorModal
      v-if="showImportError"
      @close="closeImportErrorModal"
    />

    <!-- Hidden file input for import -->
    <input 
      ref="fileInput" 
      type="file" 
      accept=".json" 
      class="hidden" 
      @change="handleFileSelect"
    >
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStorage } from '@/composables/useStorage';
import { useUtils } from '@/composables/useUtils';
import { usePWAInstaller } from '@/composables/usePWAInstaller';
import { usePWAUpdate } from '@/composables/usePWAUpdate';
import SectionItem from '@/components/items/SectionItem.vue';
import SectionModal from '@/components/modals/SectionModal.vue';
import AboutModal from '@/components/modals/AboutModal.vue';
import DeleteModal from '@/components/modals/DeleteModal.vue';
import ImportModal from '@/components/modals/ImportModal.vue';
import ImportErrorModal from '@/components/modals/ImportErrorModal.vue';

const storage = useStorage();
const utils = useUtils();
const pwaInstaller = usePWAInstaller();
const pwaUpdate = usePWAUpdate();

// Estado
const showMenuDropdown = ref(false);
const showSearch = ref(false);
const searchQuery = ref('');
const showSectionModal = ref(false);
const showAbout = ref(false);
const showDeleteModal = ref(false);
const showImportModal = ref(false);
const showImportError = ref(false);
const editingSection = ref(null);
const deletingSectionId = ref(null);
const pendingImportData = ref(null);
const fileInput = ref(null);

// Computed
const filteredSections = computed(() => {
  if (!searchQuery.value) {
    return storage.sections.value;
  }
  return storage.sections.value.filter(s => 
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Methods
const toggleMenuDropdown = () => {
  showMenuDropdown.value = !showMenuDropdown.value;
};

const closeMenuDropdown = () => {
  showMenuDropdown.value = false;
};

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) {
    searchQuery.value = '';
  }
};

const openSectionModal = (section) => {
  editingSection.value = section;
  showSectionModal.value = true;
  closeMenuDropdown();
};

const closeSectionModal = () => {
  showSectionModal.value = false;
  editingSection.value = null;
};

const saveSection = (sectionData) => {
  if (editingSection.value) {
    storage.updateSection(editingSection.value.id, {
      ...sectionData,
      lastModified: Date.now()
    });
  } else {
    const newSection = {
      id: utils.generateId(),
      ...sectionData,
      lastModified: Date.now(),
      pages: []
    };
    storage.addSection(newSection);
  }
  closeSectionModal();
};

const editSection = (sectionId) => {
  const section = storage.getSection(sectionId);
  openSectionModal(section);
};

const openDeleteModal = (sectionId) => {
  deletingSectionId.value = sectionId;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deletingSectionId.value = null;
};

const confirmDelete = () => {
  if (deletingSectionId.value) {
    storage.deleteSection(deletingSectionId.value);
    closeDeleteModal();
  }
};

const openAboutModal = () => {
  closeMenuDropdown();
  showAbout.value = true;
};

const closeAboutModal = () => {
  showAbout.value = false;
};

// Export / Import
const exportData = () => {
  closeMenuDropdown();
  
  const data = storage.getData();
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
};

const triggerImport = () => {
  closeMenuDropdown();
  fileInput.value.click();
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      
      if (validateImportData(data)) {
        pendingImportData.value = data;
        showImportModal.value = true;
      } else {
        showImportError.value = true;
      }
    } catch (error) {
      showImportError.value = true;
    }
    
    e.target.value = '';
  };
  
  reader.readAsText(file);
};

const validateImportData = (data) => {
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
};

const closeImportModal = () => {
  showImportModal.value = false;
  pendingImportData.value = null;
};

const confirmImport = () => {
  if (pendingImportData.value) {
    storage.saveData(pendingImportData.value);
    closeImportModal();
  }
};

const closeImportErrorModal = () => {
  showImportError.value = false;
};

// PWA Install
const installPWA = async () => {
  closeMenuDropdown();
  await pwaInstaller.install();
};

// PWA Update
const applyUpdate = () => {
  closeMenuDropdown();
  pwaUpdate.applyUpdate();
};

// Click outside handler
const handleClickOutside = (e) => {
  if (showMenuDropdown.value && !e.target.closest('.relative')) {
    closeMenuDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  pwaInstaller.init();
  pwaUpdate.init();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>


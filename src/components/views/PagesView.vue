<template>
  <div class="fixed inset-0 w-full flex flex-col bg-background-light dark:bg-background-dark overflow-x-hidden overflow-y-auto">
    <!-- Top App Bar -->
    <div class="flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 pb-2 justify-between sticky top-0 z-10 border-b border-white/10">
      <div class="text-slate-800 dark:text-white flex size-12 shrink-0 items-center justify-start">
        <button 
          @click="goBack" 
          class="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 transition-colors"
        >
          <span class="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
      </div>
      <h2 class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
        {{ section?.name || 'Páginas' }}
      </h2>
      <div class="flex w-12 items-center justify-end">
        <button 
          @click="toggleSearch" 
          class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-slate-800 dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
        >
          <span class="material-symbols-outlined text-2xl">search</span>
        </button>
      </div>
    </div>
    
    <!-- Search Bar -->
    <div 
      v-show="showSearch" 
      class="px-4 pb-3 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm sticky top-[60px] z-10 border-b border-white/10"
    >
      <div class="relative">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar páginas..." 
          class="w-full bg-white dark:bg-white/10 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/50 border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
        >
        <span class="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 dark:text-white/50">search</span>
      </div>
    </div>
    
    <!-- Page List -->
    <div class="flex-grow pt-4">
      <div v-if="filteredPages.length > 0">
        <PageItem
          v-for="page in filteredPages"
          :key="page.id"
          :page="page"
          :section-id="sectionId"
          @edit="editPage"
          @delete="openDeleteModal"
        />
      </div>
      <!-- Empty State -->
      <div 
        v-else 
        class="flex flex-col items-center justify-center text-center p-8 flex-grow"
      >
        <span class="material-symbols-outlined text-7xl text-slate-700 dark:text-slate-400 mb-4">edit_note</span>
        <h3 class="text-slate-800 dark:text-white text-lg font-semibold">Crea tu primera página</h3>
        <p class="text-slate-600 dark:text-slate-400 mt-1">Pulsa el botón '+' para empezar a escribir.</p>
      </div>
    </div>
    
    <!-- Floating Action Button -->
    <div class="fixed bottom-6 right-6">
      <button 
        @click="openPageModal(null)" 
        class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 w-14 shadow-lg shadow-primary/30 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
      >
        <span class="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>

    <!-- Modals -->
    <PageModal
      v-if="showPageModal"
      :page="editingPage"
      @close="closePageModal"
      @save="savePage"
    />

    <DeleteModal
      v-if="showDeleteModal"
      title="Eliminar Página"
      message="¿Estás seguro de que deseas eliminar esta página? Se eliminarán todas las entradas asociadas. Esta acción no se puede deshacer."
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStorage } from '@/composables/useStorage';
import { useUtils } from '@/composables/useUtils';
import { useNavigation } from '@/composables/useNavigation';
import PageItem from '@/components/items/PageItem.vue';
import PageModal from '@/components/modals/PageModal.vue';
import DeleteModal from '@/components/modals/DeleteModal.vue';

const props = defineProps({
  sectionId: {
    type: String,
    required: true
  }
});

const storage = useStorage();
const utils = useUtils();
const navigation = useNavigation();

// Estado
const showSearch = ref(false);
const searchQuery = ref('');
const showPageModal = ref(false);
const showDeleteModal = ref(false);
const editingPage = ref(null);
const deletingPageId = ref(null);

// Computed
const section = computed(() => storage.getSection(props.sectionId));

const pages = computed(() => section.value?.pages || []);

const filteredPages = computed(() => {
  if (!searchQuery.value) {
    return pages.value;
  }
  return pages.value.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Methods
const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) {
    searchQuery.value = '';
  }
};

const goBack = () => {
  navigation.goBack('pages');
};

const openPageModal = (page) => {
  editingPage.value = page;
  showPageModal.value = true;
};

const closePageModal = () => {
  showPageModal.value = false;
  editingPage.value = null;
};

const savePage = (pageData) => {
  if (editingPage.value) {
    storage.updatePage(props.sectionId, editingPage.value.id, {
      ...pageData,
      date: Date.now()
    });
    storage.updateSection(props.sectionId, {
      lastModified: Date.now()
    });
  } else {
    const newPage = {
      id: utils.generateId(),
      ...pageData,
      date: Date.now(),
      entries: []
    };
    storage.addPage(props.sectionId, newPage);
    storage.updateSection(props.sectionId, {
      lastModified: Date.now()
    });
  }
  closePageModal();
};

const editPage = (pageId) => {
  const page = storage.getPage(props.sectionId, pageId);
  openPageModal(page);
};

const openDeleteModal = (pageId) => {
  deletingPageId.value = pageId;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deletingPageId.value = null;
};

const confirmDelete = () => {
  if (deletingPageId.value) {
    storage.deletePage(props.sectionId, deletingPageId.value);
    storage.updateSection(props.sectionId, {
      lastModified: Date.now()
    });
    closeDeleteModal();
  }
};

// Verificar que la sección existe
watch(() => section.value, (newSection) => {
  if (!newSection) {
    navigation.goToSections();
  }
}, { immediate: true });
</script>


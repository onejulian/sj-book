<template>
  <div
    ref="entriesContainer"
    class="fixed inset-0 w-full flex flex-col bg-background-light dark:bg-background-dark overflow-x-hidden overflow-y-auto"
  >
    <!-- Top App Bar -->
    <div class="flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 pb-2 justify-between sticky top-0 z-10 border-b border-white/10">
      <div class="flex size-12 shrink-0 items-center text-white/90">
        <button 
          @click="goBack" 
          class="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 transition-colors"
        >
          <span class="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
      </div>
      <h2 class="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
        {{ page?.name || 'Mis Entradas' }}
      </h2>
      <div class="flex w-12 items-center justify-end">
        <button 
          @click="toggleSearch" 
          class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-transparent text-white/90 hover:bg-white/10 transition-colors"
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
          placeholder="Buscar entradas..." 
          class="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
        >
        <span class="material-symbols-outlined absolute left-3 top-2.5 text-white/50">search</span>
      </div>
    </div>
    
    <!-- List of Entries -->
    <div class="flex flex-col gap-4 px-4 pt-4 mb-20">
      <!-- Editor Inline (nuevo) -->
      <div 
        v-if="showNewEditor" 
        class="flex flex-col gap-3 bg-background-dark p-4 rounded-lg border-2 border-primary shadow-lg"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-white text-lg font-semibold">Nueva Entrada</h3>
          <button @click="hideNewEditor" class="text-white/60 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div>
          <input 
            v-model="newEntryTitle" 
            ref="newTitleInput"
            type="text" 
            placeholder="Título de la entrada" 
            class="w-full bg-white/10 text-white text-lg font-semibold placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
        </div>
        <div>
          <textarea 
            v-model="newEntryContent" 
            rows="8" 
            placeholder="Escribe aquí tu entrada..." 
            class="w-full bg-white/10 text-white text-base placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          ></textarea>
        </div>
        <div class="flex gap-3">
          <button 
            @click="hideNewEditor" 
            class="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="saveNewEntry" 
            class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
      
      <div v-if="filteredEntries.length > 0">
        <EntryItem
          v-for="entry in filteredEntries"
          :key="entry.id"
          :entry="entry"
          :editing="editingEntryId === entry.id"
          @edit="editEntry"
          @delete="openDeleteModal"
          @save="saveEntry"
          @cancel="cancelEdit"
        />
      </div>
      
      <!-- Empty State -->
      <div 
        v-else-if="!showNewEditor" 
        class="flex flex-col items-center justify-center text-center py-24 px-8"
      >
        <span class="material-symbols-outlined text-6xl text-white/30">edit_document</span>
        <h3 class="mt-4 text-lg font-medium text-white">No hay entradas aún</h3>
        <p class="mt-1 text-sm text-[#92adc9]">Presiona el botón '+' para empezar a escribir.</p>
      </div>
    </div>
    
    <!-- Floating Action Button -->
    <div class="fixed bottom-6 right-6">
      <button 
        @click="showNewEditorForm" 
        class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 w-14 bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
      >
        <span class="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>

    <!-- Delete Modal -->
    <DeleteModal
      v-if="showDeleteModal"
      title="Eliminar Entrada"
      message="¿Estás seguro de que deseas eliminar esta entrada? Esta acción no se puede deshacer."
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />

    <Teleport to="body">
      <div
        v-if="showSelectionTooltip"
        ref="tooltipRef"
        :style="tooltipStyle"
        class="fixed z-[60] flex items-center gap-2 rounded-full border border-white/20 bg-background-dark px-4 py-2 text-white shadow-lg backdrop-blur-sm"
      >
        <button
          @mousedown.prevent
          @click="copySelectedText"
          class="flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-primary"
        >
          <span class="material-symbols-outlined text-base leading-none">content_copy</span>
          Copiar
        </button>
        <span v-if="copyFeedback" class="text-xs text-primary">{{ copyFeedback }}</span>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useStorage } from '@/composables/useStorage';
import { useUtils } from '@/composables/useUtils';
import { useNavigation } from '@/composables/useNavigation';
import EntryItem from '@/components/items/EntryItem.vue';
import DeleteModal from '@/components/modals/DeleteModal.vue';

const props = defineProps({
  sectionId: {
    type: String,
    required: true
  },
  pageId: {
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
const showNewEditor = ref(false);
const newEntryTitle = ref('');
const newEntryContent = ref('');
const editingEntryId = ref(null);
const showDeleteModal = ref(false);
const deletingEntryId = ref(null);
const newTitleInput = ref(null);

const entriesContainer = ref(null);
const tooltipRef = ref(null);
const showSelectionTooltip = ref(false);
const selectedText = ref('');
const tooltipPosition = ref({ left: 0, top: 0 });
const tooltipPlacement = ref('above');
const copyFeedback = ref('');
let copyFeedbackTimer = null;

const tooltipStyle = computed(() => {
  const padding = 12;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const constrainedLeft = viewportWidth
    ? Math.min(viewportWidth - padding, Math.max(padding, tooltipPosition.value.left))
    : tooltipPosition.value.left;
  const constrainedTop = Math.max(padding, tooltipPosition.value.top);

  return {
    left: `${constrainedLeft}px`,
    top: `${constrainedTop}px`,
    transform: tooltipPlacement.value === 'above'
      ? 'translate(-50%, calc(-100% - 12px))'
      : 'translate(-50%, 12px)'
  };
});

// Computed
const page = computed(() => storage.getPage(props.sectionId, props.pageId));

const entries = computed(() => page.value?.entries || []);

const filteredEntries = computed(() => {
  if (!searchQuery.value) {
    return entries.value;
  }
  return entries.value.filter(e => 
    e.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    e.content.toLowerCase().includes(searchQuery.value.toLowerCase())
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
  navigation.goBack('entries');
};

const showNewEditorForm = () => {
  showNewEditor.value = true;
  newEntryTitle.value = '';
  newEntryContent.value = '';
  
  nextTick(() => {
    newTitleInput.value?.focus();
  });
};

const hideNewEditor = () => {
  showNewEditor.value = false;
  newEntryTitle.value = '';
  newEntryContent.value = '';
};

const saveNewEntry = () => {
  const title = newEntryTitle.value.trim();
  const content = newEntryContent.value.trim();
  
  if (!title) {
    alert('Por favor ingresa un título para la entrada');
    return;
  }
  
  if (!content) {
    alert('Por favor ingresa contenido para la entrada');
    return;
  }
  
  const newEntry = {
    id: utils.generateId(),
    title,
    content,
    lastModified: Date.now()
  };
  
  storage.addEntry(props.sectionId, props.pageId, newEntry);
  storage.updatePage(props.sectionId, props.pageId, {
    date: Date.now()
  });
  storage.updateSection(props.sectionId, {
    lastModified: Date.now()
  });
  
  hideNewEditor();
};

const editEntry = (entryId) => {
  editingEntryId.value = entryId;
};

const cancelEdit = () => {
  editingEntryId.value = null;
};

const saveEntry = (entryId, title, content) => {
  if (!title.trim()) {
    alert('Por favor ingresa un título para la entrada');
    return;
  }
  
  if (!content.trim()) {
    alert('Por favor ingresa contenido para la entrada');
    return;
  }
  
  storage.updateEntry(props.sectionId, props.pageId, entryId, {
    title: title.trim(),
    content: content.trim(),
    lastModified: Date.now()
  });
  
  storage.updatePage(props.sectionId, props.pageId, {
    date: Date.now()
  });
  storage.updateSection(props.sectionId, {
    lastModified: Date.now()
  });
  
  editingEntryId.value = null;
};

const openDeleteModal = (entryId) => {
  deletingEntryId.value = entryId;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deletingEntryId.value = null;
};

const confirmDelete = () => {
  if (deletingEntryId.value) {
    storage.deleteEntry(props.sectionId, props.pageId, deletingEntryId.value);
    storage.updatePage(props.sectionId, props.pageId, {
      date: Date.now()
    });
    storage.updateSection(props.sectionId, {
      lastModified: Date.now()
    });
    closeDeleteModal();
  }
};

const resetCopyFeedbackTimer = () => {
  if (copyFeedbackTimer) {
    clearTimeout(copyFeedbackTimer);
    copyFeedbackTimer = null;
  }
};

const hideSelectionTooltip = () => {
  resetCopyFeedbackTimer();
  showSelectionTooltip.value = false;
  selectedText.value = '';
  tooltipPlacement.value = 'above';
  copyFeedback.value = '';
};

const nodeToElement = (node) => {
  if (!node) return null;
  const isElementNode = typeof Node !== 'undefined'
    ? node.nodeType === Node.ELEMENT_NODE
    : node.nodeType === 1;
  return isElementNode ? node : node.parentElement || null;
};

const isNodeWithinEntries = (node) => {
  const element = nodeToElement(node);
  if (!entriesContainer.value || !element) return false;
  return entriesContainer.value.contains(element);
};

const handleSelectionChange = () => {
  const selection = typeof window !== 'undefined' ? window.getSelection?.() : null;

  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    hideSelectionTooltip();
    return;
  }

  const text = selection.toString();

  if (!text || !text.trim()) {
    hideSelectionTooltip();
    return;
  }

  const range = selection.getRangeAt(0);

  if (!isNodeWithinEntries(range.commonAncestorContainer)) {
    hideSelectionTooltip();
    return;
  }

  const ancestorElement = nodeToElement(range.commonAncestorContainer);

  if (ancestorElement && ['INPUT', 'TEXTAREA'].includes(ancestorElement.tagName)) {
    hideSelectionTooltip();
    return;
  }

  if (tooltipRef.value && ancestorElement && tooltipRef.value.contains(ancestorElement)) {
    return;
  }

  const rect = range.getBoundingClientRect();

  if (!rect || (!rect.width && !rect.height)) {
    hideSelectionTooltip();
    return;
  }

  selectedText.value = text;

  const centerX = rect.left + rect.width / 2;

  if (rect.top <= 80) {
    tooltipPlacement.value = 'below';
    tooltipPosition.value = {
      left: centerX,
      top: rect.bottom
    };
  } else {
    tooltipPlacement.value = 'above';
    tooltipPosition.value = {
      left: centerX,
      top: rect.top
    };
  }

  showSelectionTooltip.value = true;
};

const handleScroll = () => {
  if (showSelectionTooltip.value) {
    hideSelectionTooltip();
  }
};

const copySelectedText = async () => {
  if (!selectedText.value) return;

  const text = selectedText.value;
  const canUseClipboardAPI = typeof navigator !== 'undefined' && navigator.clipboard?.writeText;

  try {
    if (canUseClipboardAPI) {
      await navigator.clipboard.writeText(text);
    } else if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } else {
      throw new Error('Clipboard API no disponible');
    }

    resetCopyFeedbackTimer();
    copyFeedback.value = 'Copiado';
    copyFeedbackTimer = setTimeout(() => {
      copyFeedback.value = '';
      hideSelectionTooltip();
    }, 2000);
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
    resetCopyFeedbackTimer();
    copyFeedback.value = 'No se pudo copiar';
    copyFeedbackTimer = setTimeout(() => {
      copyFeedback.value = '';
    }, 3000);
  }
};

// Verificar que la página existe
watch([() => page.value], ([newPage]) => {
  if (!newPage) {
    navigation.goBack('entries');
  }
}, { immediate: true });

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('selectionchange', handleSelectionChange);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, true);
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('selectionchange', handleSelectionChange);
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll, true);
  }
  hideSelectionTooltip();
});
</script>


<template>
  <div v-if="editing" class="flex flex-col gap-3 bg-background-dark p-4 rounded-lg border-2 border-primary shadow-lg">
    <div class="flex items-center justify-between">
      <h3 class="text-white text-lg font-semibold">Editar Entrada</h3>
      <button @click="$emit('cancel')" class="text-white/60 hover:text-white">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div>
      <input 
        v-model="editTitle" 
        type="text" 
        class="w-full bg-white/10 text-white text-lg font-semibold placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      >
    </div>
    <div>
      <textarea 
        v-model="editContent" 
        rows="8" 
        class="w-full bg-white/10 text-white text-base placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      ></textarea>
    </div>
    <div class="flex gap-3">
      <button 
        @click="$emit('cancel')" 
        class="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
      >
        Cancelar
      </button>
      <button 
        @click="save" 
        class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Guardar
      </button>
    </div>
  </div>

  <div 
    v-else
    ref="itemRef"
    class="flex flex-col gap-3 bg-background-light dark:bg-background-dark p-4 rounded-lg hover:bg-primary/10 transition-colors group border border-white/10"
  >
    <div class="flex items-start gap-4 justify-between">
      <div class="flex items-start gap-4 flex-grow">
        <div class="text-white/60 flex items-center justify-center rounded-lg shrink-0 size-12 group-hover:text-white/90">
          <span class="material-symbols-outlined text-2xl">description</span>
        </div>
        <div class="flex flex-1 flex-col">
          <p class="text-white text-lg font-semibold leading-tight mb-1">{{ entry.title }}</p>
          <p class="text-[#92adc9] text-sm font-normal leading-normal">
            Modificado: {{ formattedDate }}
          </p>
        </div>
      </div>
      <div class="shrink-0 hidden md:flex gap-2">
        <button 
          @click="$emit('edit', entry.id)" 
          class="text-primary font-medium leading-normal text-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Editar
        </button>
        <button 
          @click="$emit('delete', entry.id)" 
          class="text-red-500 font-medium leading-normal text-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Eliminar
        </button>
      </div>
    </div>
    <div class="pl-4">
      <p class="text-white/90 text-base font-normal leading-relaxed whitespace-pre-wrap">{{ entry.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { useUtils } from '@/composables/useUtils';
import { useContextMenu } from '@/composables/useContextMenu';

const props = defineProps({
  entry: {
    type: Object,
    required: true
  },
  editing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit', 'delete', 'save', 'cancel']);

const utils = useUtils();
const contextMenu = useContextMenu();

const itemRef = ref(null);
const editTitle = ref('');
const editContent = ref('');
let cleanup = null;

const formattedDate = computed(() => utils.formatDate(props.entry.lastModified));

const save = () => {
  emit('save', props.entry.id, editTitle.value, editContent.value);
};

const handleEdit = (id) => {
  emit('edit', id);
};

const handleDelete = (id) => {
  emit('delete', id);
};

watch(() => props.editing, (isEditing) => {
  if (isEditing) {
    editTitle.value = props.entry.title;
    editContent.value = props.entry.content;
  }
}, { immediate: true });

onMounted(() => {
  if (itemRef.value && !props.editing) {
    cleanup = contextMenu.setupLongPress(itemRef.value, props.entry.id, handleEdit, handleDelete);
  }
});

onUnmounted(() => {
  if (cleanup) {
    cleanup();
  }
});
</script>


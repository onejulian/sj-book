<template>
  <div 
    ref="itemRef"
    class="flex items-center gap-4 bg-background-dark/50 p-3 rounded-xl min-h-[72px] justify-between cursor-pointer hover:bg-white/5 transition-colors duration-200 group"
  >
    <div class="flex items-center gap-4 flex-1" @click="goToPages">
      <div class="text-white flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-12">
        <span class="material-symbols-outlined text-primary text-2xl">{{ section.icon || 'folder' }}</span>
      </div>
      <div class="flex flex-col justify-center">
        <p class="text-white text-base font-medium leading-normal line-clamp-1">{{ section.name }}</p>
        <p class="text-white/60 text-sm font-normal leading-normal line-clamp-2">
          {{ totalEntries }} {{ totalEntries === 1 ? 'entrada' : 'entradas' }}
        </p>
      </div>
    </div>
    <div class="shrink-0 flex items-center gap-2">
      <p class="text-white/60 text-sm font-normal leading-normal">{{ formattedDate }}</p>
      <div class="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
        <button 
          @click.stop="$emit('edit', section.id)" 
          class="p-2 hover:bg-white/10 rounded-lg"
        >
          <span class="material-symbols-outlined text-primary text-xl">edit</span>
        </button>
        <button 
          @click.stop="$emit('delete', section.id)" 
          class="p-2 hover:bg-white/10 rounded-lg"
        >
          <span class="material-symbols-outlined text-red-500 text-xl">delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useUtils } from '@/composables/useUtils';
import { useNavigation } from '@/composables/useNavigation';
import { useContextMenu } from '@/composables/useContextMenu';

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

const utils = useUtils();
const navigation = useNavigation();
const contextMenu = useContextMenu();

const itemRef = ref(null);
let cleanup = null;

const totalEntries = computed(() => {
  if (!props.section.pages) return 0;
  return props.section.pages.reduce((total, page) => {
    return total + (page.entries ? page.entries.length : 0);
  }, 0);
});

const formattedDate = computed(() => utils.formatDate(props.section.lastModified));

const goToPages = () => {
  navigation.goToPages(props.section.id);
};

const handleEdit = (id) => {
  emit('edit', id);
};

const handleDelete = (id) => {
  emit('delete', id);
};

onMounted(() => {
  if (itemRef.value) {
    cleanup = contextMenu.setupLongPress(itemRef.value, props.section.id, handleEdit, handleDelete);
  }
});

onUnmounted(() => {
  if (cleanup) {
    cleanup();
  }
});
</script>


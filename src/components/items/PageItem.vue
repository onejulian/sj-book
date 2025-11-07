<template>
  <div 
    ref="itemRef"
    class="flex items-center gap-4 bg-transparent px-4 min-h-[72px] py-2 justify-between hover:bg-white/5 dark:hover:bg-white/5 transition-colors rounded-lg group"
  >
    <div class="flex items-center gap-4 flex-grow cursor-pointer" @click="goToEntries">
      <div class="text-white flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-12">
        <span class="material-symbols-outlined text-primary">article</span>
      </div>
      <div class="flex flex-col justify-center overflow-hidden">
        <p class="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">{{ page.name }}</p>
        <p class="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-2">
          {{ formattedDate }} • {{ entryCount }} {{ entryCount === 1 ? 'entrada' : 'entradas' }}
        </p>
      </div>
    </div>
    <div class="shrink-0 flex items-center gap-2">
      <div class="text-slate-500 dark:text-slate-500 flex size-7 items-center justify-center">
        <span class="material-symbols-outlined text-2xl">arrow_forward_ios</span>
      </div>
      <div class="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 ml-2">
        <button 
          @click.stop="$emit('edit', page.id)" 
          class="p-2 hover:bg-white/10 rounded-lg"
        >
          <span class="material-symbols-outlined text-primary text-xl">edit</span>
        </button>
        <button 
          @click.stop="$emit('delete', page.id)" 
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
  page: {
    type: Object,
    required: true
  },
  sectionId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

const utils = useUtils();
const navigation = useNavigation();
const contextMenu = useContextMenu();

const itemRef = ref(null);
let cleanup = null;

const entryCount = computed(() => props.page.entries ? props.page.entries.length : 0);
const formattedDate = computed(() => utils.formatDate(props.page.date));

const goToEntries = () => {
  navigation.goToEntries(props.sectionId, props.page.id);
};

const handleEdit = (id) => {
  emit('edit', id);
};

const handleDelete = (id) => {
  emit('delete', id);
};

onMounted(() => {
  if (itemRef.value) {
    cleanup = contextMenu.setupLongPress(itemRef.value, props.page.id, handleEdit, handleDelete);
  }
});

onUnmounted(() => {
  if (cleanup) {
    cleanup();
  }
});
</script>


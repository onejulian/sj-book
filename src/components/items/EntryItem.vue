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
    class="relative overflow-hidden rounded-lg border border-white/10"
  >
    <!-- Botones de acción ocultos (visible al deslizar en móvil) -->
    <div class="absolute right-0 top-0 bottom-0 flex items-stretch md:hidden">
      <button 
        @click.stop="handleEdit(entry.id)" 
        class="flex items-center justify-center w-20 bg-primary text-white"
      >
        <span class="material-symbols-outlined">edit</span>
      </button>
      <button 
        @click.stop="handleDelete(entry.id)" 
        class="flex items-center justify-center w-20 bg-red-500 text-white"
      >
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>

    <!-- Contenido principal (deslizable en móvil) -->
    <div 
      ref="itemRef"
      :style="{ transform: isMobile ? `translateX(${swipeOffset}px)` : 'none' }"
      class="flex flex-col gap-3 bg-background-light dark:bg-background-dark p-4 hover:bg-primary/10 transition-colors group relative touch-pan-y"
      :class="{ 'transition-transform duration-300 ease-out': !isSwiping }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
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
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { useUtils } from '@/composables/useUtils';

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

const itemRef = ref(null);
const editTitle = ref('');
const editContent = ref('');

// Estado para el swipe
const isMobile = ref(false);
const swipeOffset = ref(0);
const isSwiping = ref(false);
const startX = ref(0);
const startY = ref(0);
const currentX = ref(0);
const isHorizontalSwipe = ref(false);

const SWIPE_THRESHOLD = 10; // Umbral para determinar si es swipe horizontal o vertical
const MAX_SWIPE = -160; // Ancho total de los dos botones (80px cada uno)
const OPEN_THRESHOLD = -40; // Cuánto deslizar para que se abra
const CLOSE_THRESHOLD = -120; // Desde dónde se cierra al soltar

const formattedDate = computed(() => utils.formatDate(props.entry.lastModified));

const save = () => {
  emit('save', props.entry.id, editTitle.value, editContent.value);
};

const handleEdit = (id) => {
  closeSwipe();
  emit('edit', id);
};

const handleDelete = (id) => {
  closeSwipe();
  emit('delete', id);
};

// Funciones para el swipe
const handleTouchStart = (e) => {
  if (!isMobile.value) return;
  
  startX.value = e.touches[0].clientX;
  startY.value = e.touches[0].clientY;
  currentX.value = startX.value;
  isSwiping.value = true;
  isHorizontalSwipe.value = false;
};

const handleTouchMove = (e) => {
  if (!isMobile.value || !isSwiping.value) return;
  
  currentX.value = e.touches[0].clientX;
  const deltaX = currentX.value - startX.value;
  const deltaY = e.touches[0].clientY - startY.value;
  
  // Determinar si es un swipe horizontal o vertical
  if (!isHorizontalSwipe.value && Math.abs(deltaX) < SWIPE_THRESHOLD && Math.abs(deltaY) < SWIPE_THRESHOLD) {
    return;
  }
  
  if (!isHorizontalSwipe.value) {
    isHorizontalSwipe.value = Math.abs(deltaX) > Math.abs(deltaY);
    if (!isHorizontalSwipe.value) {
      // Es un scroll vertical, cancelar el swipe
      isSwiping.value = false;
      return;
    }
  }
  
  if (isHorizontalSwipe.value) {
    // Prevenir el scroll vertical cuando se hace swipe horizontal
    e.preventDefault();
    
    // Solo permitir deslizar a la izquierda (deltaX negativo)
    if (deltaX < 0) {
      // Limitar el swipe al máximo permitido
      swipeOffset.value = Math.max(MAX_SWIPE, deltaX);
    } else if (swipeOffset.value < 0) {
      // Permitir cerrar deslizando a la derecha
      swipeOffset.value = Math.min(0, swipeOffset.value + deltaX - startX.value);
      startX.value = currentX.value;
    }
  }
};

const handleTouchEnd = () => {
  if (!isMobile.value || !isSwiping.value) return;
  
  isSwiping.value = false;
  
  if (!isHorizontalSwipe.value) return;
  
  // Decidir si abrir o cerrar completamente
  if (swipeOffset.value < OPEN_THRESHOLD) {
    // Abrir completamente
    swipeOffset.value = MAX_SWIPE;
  } else {
    // Cerrar
    swipeOffset.value = 0;
  }
  
  isHorizontalSwipe.value = false;
};

const closeSwipe = () => {
  swipeOffset.value = 0;
};

const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 768; // md breakpoint de Tailwind
};

const handleClickOutside = (e) => {
  if (itemRef.value && !itemRef.value.contains(e.target)) {
    closeSwipe();
  }
};

watch(() => props.editing, (isEditing) => {
  if (isEditing) {
    editTitle.value = props.entry.title;
    editContent.value = props.entry.content;
    closeSwipe();
  }
}, { immediate: true });

onMounted(() => {
  checkIfMobile();
  window.addEventListener('resize', checkIfMobile);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile);
  document.removeEventListener('click', handleClickOutside);
});
</script>


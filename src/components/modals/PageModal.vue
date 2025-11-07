<template>
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-background-light dark:bg-background-dark border border-slate-300 dark:border-white/20 rounded-xl max-w-md w-full p-6 shadow-xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-slate-900 dark:text-white text-xl font-bold">
          {{ page ? 'Editar Página' : 'Nueva Página' }}
        </h3>
        <button @click="$emit('close')" class="text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="text-slate-800 dark:text-white/80 text-sm font-medium mb-2 block">Nombre de la Página</label>
          <input 
            v-model="name" 
            type="text" 
            placeholder="Ej: Notas de la reunión" 
            class="w-full bg-white dark:bg-white/10 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/50 border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
        </div>
        <div class="flex gap-3 pt-4">
          <button 
            @click="$emit('close')" 
            class="flex-1 px-4 py-2 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
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
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  page: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'save']);

const name = ref('');

watch(() => props.page, (newPage) => {
  if (newPage) {
    name.value = newPage.name;
  } else {
    name.value = '';
  }
}, { immediate: true });

const save = () => {
  const trimmedName = name.value.trim();
  if (!trimmedName) {
    alert('Por favor ingresa un nombre para la página');
    return;
  }
  
  emit('save', {
    name: trimmedName
  });
};
</script>


<template>
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-background-dark border border-white/20 rounded-xl max-w-md w-full p-6 shadow-xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white text-xl font-bold">
          {{ section ? 'Editar Sección' : 'Nueva Sección' }}
        </h3>
        <button @click="$emit('close')" class="text-white/60 hover:text-white">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="text-white/80 text-sm font-medium mb-2 block">Nombre de la Sección</label>
          <input 
            v-model="name" 
            type="text" 
            placeholder="Ej: Mis Ideas" 
            class="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
        </div>
        <div>
          <label class="text-white/80 text-sm font-medium mb-2 block">Icono</label>
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="iconName in icons"
              :key="iconName"
              @click="selectedIcon = iconName"
              :class="[
                'p-3 pb-1.5 bg-white/10 rounded-lg hover:bg-primary/20 transition-colors',
                selectedIcon === iconName ? 'bg-primary/40' : ''
              ]"
            >
              <span class="material-symbols-outlined text-white">{{ iconName }}</span>
            </button>
          </div>
        </div>
        <div class="flex gap-3 pt-4">
          <button 
            @click="$emit('close')" 
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
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  section: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'save']);

const icons = [
  'lightbulb',
  'business_center',
  'auto_stories',
  'favorite',
  'code',
  'school',
  'fitness_center',
  'palette',
  'restaurant',
  'travel_explore',
  'shopping_cart',
  'home'
];

const name = ref('');
const selectedIcon = ref('lightbulb');

watch(() => props.section, (newSection) => {
  if (newSection) {
    name.value = newSection.name;
    selectedIcon.value = newSection.icon || 'lightbulb';
  } else {
    name.value = '';
    selectedIcon.value = 'lightbulb';
  }
}, { immediate: true });

const save = () => {
  const trimmedName = name.value.trim();
  if (!trimmedName) {
    alert('Por favor ingresa un nombre para la sección');
    return;
  }
  
  emit('save', {
    name: trimmedName,
    icon: selectedIcon.value
  });
};
</script>


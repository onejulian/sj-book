<template>
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-background-dark border border-white/20 rounded-xl max-w-md w-full p-6 shadow-xl">
      <div class="flex items-center gap-3 mb-4">
        <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
        <h3 class="text-white text-xl font-bold">{{ title }}</h3>
      </div>
      <p class="text-white/80 mb-6">{{ message }}</p>
      <div class="flex gap-3">
        <button 
          @click="$emit('close')" 
          class="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          Cancelar
        </button>
        <button 
          @click="$emit('confirm')" 
          class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

defineEmits(['close', 'confirm']);
</script>


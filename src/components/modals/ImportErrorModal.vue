<template>
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-background-dark border border-white/20 rounded-xl max-w-md w-full p-6 shadow-xl">
      <div class="flex items-center gap-3 mb-4">
        <span class="material-symbols-outlined text-red-500 text-3xl">error</span>
        <h3 class="text-white text-xl font-bold">Error de Importación</h3>
      </div>
      <p class="text-white/80 mb-6">
        El archivo seleccionado no tiene el formato correcto o está corrupto. 
        Por favor, asegúrate de importar un archivo exportado previamente desde esta aplicación.
      </p>
      <button 
        @click="$emit('close')" 
        class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Entendido
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close']);
</script>


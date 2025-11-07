<template>
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-background-dark border border-white/20 rounded-xl max-w-md w-full p-6 shadow-xl">
      <div class="flex items-center gap-3 mb-4">
        <span class="material-symbols-outlined text-orange-500 text-3xl">warning</span>
        <h3 class="text-white text-xl font-bold">Confirmar Importación</h3>
      </div>
      <div class="space-y-3 mb-6">
        <p class="text-white/80">
          Estás a punto de importar datos que reemplazarán todo el contenido actual de tu cuaderno.
        </p>
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p class="text-red-400 text-sm font-medium">⚠️ Esta acción es irreversible</p>
          <p class="text-red-400/80 text-sm mt-1">
            Se eliminarán todas tus secciones, páginas y entradas actuales.
          </p>
        </div>
        <p class="text-white/60 text-sm">
          Se recomienda exportar tus datos actuales antes de continuar.
        </p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="$emit('close')" 
          class="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          Cancelar
        </button>
        <button 
          @click="$emit('confirm')" 
          class="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Importar de todas formas
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close', 'confirm']);
</script>


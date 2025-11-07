<template>
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-background-dark border border-white/20 rounded-xl max-w-md w-full p-6 shadow-xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white text-xl font-bold">Acerca de</h3>
        <button @click="$emit('close')" class="text-white/60 hover:text-white">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary text-4xl">book</span>
          <div>
            <h4 class="text-white font-medium">Cuaderno Digital</h4>
            <p class="text-white/60 text-sm">Versión 1.0</p>
          </div>
        </div>
        <p class="text-white/80 text-sm leading-relaxed">
          Tu cuaderno digital personal para organizar ideas, notas y pensamientos. 
          Crea secciones para categorizar tus contenidos, páginas para agrupar temas relacionados, 
          y entradas para capturar tus ideas.
        </p>
        <div class="border-t border-white/10 pt-4">
          <h4 class="text-white font-medium mb-2">Características</h4>
          <ul class="text-white/80 text-sm space-y-1">
            <li>✓ Organización jerárquica (Secciones → Páginas → Entradas)</li>
            <li>✓ Búsqueda rápida en todos los niveles</li>
            <li>✓ Almacenamiento local (sin necesidad de internet)</li>
            <li>✓ Interfaz moderna y oscura</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close']);
</script>


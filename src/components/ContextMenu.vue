<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div 
      v-show="contextMenu.isVisible.value" 
      @click="contextMenu.hide" 
      class="fixed inset-0 bg-black/20 z-40"
    ></div>
    
    <!-- Context Menu -->
    <div 
      v-show="contextMenu.isVisible.value"
      :style="{ left: contextMenu.menuX.value + 'px', top: contextMenu.menuY.value + 'px' }"
      class="fixed z-50 bg-background-dark border border-white/20 rounded-xl shadow-xl overflow-hidden min-w-[160px]"
    >
      <button 
        @click="contextMenu.edit" 
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
      >
        <span class="material-symbols-outlined text-primary text-xl">edit</span>
        <span class="text-white text-sm">Editar</span>
      </button>
      <button 
        @click="contextMenu.deleteItem" 
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-t border-white/10"
      >
        <span class="material-symbols-outlined text-red-500 text-xl">delete</span>
        <span class="text-white text-sm">Eliminar</span>
      </button>
    </div>
  </Teleport>
</template>

<script setup>
import { useContextMenu } from '@/composables/useContextMenu';

const contextMenu = useContextMenu();
</script>


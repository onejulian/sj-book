<template>
  <div class="font-display bg-background-dark">
    <!-- Vistas -->
    <SectionsView v-show="currentView === 'sections'" />
    <PagesView 
      v-if="currentView === 'pages' && currentSectionId" 
      v-show="currentView === 'pages'"
      :section-id="currentSectionId" 
    />
    <EntriesView 
      v-if="currentView === 'entries' && currentSectionId && currentPageId" 
      v-show="currentView === 'entries'"
      :section-id="currentSectionId"
      :page-id="currentPageId"
    />

    <!-- Context Menu Global -->
    <ContextMenu />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useNavigation } from '@/composables/useNavigation';
import { useStorage } from '@/composables/useStorage';
import { useUtils } from '@/composables/useUtils';
import SectionsView from '@/components/views/SectionsView.vue';
import PagesView from '@/components/views/PagesView.vue';
import EntriesView from '@/components/views/EntriesView.vue';
import ContextMenu from '@/components/ContextMenu.vue';

const navigation = useNavigation();
const storage = useStorage();
const utils = useUtils();

const { currentView, currentSectionId, currentPageId } = navigation;

// Inicializar datos de ejemplo si no existen
function initializeDefaultData() {
  const data = storage.getData();
  if (!data.sections || data.sections.length === 0) {
    const defaultSections = [
      {
        id: utils.generateId(),
        name: 'Diario Personal',
        icon: 'auto_stories',
        lastModified: Date.now() - 7 * 24 * 60 * 60 * 1000,
        pages: [
          {
            id: utils.generateId(),
            name: 'Mis Reflexiones',
            date: Date.now() - 2 * 24 * 60 * 60 * 1000,
            entries: [
              {
                id: utils.generateId(),
                title: 'Diario Personal',
                content: 'Hoy fue un día productivo. Logré terminar las maquetas de diseño y también tuve tiempo para leer. Me siento realizado y listo para nuevos desafíos.',
                lastModified: Date.now() - 2 * 24 * 60 * 60 * 1000
              }
            ]
          }
        ]
      },
      {
        id: utils.generateId(),
        name: 'Reuniones de Trabajo',
        icon: 'business_center',
        lastModified: Date.now() - 2 * 24 * 60 * 60 * 1000,
        pages: [
          {
            id: utils.generateId(),
            name: 'Planificación Sprint 24',
            date: Date.now() - 1 * 24 * 60 * 60 * 1000,
            entries: [
              {
                id: utils.generateId(),
                title: 'Sesión de Brainstorming',
                content: 'Ideas iniciales para la nueva función. Exploramos conceptos sobre gamificación y uso compartido en redes sociales. Necesitamos validar estas suposiciones.',
                lastModified: Date.now() - 1 * 24 * 60 * 60 * 1000
              },
              {
                id: utils.generateId(),
                title: 'Notas de la Reunión',
                content: 'Discutimos la hoja de ruta del Q3, los puntos clave incluyen centrarse en la retención de usuarios y mejorar el flujo de incorporación.',
                lastModified: Date.now()
              }
            ]
          }
        ]
      },
      {
        id: utils.generateId(),
        name: 'Ideas de Proyectos',
        icon: 'lightbulb',
        lastModified: Date.now() - 1 * 24 * 60 * 60 * 1000,
        pages: []
      }
    ];
    storage.saveSections(defaultSections);
  }
}

// Prevenir el menú contextual del navegador en móviles
const preventContextMenu = (e) => {
  if (window.innerWidth < 768) {
    e.preventDefault();
  }
};

onMounted(() => {
  // Inicializar datos de ejemplo
  initializeDefaultData();
  
  // Iniciar navegación
  navigation.init();

  // Prevenir menú contextual en móviles
  document.addEventListener('contextmenu', preventContextMenu);
});

onUnmounted(() => {
  document.removeEventListener('contextmenu', preventContextMenu);
});
</script>


import { ref, watch } from 'vue';

const currentView = ref('sections');
const currentSectionId = ref(null);
const currentPageId = ref(null);

export function useNavigation() {
  const init = () => {
    // Escuchar cambios de hash
    window.addEventListener('hashchange', handleRouteChange);
    
    // Manejar ruta inicial
    handleRouteChange();
  };

  const handleRouteChange = () => {
    const hash = window.location.hash || '#sections';
    const [route, ...params] = hash.substring(1).split('/');

    switch (route) {
      case 'sections':
        currentView.value = 'sections';
        currentSectionId.value = null;
        currentPageId.value = null;
        break;
      case 'pages':
        if (params[0]) {
          currentView.value = 'pages';
          currentSectionId.value = params[0];
          currentPageId.value = null;
        } else {
          goToSections();
        }
        break;
      case 'entries':
        if (params[0] && params[1]) {
          currentView.value = 'entries';
          currentSectionId.value = params[0];
          currentPageId.value = params[1];
        } else {
          goToSections();
        }
        break;
      default:
        goToSections();
    }
  };

  const goToSections = () => {
    window.location.hash = '#sections';
  };

  const goToPages = (sectionId) => {
    window.location.hash = `#pages/${sectionId}`;
  };

  const goToEntries = (sectionId, pageId) => {
    window.location.hash = `#entries/${sectionId}/${pageId}`;
  };

  const goBack = (from) => {
    if (from === 'pages') {
      goToSections();
    } else if (from === 'entries') {
      if (currentSectionId.value) {
        goToPages(currentSectionId.value);
      } else {
        goToSections();
      }
    }
  };

  return {
    currentView,
    currentSectionId,
    currentPageId,
    init,
    handleRouteChange,
    goToSections,
    goToPages,
    goToEntries,
    goBack,
  };
}


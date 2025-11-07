import { ref, computed } from 'vue';

const STORAGE_KEY = 'notebook_data';

// Estado reactivo global
const data = ref({ sections: [] });

// Cargar datos al inicio
const loadData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      data.value = JSON.parse(stored);
    } catch (e) {
      console.error('Error loading data:', e);
      data.value = { sections: [] };
    }
  }
};

// Guardar datos
const saveData = (newData) => {
  data.value = newData;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
};

// Inicializar al importar
loadData();

export function useStorage() {
  // Getters
  const sections = computed(() => data.value.sections || []);
  
  const getData = () => data.value;
  
  const getSections = () => data.value.sections || [];
  
  const getSection = (id) => {
    return data.value.sections.find(s => s.id === id);
  };
  
  const getPage = (sectionId, pageId) => {
    const section = getSection(sectionId);
    if (section && section.pages) {
      return section.pages.find(p => p.id === pageId);
    }
    return null;
  };
  
  // Sections
  const saveSections = (newSections) => {
    saveData({ sections: newSections });
  };
  
  const addSection = (section) => {
    const newData = { ...data.value };
    newData.sections.unshift(section);
    saveData(newData);
  };
  
  const updateSection = (id, updatedSection) => {
    const newData = { ...data.value };
    const index = newData.sections.findIndex(s => s.id === id);
    if (index !== -1) {
      newData.sections[index] = { ...newData.sections[index], ...updatedSection };
      saveData(newData);
    }
  };
  
  const deleteSection = (id) => {
    const newData = { ...data.value };
    newData.sections = newData.sections.filter(s => s.id !== id);
    saveData(newData);
  };
  
  // Pages
  const addPage = (sectionId, page) => {
    const section = getSection(sectionId);
    if (section) {
      if (!section.pages) section.pages = [];
      section.pages.unshift(page);
      updateSection(sectionId, section);
    }
  };
  
  const updatePage = (sectionId, pageId, updatedPage) => {
    const section = getSection(sectionId);
    if (section && section.pages) {
      const index = section.pages.findIndex(p => p.id === pageId);
      if (index !== -1) {
        section.pages[index] = { ...section.pages[index], ...updatedPage };
        updateSection(sectionId, section);
      }
    }
  };
  
  const deletePage = (sectionId, pageId) => {
    const section = getSection(sectionId);
    if (section && section.pages) {
      section.pages = section.pages.filter(p => p.id !== pageId);
      updateSection(sectionId, section);
    }
  };
  
  // Entries
  const addEntry = (sectionId, pageId, entry) => {
    const page = getPage(sectionId, pageId);
    if (page) {
      if (!page.entries) page.entries = [];
      page.entries.unshift(entry);
      updatePage(sectionId, pageId, page);
    }
  };
  
  const updateEntry = (sectionId, pageId, entryId, updatedEntry) => {
    const page = getPage(sectionId, pageId);
    if (page && page.entries) {
      const index = page.entries.findIndex(e => e.id === entryId);
      if (index !== -1) {
        page.entries[index] = { ...page.entries[index], ...updatedEntry };
        updatePage(sectionId, pageId, page);
      }
    }
  };
  
  const deleteEntry = (sectionId, pageId, entryId) => {
    const page = getPage(sectionId, pageId);
    if (page && page.entries) {
      page.entries = page.entries.filter(e => e.id !== entryId);
      updatePage(sectionId, pageId, page);
    }
  };
  
  return {
    // State
    sections,
    
    // Methods
    getData,
    saveData,
    getSections,
    saveSections,
    
    // Sections
    getSection,
    addSection,
    updateSection,
    deleteSection,
    
    // Pages
    getPage,
    addPage,
    updatePage,
    deletePage,
    
    // Entries
    addEntry,
    updateEntry,
    deleteEntry,
  };
}


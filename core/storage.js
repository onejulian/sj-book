// ==========================================
// GESTOR DE ALMACENAMIENTO LOCAL
// ==========================================
class StorageManager {
  static STORAGE_KEY = 'notebook_data';

  static getData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : { sections: [] };
  }

  static saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  static getSections() {
    return this.getData().sections || [];
  }

  static saveSections(sections) {
    this.saveData({ sections });
  }

  static addSection(section) {
    const data = this.getData();
    data.sections.unshift(section);
    this.saveData(data);
  }

  static updateSection(id, updatedSection) {
    const data = this.getData();
    const index = data.sections.findIndex(s => s.id === id);
    if (index !== -1) {
      data.sections[index] = { ...data.sections[index], ...updatedSection };
      this.saveData(data);
    }
  }

  static deleteSection(id) {
    const data = this.getData();
    data.sections = data.sections.filter(s => s.id !== id);
    this.saveData(data);
  }

  static getSection(id) {
    const sections = this.getSections();
    return sections.find(s => s.id === id);
  }

  static addPage(sectionId, page) {
    const section = this.getSection(sectionId);
    if (section) {
      if (!section.pages) section.pages = [];
      section.pages.unshift(page);
      this.updateSection(sectionId, section);
    }
  }

  static updatePage(sectionId, pageId, updatedPage) {
    const section = this.getSection(sectionId);
    if (section && section.pages) {
      const index = section.pages.findIndex(p => p.id === pageId);
      if (index !== -1) {
        section.pages[index] = { ...section.pages[index], ...updatedPage };
        this.updateSection(sectionId, section);
      }
    }
  }

  static deletePage(sectionId, pageId) {
    const section = this.getSection(sectionId);
    if (section && section.pages) {
      section.pages = section.pages.filter(p => p.id !== pageId);
      this.updateSection(sectionId, section);
    }
  }

  static getPage(sectionId, pageId) {
    const section = this.getSection(sectionId);
    if (section && section.pages) {
      return section.pages.find(p => p.id === pageId);
    }
    return null;
  }

  static addEntry(sectionId, pageId, entry) {
    const page = this.getPage(sectionId, pageId);
    if (page) {
      if (!page.entries) page.entries = [];
      page.entries.unshift(entry);
      this.updatePage(sectionId, pageId, page);
    }
  }

  static updateEntry(sectionId, pageId, entryId, updatedEntry) {
    const page = this.getPage(sectionId, pageId);
    if (page && page.entries) {
      const index = page.entries.findIndex(e => e.id === entryId);
      if (index !== -1) {
        page.entries[index] = { ...page.entries[index], ...updatedEntry };
        this.updatePage(sectionId, pageId, page);
      }
    }
  }

  static deleteEntry(sectionId, pageId, entryId) {
    const page = this.getPage(sectionId, pageId);
    if (page && page.entries) {
      page.entries = page.entries.filter(e => e.id !== entryId);
      this.updatePage(sectionId, pageId, page);
    }
  }
}


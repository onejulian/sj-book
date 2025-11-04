// ==========================================
// GESTOR DE NAVEGACIÓN SPA
// ==========================================
class NavigationManager {
  static init() {
    // Escuchar cambios de hash
    window.addEventListener('hashchange', () => this.handleRouteChange());
    
    // Manejar ruta inicial
    this.handleRouteChange();
  }

  static handleRouteChange() {
    const hash = window.location.hash || '#sections';
    const [route, ...params] = hash.substring(1).split('/');

    // Ocultar todas las vistas
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });

    // Mostrar vista correspondiente
    switch (route) {
      case 'sections':
        this.showSectionsView();
        break;
      case 'pages':
        if (params[0]) {
          this.showPagesView(params[0]);
        } else {
          this.goToSections();
        }
        break;
      case 'entries':
        if (params[0] && params[1]) {
          this.showEntriesView(params[0], params[1]);
        } else {
          this.goToSections();
        }
        break;
      default:
        this.goToSections();
    }
  }

  static showSectionsView() {
    document.getElementById('sectionsView').classList.add('active');
    if (window.SectionsView) {
      window.SectionsView.render();
    }
  }

  static showPagesView(sectionId) {
    const section = StorageManager.getSection(sectionId);
    if (!section) {
      this.goToSections();
      return;
    }
    document.getElementById('pagesView').classList.add('active');
    if (window.PagesView) {
      window.PagesView.init(sectionId);
    }
  }

  static showEntriesView(sectionId, pageId) {
    const section = StorageManager.getSection(sectionId);
    const page = StorageManager.getPage(sectionId, pageId);
    if (!section || !page) {
      this.goToSections();
      return;
    }
    document.getElementById('entriesView').classList.add('active');
    if (window.EntriesView) {
      window.EntriesView.init(sectionId, pageId);
    }
  }

  static goToSections() {
    window.location.hash = '#sections';
  }

  static goToPages(sectionId) {
    window.location.hash = `#pages/${sectionId}`;
  }

  static goToEntries(sectionId, pageId) {
    window.location.hash = `#entries/${sectionId}/${pageId}`;
  }

  static goBack(from) {
    if (from === 'pages') {
      this.goToSections();
    } else if (from === 'entries') {
      if (window.PagesView && window.PagesView.currentSectionId) {
        this.goToPages(window.PagesView.currentSectionId);
      } else {
        this.goToSections();
      }
    }
  }
}


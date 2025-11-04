// ==========================================
// GESTOR DE MENÚ CONTEXTUAL (LONG PRESS)
// ==========================================
class ContextMenu {
  static longPressTimer = null;
  static longPressDuration = 500; // 500ms para activar
  static currentItemId = null;
  static currentAction = null;

  static init() {
    // Crear backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'contextMenuBackdrop';
    backdrop.className = 'hidden fixed inset-0 bg-black/20 z-40';
    backdrop.addEventListener('click', () => this.hide());
    document.body.appendChild(backdrop);

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('contextMenu');
      if (!menu.contains(e.target)) {
        this.hide();
      }
    });

    // Prevenir el menú contextual del navegador en móviles
    document.addEventListener('contextmenu', (e) => {
      if (window.innerWidth < 768) { // Solo en móviles
        e.preventDefault();
      }
    });
  }

  static setupLongPress(element, itemId, onEdit, onDelete) {
    let touchStartX = 0;
    let touchStartY = 0;
    let hasMoved = false;

    // Touch events
    element.addEventListener('touchstart', (e) => {
      hasMoved = false;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      
      this.longPressTimer = setTimeout(() => {
        if (!hasMoved) {
          this.show(e.touches[0].clientX, e.touches[0].clientY, itemId, onEdit, onDelete);
          // Vibración háptica si está disponible
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }
      }, this.longPressDuration);
    });

    element.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);
      
      // Si se mueve más de 10px, cancelar long press
      if (deltaX > 10 || deltaY > 10) {
        hasMoved = true;
        this.cancelLongPress();
      }
    });

    element.addEventListener('touchend', () => {
      this.cancelLongPress();
    });

    element.addEventListener('touchcancel', () => {
      this.cancelLongPress();
    });
  }

  static show(x, y, itemId, onEdit, onDelete) {
    const menu = document.getElementById('contextMenu');
    const backdrop = document.getElementById('contextMenuBackdrop');
    const editBtn = document.getElementById('contextEditBtn');
    const deleteBtn = document.getElementById('contextDeleteBtn');

    // Guardar el ID del item y las acciones
    this.currentItemId = itemId;

    // Limpiar event listeners anteriores
    const newEditBtn = editBtn.cloneNode(true);
    const newDeleteBtn = deleteBtn.cloneNode(true);
    editBtn.replaceWith(newEditBtn);
    deleteBtn.replaceWith(newDeleteBtn);

    // Agregar nuevos event listeners
    document.getElementById('contextEditBtn').addEventListener('click', () => {
      onEdit(itemId);
      this.hide();
    });

    document.getElementById('contextDeleteBtn').addEventListener('click', () => {
      onDelete(itemId);
      this.hide();
    });

    // Mostrar backdrop
    backdrop.classList.remove('hidden');

    // Posicionar el menú
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    // Ajustar posición si se sale de la pantalla
    menu.classList.remove('hidden');
    
    const rect = menu.getBoundingClientRect();
    
    // Ajustar horizontalmente
    if (rect.right > window.innerWidth) {
      menu.style.left = `${window.innerWidth - rect.width - 10}px`;
    }
    
    // Ajustar verticalmente
    if (rect.bottom > window.innerHeight) {
      menu.style.top = `${y - rect.height}px`;
    }
  }

  static hide() {
    const menu = document.getElementById('contextMenu');
    const backdrop = document.getElementById('contextMenuBackdrop');
    menu.classList.add('hidden');
    backdrop.classList.add('hidden');
    this.currentItemId = null;
  }

  static cancelLongPress() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
  ContextMenu.init();
});


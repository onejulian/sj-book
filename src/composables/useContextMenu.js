import { ref } from 'vue';

const isVisible = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const currentItemId = ref(null);
const currentEditCallback = ref(null);
const currentDeleteCallback = ref(null);

export function useContextMenu() {
  let longPressTimer = null;
  const longPressDuration = 500; // 500ms para activar

  const show = (x, y, itemId, onEdit, onDelete) => {
    currentItemId.value = itemId;
    currentEditCallback.value = onEdit;
    currentDeleteCallback.value = onDelete;
    menuX.value = x;
    menuY.value = y;
    isVisible.value = true;

    // Vibración háptica si está disponible
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const hide = () => {
    isVisible.value = false;
    currentItemId.value = null;
    currentEditCallback.value = null;
    currentDeleteCallback.value = null;
  };

  const edit = () => {
    if (currentEditCallback.value && currentItemId.value) {
      currentEditCallback.value(currentItemId.value);
      hide();
    }
  };

  const deleteItem = () => {
    if (currentDeleteCallback.value && currentItemId.value) {
      currentDeleteCallback.value(currentItemId.value);
      hide();
    }
  };

  const setupLongPress = (element, itemId, onEdit, onDelete) => {
    if (!element) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let hasMoved = false;

    const handleTouchStart = (e) => {
      hasMoved = false;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      
      longPressTimer = setTimeout(() => {
        if (!hasMoved) {
          show(e.touches[0].clientX, e.touches[0].clientY, itemId, onEdit, onDelete);
        }
      }, longPressDuration);
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);
      
      // Si se mueve más de 10px, cancelar long press
      if (deltaX > 10 || deltaY > 10) {
        hasMoved = true;
        cancelLongPress();
      }
    };

    const handleTouchEnd = () => {
      cancelLongPress();
    };

    const cancelLongPress = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd);

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
      cancelLongPress();
    };
  };

  return {
    isVisible,
    menuX,
    menuY,
    show,
    hide,
    edit,
    deleteItem,
    setupLongPress,
  };
}


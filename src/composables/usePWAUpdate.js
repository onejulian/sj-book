import { ref, onMounted, onUnmounted } from 'vue';

let updateAvailable = ref(false);
let registration = null;
let waitingWorker = null;

export function usePWAUpdate() {
  const init = () => {
    if ('serviceWorker' in navigator) {
      console.log('[PWA Update] Sistema de actualizaciones inicializado');
      
      // Detectar cuando hay un nuevo service worker esperando
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA Update] Nuevo Service Worker tomó control, recargando...');
        // Recargar la página cuando el nuevo SW tome el control
        window.location.reload();
      });

      // Escuchar mensajes del service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          console.log('[PWA Update] Actualización disponible notificada por el SW');
          updateAvailable.value = true;
        }
      });

      // Verificar si ya hay un service worker registrado
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) {
          console.log('[PWA Update] No hay Service Worker registrado');
          return;
        }
        
        console.log('[PWA Update] Service Worker encontrado');
        registration = reg;
        
        // Verificar si hay un SW esperando
        if (reg.waiting) {
          console.log('[PWA Update] Hay un Service Worker esperando');
          waitingWorker = reg.waiting;
          updateAvailable.value = true;
        }

        // Verificar si hay un SW instalando
        if (reg.installing) {
          console.log('[PWA Update] Service Worker instalándose...');
          trackInstalling(reg.installing);
        }

        // Escuchar cambios en el registro
        reg.addEventListener('updatefound', () => {
          console.log('[PWA Update] Nueva actualización encontrada');
          trackInstalling(reg.installing);
        });
      });

      // Verificar actualizaciones periódicamente (cada 60 segundos)
      setInterval(() => {
        checkForUpdates();
      }, 60000);
    } else {
      console.log('[PWA Update] Service Worker no soportado en este navegador');
    }
  };

  const trackInstalling = (worker) => {
    worker.addEventListener('statechange', () => {
      console.log('[PWA Update] Estado del Service Worker:', worker.state);
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        // Hay un nuevo service worker disponible
        console.log('[PWA Update] Nueva actualización lista para instalar');
        waitingWorker = worker;
        updateAvailable.value = true;
      }
    });
  };

  const checkForUpdates = () => {
    if (registration) {
      console.log('[PWA Update] Verificando actualizaciones...');
      registration.update();
    }
  };

  const applyUpdate = () => {
    console.log('[PWA Update] Aplicando actualización...');
    
    if (!waitingWorker) {
      console.log('[PWA Update] No hay worker esperando, buscando...');
      // Si no hay un worker esperando, intentar buscar uno
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          console.log('[PWA Update] Worker esperando encontrado');
          waitingWorker = reg.waiting;
          // Enviar mensaje al SW para que tome el control
          waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        } else {
          // Forzar recarga si no hay worker esperando
          console.log('[PWA Update] Forzando recarga manual');
          window.location.reload();
        }
      });
      return;
    }

    // Enviar mensaje al SW para que tome el control
    console.log('[PWA Update] Enviando mensaje SKIP_WAITING al Service Worker');
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  };

  return {
    updateAvailable,
    init,
    applyUpdate,
    checkForUpdates
  };
}


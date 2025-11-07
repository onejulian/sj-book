import { ref, onMounted } from 'vue';

export function usePWAInstaller() {
  const deferredPrompt = ref(null);
  const canInstall = ref(false);
  const isInstalled = ref(false);

  // Verificar si ya está instalado
  const checkIfInstalled = () => {
    // Verificar si está en modo standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }
    
    // Verificar en iOS
    if (window.navigator.standalone === true) {
      return true;
    }
    
    return false;
  };

  // Inicializar
  const init = () => {
    isInstalled.value = checkIfInstalled();

    if (isInstalled.value) {
      console.log('La app ya está instalada');
      return;
    }

    // Detectar si la app puede ser instalada
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevenir que el navegador muestre su propio prompt
      e.preventDefault();
      
      // Guardar el evento para usarlo más tarde
      deferredPrompt.value = e;
      canInstall.value = true;
    });

    // Detectar si la app ya está instalada
    window.addEventListener('appinstalled', () => {
      console.log('PWA instalada exitosamente');
      deferredPrompt.value = null;
      canInstall.value = false;
      isInstalled.value = true;
    });
  };

  // Instalar la app
  const install = async () => {
    if (!deferredPrompt.value) {
      return;
    }
    
    // Mostrar el prompt de instalación
    deferredPrompt.value.prompt();
    
    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.value.userChoice;
    
    console.log(`Usuario respondió a la instalación: ${outcome}`);
    
    // Limpiar el prompt
    deferredPrompt.value = null;
    canInstall.value = false;
  };

  return {
    canInstall,
    isInstalled,
    init,
    install,
  };
}


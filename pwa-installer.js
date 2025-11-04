// Gestor de instalación de PWA
let deferredPrompt = null;
let installMenuItem = null;

// Detectar si la app puede ser instalada
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir que el navegador muestre su propio prompt
  e.preventDefault();
  
  // Guardar el evento para usarlo más tarde
  deferredPrompt = e;
  
  // Mostrar la opción de instalar en el menú
  showInstallOption();
});

// Detectar si la app ya está instalada
window.addEventListener('appinstalled', () => {
  console.log('PWA instalada exitosamente');
  deferredPrompt = null;
  hideInstallOption();
});

// Mostrar opción de instalar en el menú
function showInstallOption() {
  const menuDropdown = document.getElementById('menuDropdown');
  if (!menuDropdown || installMenuItem) return;
  
  // Crear el elemento del menú
  installMenuItem = document.createElement('button');
  installMenuItem.id = 'installAppBtn';
  installMenuItem.className = 'w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left';
  installMenuItem.innerHTML = `
    <span class="material-symbols-outlined text-primary text-xl">install_mobile</span>
    <span class="text-white text-sm">Instalar App</span>
  `;
  
  // Insertar antes del separador (antes de "Acerca de")
  const separator = menuDropdown.querySelector('.border-t');
  if (separator) {
    menuDropdown.insertBefore(installMenuItem, separator);
  } else {
    menuDropdown.appendChild(installMenuItem);
  }
  
  // Agregar evento de clic
  installMenuItem.addEventListener('click', installApp);
}

// Ocultar opción de instalar
function hideInstallOption() {
  if (installMenuItem) {
    installMenuItem.remove();
    installMenuItem = null;
  }
}

// Instalar la app
async function installApp() {
  if (!deferredPrompt) {
    return;
  }
  
  // Cerrar el menú dropdown
  if (typeof closeMenuDropdown === 'function') {
    closeMenuDropdown();
  }
  
  // Mostrar el prompt de instalación
  deferredPrompt.prompt();
  
  // Esperar la respuesta del usuario
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`Usuario respondió a la instalación: ${outcome}`);
  
  // Limpiar el prompt
  deferredPrompt = null;
  
  // Ocultar la opción del menú
  hideInstallOption();
}

// Verificar si ya está instalado
function isAppInstalled() {
  // Verificar si está en modo standalone
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // Verificar en iOS
  if (window.navigator.standalone === true) {
    return true;
  }
  
  return false;
}

// Si ya está instalada, no mostrar la opción
if (isAppInstalled()) {
  console.log('La app ya está instalada');
}


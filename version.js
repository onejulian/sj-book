// Esta variable estará disponible globalmente en el Service Worker
const APP_VERSION = '3.1.2';

// Para usar en módulos ES6 regulares (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VERSION: APP_VERSION };
}

// Para Service Workers con importScripts
if (typeof self !== 'undefined' && self.importScripts) {
  self.APP_VERSION = APP_VERSION;
}

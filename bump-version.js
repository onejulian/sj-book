#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VERSION_FILE = path.join(__dirname, 'version.js');

/**
 * Incrementa una versión semántica en 0.0.1
 * Maneja casos especiales como 3.9.9 -> 4.0.0
 * @param {string} version - Versión actual (ej: "3.0.4")
 * @returns {string} Nueva versión incrementada
 */
function incrementVersion(version) {
  const parts = version.split('.').map(Number);
  
  if (parts.length !== 3) {
    throw new Error(`Formato de versión inválido: ${version}`);
  }

  let [major, minor, patch] = parts;

  // Incrementar patch
  patch += 1;

  // Si patch llega a 10, reiniciar a 0 e incrementar minor
  if (patch >= 10) {
    patch = 0;
    minor += 1;
  }

  // Si minor llega a 10, reiniciar a 0 e incrementar major
  if (minor >= 10) {
    minor = 0;
    major += 1;
  }

  return `${major}.${minor}.${patch}`;
}

/**
 * Lee la versión actual desde version.js
 * @returns {string} Versión actual
 */
function getCurrentVersion() {
  try {
    const content = fs.readFileSync(VERSION_FILE, 'utf8');
    const match = content.match(/const APP_VERSION = ['"]([^'"]+)['"]/);
    
    if (!match) {
      throw new Error('No se pudo encontrar la versión en version.js');
    }
    
    return match[1];
  } catch (error) {
    console.error('Error al leer version.js:', error.message);
    process.exit(1);
  }
}

/**
 * Escribe la nueva versión en version.js
 * @param {string} newVersion - Nueva versión a escribir
 */
function writeNewVersion(newVersion) {
  try {
    const content = `// Esta variable estará disponible globalmente en el Service Worker
const APP_VERSION = '${newVersion}';

if (typeof window !== 'undefined') {
  window.APP_VERSION = APP_VERSION;
}

// Para usar en módulos ES6 regulares (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VERSION: APP_VERSION };
}

// Para Service Workers con importScripts
if (typeof self !== 'undefined' && self.importScripts) {
  self.APP_VERSION = APP_VERSION;
}
`;
    fs.writeFileSync(VERSION_FILE, content, 'utf8');
    console.log(`✓ Versión actualizada: ${newVersion}`);
  } catch (error) {
    console.error('Error al escribir version.js:', error.message);
    process.exit(1);
  }
}

/**
 * Función principal
 */
function main() {
  console.log('🔄 Incrementando versión...\n');
  
  const currentVersion = getCurrentVersion();
  console.log(`Versión actual: ${currentVersion}`);
  
  const newVersion = incrementVersion(currentVersion);
  console.log(`Nueva versión: ${newVersion}`);
  
  writeNewVersion(newVersion);
  
  console.log('\n✨ ¡Versión incrementada exitosamente!');
}

// Ejecutar script
main();


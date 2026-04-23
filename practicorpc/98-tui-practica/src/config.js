import {exerciseCategories, exercises} from './exercises.js';
import {installActions} from './dependencies.js';
import {PROJECT_ROOT, parseOsRelease} from './utils.js';

export const appInfo = {
  title: 'Práctico RPC — TUI',
  subtitle: 'Ubuntu/Debian · verificar dependencias · instalar entorno · ejecutar incisos prácticos',
  projectRoot: PROJECT_ROOT
};

export const mainMenuItems = [
  {
    id: 'dependencies',
    label: 'Verificar dependencias',
    description: 'Revisa sistema, .venv, npm y stubs generados.'
  },
  {
    id: 'install',
    label: 'Instalar / preparar entorno',
    description: 'Apt, rpcbind, .venv, npm y stubs gRPC.'
  },
  {
    id: 'exercises',
    label: 'Ejecutar incisos prácticos',
    description: 'Corre la parte práctica local y deja asistido lo multi-host.'
  },
  {
    id: 'about',
    label: 'Resumen / ayuda',
    description: 'Muestra alcance, supuestos y limitaciones conocidas.'
  },
  {
    id: 'exit',
    label: 'Salir',
    description: 'Cierra la TUI.'
  }
];

export {exerciseCategories, exercises, installActions};

export function getAboutText() {
  const os = parseOsRelease();
  return [
    `Sistema detectado: ${os.prettyName}`,
    'Soporte oficial de la TUI: Ubuntu / Debian.',
    '',
    'Qué hace bien:',
    '- verifica dependencias del sistema y del proyecto',
    '- instala/prepara el entorno usando apt, npm y .venv',
    '- ejecuta sockets, JSON, Protobuf, Sun RPC, Java RMI, gRPC y RPyC',
    '',
    'Qué queda asistido y no 100% automatizado:',
    '- inciso 9 con NFS: la TUI instala paquetes, pero la configuración real de exports/NFS sigue dependiendo del host',
    '- Java RMI en dos computadoras: la TUI puede correr el cliente remoto y levantar el server listo para otra máquina, pero la red/firewall siguen siendo del entorno'
  ].join('\n');
}

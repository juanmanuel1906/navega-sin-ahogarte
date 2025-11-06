// 1. Define tus entornos
const urls = [
  {
    origin: 'https://navegasinahogarte.com',
    apiUrl: 'https://navegasinahogarte.com/api', // Para HttpClient
    socketUrl: 'https://navegasinahogarte.com' // Para ngx-socket-io
  },
  {
    origin: 'http://localhost:4200',
    apiUrl: 'http://localhost:3000/api', // Para HttpClient
    socketUrl: 'http://localhost:3000' // Para ngx-socket-io
  },
];

// 2. Lógica para detectar el entorno (se ejecuta al cargar el script)
const defaultEnv = urls[1]; // Default a localhost
const currentOrigin = window.location.origin;
const matchedEnv = urls.find((u) => u.origin === currentOrigin);

const environment = matchedEnv || defaultEnv;

// 3. Exporta las constantes que tu app usará
export const BASE_URL = environment.apiUrl;
export const SOCKET_URL = environment.socketUrl;
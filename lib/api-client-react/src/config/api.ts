export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:3000' : '');

export const WS_BASE_URL = import.meta.env.VITE_WS_URL ||
    (import.meta.env.DEV ? 'ws://localhost:3000' :
        `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`);
/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Your custom env variables only
    readonly VITE_API_BASE_URL: string;
    readonly VITE_WS_URL: string;
    readonly VITE_BASE_PATH: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
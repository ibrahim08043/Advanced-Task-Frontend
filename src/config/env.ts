export const ENV = {
    API_BASE_URL:
        import.meta.env.VITE_API_BASE_URL ||
        "https://advanced-task-backend.onrender.com",

    WS_BASE_URL:
        import.meta.env.VITE_WS_URL ||
        "wss://advanced-task-backend.onrender.com",
};
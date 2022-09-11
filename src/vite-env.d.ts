interface ImportMetaEnv {
  readonly VITE_AUTH_DOMAIN
  readonly VITE_AUTH_API_KEY
  readonly VITE_BACKEND_SERVICE_URL
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

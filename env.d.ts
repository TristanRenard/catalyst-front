/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_URL: string
  readonly API_SECURE: boolean
  readonly API_WS: boolean
  readonly API_CHANGE_ORIGIN: boolean
  readonly WS_URL: string
  readonly WS_SECURE: boolean
  readonly WS_WS: boolean
  readonly WS_CHANGE_ORIGIN: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_URL?: string
    readonly API_SECURE?: boolean
    readonly API_WS?: boolean
    readonly API_CHANGE_ORIGIN?: boolean
    readonly WS_URL?: string
    readonly WS_SECURE?: boolean
    readonly WS_WS?: boolean
    readonly WS_CHANGE_ORIGIN?: boolean
  }
}

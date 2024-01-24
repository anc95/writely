import { Browser } from 'webextension-polyfill'

declare global {
  var browser: Browser
}

// env.d.ts
declare namespace NodeJS {
  export interface ProcessEnv {
    IS_ELECTRON: string
  }
}

declare module '*.png'

declare var MAIN_WINDOW_WEBPACK_ENTRY: string
declare var MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

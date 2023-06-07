import { Browser } from 'webextension-polyfill'

declare global {
  var browser: Browser
}

declare module '*.png'

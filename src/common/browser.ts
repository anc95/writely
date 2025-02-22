import { EventName } from './event-name'

import browser from 'webextension-polyfill'

export const openOptionPage = () => {
  browser.runtime.sendMessage({
    type: EventName.openOptionsPage,
  })
}

export const stopOpenAICHat = () => {
  browser.runtime.sendMessage({
    type: EventName.stopOpenAIChat,
  })
}

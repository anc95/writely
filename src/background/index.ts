import { EventName } from '@/common/event-name'
import { getSetting } from '@/common/store/settings'
import type { MessagePayload } from '@/common/types'
import browser from 'webextension-polyfill'
import './chatgpt-web'

browser.runtime.onMessage.addListener(
  (message: MessagePayload<EventName.openOptionsPage>) => {
    if (message.type === 'open-options-page') {
      browser.runtime.openOptionsPage()
    }
  }
)

browser.runtime.onMessage.addListener(
  (message: MessagePayload<EventName.getToken>, sender, sendResponse) => {
    if (message.type === EventName.getToken) {
      getToken().then((v) => (sendResponse as any)(v))
      return true
    }
  }
)

browser.contextMenus.create({
  title: 'Launch writely',
  id: 'writely',
  // contexts: ['selection'],
})

browser.contextMenus.create({
  title: 'Writely instructions',
  id: 'writely-instructions',
  // contexts: ['selection'],
})

const createSubMenu = async () => {
  const settings = await getSetting()

  settings.customInstructions?.map((instruction) => {
    browser.contextMenus.create({
      title: instruction.name,
      id: instruction.id,
      contexts: ['selection'],
      parentId: 'writely-instructions',
    })
  })
}

createSubMenu()

browser.contextMenus.onClicked.addListener((info, tab) => {
  console.error('hi')
  if (info.menuItemId === 'writely' && tab.id) {
    browser.tabs.sendMessage(tab.id, {
      type: EventName.launchWritely,
    })
  }

  if (info.parentMenuItemId === 'writely-instructions') {
    browser.tabs.sendMessage(tab.id, {
      type: EventName.launchWritelyResultPanel,
      data: {
        instruction: info.menuItemId,
      },
    })
  }
})

const getToken = async () => {
  try {
    return JSON.parse(
      decodeURIComponent(
        (
          await browser.cookies.get({
            name: 'supabase-auth-token',
            url: 'https://writely.miao-ya.com',
          })
        ).value || ''
      )
    )[0]
  } catch {
    return ''
  }
}

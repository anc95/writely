import { EventName, launch_writely } from '@/common/event-name';
import type { MessagePayload } from '@/common/types';

chrome.runtime.onMessage.addListener(
  async (message: MessagePayload<EventName.openOptionsPage>) => {
    if (message.type === 'open-options-page') {
      chrome.runtime.openOptionsPage();
    }
  }
);

chrome.contextMenus.create({
  title: 'Writely',
  id: 'writely',
  contexts: ['selection'],
  // onclick: (info) => {
  //   chrome.runtime.sendMessage(launch_writely);
  // },
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'writely' && tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: EventName.launchWritely,
    });
  }
});

import { EventName, launch_writely } from '@/common/event-name';
import { getSetting } from '@/common/store/settings';
import type { MessagePayload } from '@/common/types';

chrome.runtime.onMessage.addListener(
  async (message: MessagePayload<EventName.openOptionsPage>) => {
    if (message.type === 'open-options-page') {
      chrome.runtime.openOptionsPage();
    }
  }
);

chrome.contextMenus.create({
  title: 'Launch writely',
  id: 'writely',
  contexts: ['selection'],
});

chrome.contextMenus.create({
  title: 'Writely instructions',
  id: 'writely-instructions',
  contexts: ['selection'],
});

const createSubMenu = async () => {
  const settings = await getSetting();

  settings.customInstructions?.map((instruction) => {
    chrome.contextMenus.create({
      title: instruction,
      id: instruction,
      contexts: ['selection'],
      parentId: 'writely-instructions',
    });
  });
};

createSubMenu();

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'writely' && tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: EventName.launchWritely,
    });
  }

  if (info.parentMenuItemId === 'writely-instructions') {
    chrome.tabs.sendMessage(tab.id, {
      type: EventName.launchWritelyResultPanel,
      data: {
        instruction: info.menuItemId,
      },
    });
  }
});

import type { MessagePayload } from "@/common/types"

chrome.runtime.onMessage.addListener(async (message: MessagePayload) => {
  if (message.type === 'open-options-page') {
    chrome.runtime.openOptionsPage()
  }
})

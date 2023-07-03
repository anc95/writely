import { EventName, PortName } from '@/common/event-name'
import browser from 'webextension-polyfill'
import { v4 as uuidv4 } from '../../node_modules/uuid/dist/esm-browser/index'
import { MessagePayload } from '@/common/types'

let chatgptwebPort = null

browser.runtime.onConnect.addListener((port) => {
  if (port.name !== PortName.chatgptWeb) {
    return
  }

  chatgptwebPort = port

  port.onMessage.addListener((msg) => {
    if (msg.type === EventName.chat) {
      sendMessageOnChatGPTWeb(msg.data)
    }
  })
})

browser.runtime.onMessage.addListener(
  (message: MessagePayload<EventName.getChatGPTToken>, _, sendResponse) => {
    if (message.type === EventName.getChatGPTToken) {
      getAccessToken().then(sendResponse)

      return true
    }
  }
)

const sendMessageOnChatGPTWeb = async (prompt: string) => {
  const token = await getAccessToken()

  const res = await fetch('https://chat.openai.com/backend-api/conversation', {
    method: 'POST',
    body: JSON.stringify({
      action: 'next',
      messages: [
        {
          id: uuidv4(),
          author: { role: 'user' },
          content: { content_type: 'text', parts: [prompt] },
          metadata: {},
        },
      ],
      model: 'text-davinci-002-render-sha',
      parent_message_id: uuidv4(),
    }),
    headers: {
      Accept: 'text/event-stream',
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
  })

  const reader = res.body.getReader()
  return new ReadableStream({
    start(controller) {
      return pump()
      function pump() {
        return reader.read().then(({ done, value }) => {
          console.log(new TextDecoder().decode(value))
          chatgptwebPort?.postMessage({
            type: EventName.chatgptResponse,
            data: new TextDecoder().decode(value),
          })

          if (done) {
            controller.close()
            return
          }

          controller.enqueue(value)
          return pump()
        })
      }
    },
  })
}

const getAccessToken = async () => {
  try {
    const res = (await (
      await fetch('https://chat.openai.com/api/auth/session')
    ).json()) as { accessToken: string }
    return res.accessToken
  } catch {
    return ''
  }
}

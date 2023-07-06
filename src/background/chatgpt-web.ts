import { EventName, PortName } from '@/common/event-name'
import browser from 'webextension-polyfill'
import { v4 as uuidv4 } from '../../node_modules/uuid/dist/esm-browser/index'
import { MessagePayload } from '@/common/types'

browser.runtime.onConnect.addListener((port) => {
  if (port.name !== PortName.chatgptWeb) {
    return
  }

  port.onMessage.addListener((msg) => {
    if (msg.type === EventName.chat) {
      sendMessageOnChatGPTWeb(msg.data, port)
    } else if (msg.type === EventName.stopChatGPTChat) {
      abortController.abort()
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

let conversation_id = undefined
let parent_message_id = uuidv4()
let abortController = new AbortController()

const sendMessageOnChatGPTWeb = async (prompt: string, port) => {
  const token = await getAccessToken()
  const msgUUID = uuidv4()
  abortController.abort()
  abortController = new AbortController()

  const res = await fetch('https://chat.openai.com/backend-api/conversation', {
    method: 'POST',
    body: JSON.stringify({
      action: 'next',
      messages: [
        {
          id: msgUUID,
          author: { role: 'user' },
          content: { content_type: 'text', parts: [prompt] },
          metadata: {},
        },
      ],
      model: 'text-davinci-002-render-sha',
      parent_message_id: parent_message_id,
      conversation_id: conversation_id,
    }),
    headers: {
      Accept: 'text/event-stream',
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    signal: abortController.signal,
  })

  parent_message_id = msgUUID

  const reader = res.body.getReader()
  return new ReadableStream({
    start(controller) {
      return pump()
      function pump() {
        return reader.read().then(({ done, value }) => {
          const strValue = new TextDecoder().decode(value)
          const cId = /"conversation_id":\s+"([^"]+)+/.exec(strValue)?.[1]

          if (cId) {
            conversation_id = cId
          }

          console.log('发送消息', port)

          port?.postMessage({
            type: EventName.chatgptResponse,
            data: strValue,
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

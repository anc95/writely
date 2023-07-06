import Browser from 'webextension-polyfill'
import { EventName, PortName } from '../event-name'
import { MessagePayload } from '../types'
import { parseStream } from '../parse-stream'
import useSWR from 'swr'

class ChatGPTWeb {
  port = Browser.runtime.connect({ name: PortName.chatgptWeb })
  dataCallback: (text: string, error?: Error, ended?: boolean) => void
  accessToken: string

  constructor() {
    this.port.onMessage.addListener(
      (message: MessagePayload<EventName.chatgptResponse>) => {
        if (message.type === EventName.chatgptResponse) {
          const { data, ended } = parseStream(message.data)
          this.dataCallback(data, undefined, ended)
        }
      }
    )

    this.initToken()
  }

  public sendMsg = (prompt: string, onData: any) => {
    this.dataCallback = onData
    this.port?.postMessage({
      type: EventName.chat,
      data: prompt,
    })
  }

  public abort = () => {
    this.port.postMessage({
      type: EventName.stopChatGPTChat,
    })
  }

  private initToken = async () => {
    this.accessToken = await Browser.runtime.sendMessage({
      type: EventName.getChatGPTToken,
    })
  }
}

export const chatgptWeb = new ChatGPTWeb()

export const useChatGPTWebInfo = () => {
  return useSWR(['chatgpt-web-info'], async () => {
    return (await (
      await fetch('https://chat.openai.com/api/auth/session')
    ).json()) as { accessToken: string; user: { email: string; name: string } }
  })
}

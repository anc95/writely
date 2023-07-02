import Browser from 'webextension-polyfill'
import { EventName, PortName } from '../event-name'
import { MessagePayload } from '../types'
import { parseStream } from '../parse-stream'

class ChatGPTWeb {
  port = Browser.runtime.connect({ name: PortName.chatgptWeb })
  dataCallback: (text: string, error?: Error, ended?: boolean) => void

  constructor() {
    this.port.onMessage.addListener(
      (message: MessagePayload<EventName.chatgptResponse>) => {
        if (message.type === EventName.chatgptResponse) {
          const { data, ended } = parseStream(message.data)
          console.log(data)
          this.dataCallback(data, undefined, ended)
        }
      }
    )
  }

  public sendMsg = (prompt: string, onData: any) => {
    this.dataCallback = onData
    this.port?.postMessage({
      type: EventName.chat,
      data: prompt,
    })
  }
}

export const chatgptWeb = new ChatGPTWeb()

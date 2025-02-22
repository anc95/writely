import Browser from 'webextension-polyfill'
import { EventName, PortName } from '../event-name'
import { MessagePayload } from '../types'
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions'

export class OpenAIRequest {
  dataCallback: (text: string, error?: Error, ended?: boolean) => void
  baseURL: string
  apiKey: string

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL
    this.apiKey = apiKey

    Browser.runtime.onMessage.addListener(
      (message: MessagePayload<EventName.openAIResponse>) => {
        if (message.type === EventName.openAIResponse) {
          this.dataCallback(message.data, undefined, false)
        } else if (message.type === EventName.openAIResponseEnd) {
          this.dataCallback(message.data, undefined, true)
        } else if (message.type === EventName.openAIResponseError) {
          this.dataCallback(undefined, new Error(message.data), true)
        }
      }
    )
  }

  public sendMsg = (data: ChatCompletionCreateParamsBase, onData: any) => {
    this.dataCallback = onData

    Browser.runtime.sendMessage({
      type: EventName.openAIChat,
      data: {
        ...data,
        baseURL: this.baseURL,
        apiKey: this.apiKey,
      },
    })
  }

  public abort = () => {
    Browser.runtime.sendMessage({ type: EventName.stopOpenAIChat })
  }
}

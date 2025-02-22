import { EventName } from '@/common/event-name'
import { MessagePayload } from '@/common/types'
import { omit } from 'lodash-es'
import OpenAI, { OpenAIError } from 'openai'
import { ChatCompletionChunk } from 'openai/resources'
import { Stream } from 'openai/streaming'
import Browser from 'webextension-polyfill'

const openai = new OpenAI({ apiKey: 'tt' })
let stream: Stream<ChatCompletionChunk>

Browser.runtime.onMessage.addListener(
  (message: MessagePayload<EventName>, sender) => {
    if (message.type === EventName.openAIChat) {
      openai.apiKey = message.data.apiKey || 'tt'
      openai.baseURL = message.data.baseURL
      stream = null

      const doRequest = async () => {
        try {
          stream = (await openai.chat.completions.create({
            ...(omit(message.data, ['apiKey', 'baseURL']) as any),
            stream: true,
          })) as any
          let text = ''
          for await (const chunk of stream) {
            if (chunk.choices[0]?.delta?.content) {
              text += chunk.choices[0]?.delta?.content
              Browser.tabs.sendMessage(sender.tab.id, {
                type: EventName.openAIResponse,
                data: text,
              } satisfies MessagePayload<EventName.openAIResponse>)
            }
          }

          Browser.tabs.sendMessage(sender.tab.id, {
            type: EventName.openAIResponseEnd,
            data: text,
          })
        } catch (e) {
          Browser.tabs.sendMessage(sender.tab.id, {
            type: EventName.openAIResponseError,
            data: e?.error?.message || 'failed',
          })
        }
      }

      doRequest()
    } else if (message.type === EventName.stopOpenAIChat) {
      if (stream) {
        stream.controller.abort()
      }
    }
  }
)

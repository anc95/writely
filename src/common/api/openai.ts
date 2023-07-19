import i18next from 'i18next'
import { Configuration, OpenAIApi } from 'openai'
import { useEffect, useMemo, useRef } from 'react'
import { logger } from '../debug'
import { defaultSetting, useSettings } from '../store/settings'
import { ServiceProvider } from '@/options/types'
import { getToken } from './writely'
import { EventName } from '../event-name'
// // import browser from 'webextension-polyfill'

const useOpenAPI = () => {
  const { settings } = useSettings()
  const openAIRef = useRef<OpenAIApi>()

  useEffect(() => {
    const isWritelyProvider =
      settings.serviceProvider === ServiceProvider.Writely

    const config = new Configuration({
      apiKey: isWritelyProvider ? getToken() : settings?.apiKey,
      basePath: isWritelyProvider
        ? 'https://writely-proxy.miao-ya.com/v1'
        : settings.url,
    })

    openAIRef.current = new OpenAIApi(config)
  }, [settings?.apiKey, settings.url, settings.serviceProvider, getToken()])

  return openAIRef
}

const axiosOptionForOpenAI = (
  onData: (text: string, err?: any, end?: boolean) => void
) => ({
  responseType: 'stream' as ResponseType,
  onDownloadProgress: (e) => {
    if (e.currentTarget.status !== 200) {
      onData('', new Error(e.currentTarget.responseText), false)
      return
    }

    try {
      const lines = e.currentTarget.response
        .toString()
        .split('\n')
        .filter((line) => line.trim() !== '')

      logger.debug(e.currentTarget.response)

      let result = ''

      logger.debug('[EventSource]', e.currentTarget.response)

      let ended = false

      for (const line of lines) {
        const message = line.replace(/^data: /, '')

        if (message === '[DONE]') {
          // stream finished
          ended = true
          break
        }

        try {
          const parsed = JSON.parse(message)

          const text =
            parsed.choices[0].text ||
            parsed.choices[0]?.delta?.content ||
            parsed.choices[0]?.message?.content ||
            ''

          if (!text && !result) {
            continue
          }

          result += text

          // edits don't support stream
          if (parsed.object === 'edit') {
            ended = true
            break
          }
        } catch {
          continue
        }
      }

      if (ended) {
        onData(result, '', true)
      } else {
        onData?.(result)
      }
    } catch (e) {
      // expose current response for error display
      console.log(e)
      onData?.('', e.currentTarget)
    }
  },
})

export const useQueryOpenAIPrompt = () => {
  const openAI = useOpenAPI()
  const { settings } = useSettings()

  return (
    prompt: string,
    onData?: (text: string, error?: Error, end?: boolean) => void
  ) => {
    const isWritelyService =
      settings.serviceProvider === ServiceProvider.Writely
    const isChat =
      isWritelyService ||
      settings.model.includes('turbo') ||
      settings.model === 'gpt-4'

    const commonOption = {
      // max_tokens: 4000 - prompt.replace(/[\u4e00-\u9fa5]/g, 'aa').length,
      stream: true,
      model: ensureUsing0613Model(
        isWritelyService ? defaultSetting.model : settings.model
      ),
      temperature: parseFloat(settings.temperature),
    }

    const abortController = new AbortController()

    if (settings.serviceProvider === ServiceProvider.ChatGPT) {
      sendToChatGPTWeb(prompt)
    } else if (isChat) {
      openAI?.current?.createChatCompletion(
        {
          ...commonOption,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          ...(axiosOptionForOpenAI(onData) as any),
          signal: abortController.signal,
        }
      )
    } else {
      openAI?.current?.createCompletion(
        {
          ...commonOption,
          prompt: prompt,
        },
        {
          ...(axiosOptionForOpenAI(onData) as any),
          signal: abortController.signal,
        }
      )
    }

    return () => {
      abortController.abort()
    }
  }
}

export const useOpenAIEditPrompt = () => {
  const openAI = useOpenAPI()
  const { settings } = useSettings()
  const queryPrompt = useQueryOpenAIPrompt()

  return (
    input: string,
    instruction: string,
    onData?: (text: string, error?: Error, end?: boolean) => void
  ) => {
    // https://platform.openai.com/docs/api-reference/edits
    if (
      (settings.model !== 'text-davinci-edit-001' &&
        settings.model !== 'code-davinci-edit-001') ||
      settings.serviceProvider === ServiceProvider.Writely
    ) {
      return queryPrompt(
        !instruction
          ? input
          : i18next.t('Prompt template', { content: input, task: instruction }),
        onData
      )
    }

    const abortController = new AbortController()

    openAI.current.createEdit(
      {
        input,
        instruction,
        // max_tokens: 4000 - prompt.replace(/[\u4e00-\u9fa5]/g, 'aa').length,
        // stream: true,
        model: settings.model,
      },
      {
        ...(axiosOptionForOpenAI(onData) as any),
        signal: abortController.signal,
      }
    )

    return () => {
      abortController.abort()
    }
  }
}

export const useModels = () => {
  // const api = useOpenAPI();
  // return useSWR('models', async () => {
  //   return (await (await api?.current?.listModels()).data?.data) || [];
  // });

  return useMemo(() => {
    return [
      {
        id: 'gpt-3.5-turbo',
        description:
          'Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration.',
        price: '$0.0015 / 1K tokens, $0.002 / 1K output tokens',
      },
      {
        id: 'gpt-3.5-turbo-16k',
        description:
          'Same capabilities as the standard gpt-3.5-turbo model but with 4 times the context.',
        price: '$0.003 / 1K input tokens, $0.004 / 1K input tokens',
      },
      {
        id: 'gpt-4',
        description:
          'Make sure you have access to gpt-4 before using it. With broad general knowledge and domain expertise, GPT-4 can follow complex instructions in natural language and solve difficult problems with accuracy.',
        price: '$0.03 / 1K input tokens, $0.06 / 1K output tokens',
      },
      {
        id: 'text-davinci-003',
        description:
          'Can do any language task with better quality, longer output, and consistent instruction-following than the curie, babbage, or ada models. Also supports inserting completions within text.',
        price: '$0.02 / 1K tokens',
      },
      {
        id: 'text-davinci-edit-001',
        price: '$0.02 / 1K tokens',
        description: 'Better for text edits',
      },
      {
        id: 'code-davinci-edit-001',
        price: '$0.02 / 1K tokens',
        description: 'Better for code edits',
      },
    ]
  }, [])
}

// TODO: remove later
const ensureUsing0613Model = (model: string) => {
  if (model.startsWith('gpt-3.5')) {
    return model + '-0613'
  }

  return model
}

const sendToChatGPTWeb = async (prompt: string) => {
  console.log(
    'hi',
    await browser.runtime.sendMessage({
      type: EventName.chat,
    })
  )
}

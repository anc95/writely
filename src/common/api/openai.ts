import i18next from 'i18next'
import OpenAI from 'openai'
import { useEffect, useMemo, useRef, useState } from 'react'
import { logger } from '../debug'
import { defaultSetting, useSettings } from '../store/settings'
import { ServiceProvider } from '@/options/types'
import { getToken } from './writely'
import { parseStream } from '../parse-stream'
import { chatgptWeb } from './chatgpt-web'
import { OpenAIRequest } from './openai-request'
import { stopOpenAICHat } from '../browser'

const useOpenAPI = () => {
  const { settings } = useSettings()
  const openAIRef = useRef<OpenAI>()

  useEffect(() => {
    const isWritelyProvider =
      settings.serviceProvider === ServiceProvider.Writely

    openAIRef.current = new OpenAI({
      apiKey: isWritelyProvider ? getToken() : settings?.apiKey,
      baseURL: isWritelyProvider
        ? 'https://writely-proxy.miao-ya.com/v1'
        : settings.url,
    })
  }, [settings?.apiKey, settings.url, settings.serviceProvider, getToken()])

  return openAIRef
}

const useOpenAIRequest = () => {
  const { settings } = useSettings()

  return useMemo(() => {
    const isWritelyProvider =
      settings.serviceProvider === ServiceProvider.Writely

    const client = new OpenAIRequest(
      isWritelyProvider ? 'https://writely-proxy.miao-ya.com/v1' : settings.url,
      isWritelyProvider ? getToken() : settings?.apiKey
    )

    return client
  }, [settings.apiKey, settings.url])
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
      const { data, ended } = parseStream(e.currentTarget.response)

      if (ended) {
        onData(data, '', true)
      } else {
        onData?.(data)
      }
    } catch (e) {
      // expose current response for error display
      console.log(e)
      onData?.('', e.currentTarget)
    }
  },
})

export const useQueryOpenAIPrompt = () => {
  const openAI = useOpenAIRequest()
  const { settings } = useSettings()

  return (
    prompt: string,
    onData?: (text: string, error?: Error, end?: boolean) => void
  ) => {
    const isWritelyService =
      settings.serviceProvider === ServiceProvider.Writely

    const commonOption = {
      // max_tokens: 4000 - prompt.replace(/[\u4e00-\u9fa5]/g, 'aa').length,
      stream: true,
      model: isWritelyService ? defaultSetting.model : settings.model,
      temperature: parseFloat(settings.temperature),
    }

    if (settings.serviceProvider === ServiceProvider.ChatGPT) {
      chatgptWeb.sendMsg(prompt, onData)

      return chatgptWeb.abort
    } else {
      openAI.sendMsg(
        {
          ...commonOption,
          messages: [{ role: 'user', content: prompt }],
        },
        onData
      )

      return () => {
        stopOpenAICHat()
      }
    }
  }
}

export const useOpenAIEditPrompt = () => {
  const queryPrompt = useQueryOpenAIPrompt()

  return (
    input: string,
    instruction: string,
    onData?: (text: string, error?: Error, end?: boolean) => void
  ) => {
    return queryPrompt(
      !instruction
        ? input
        : i18next.t('Prompt template', { content: input, task: instruction }),
      onData
    )
  }
}

export const useModels = () => {
  // const api = useOpenAPI();
  // return useSWR('models', async () => {
  //   return (await (await api?.current?.listModels()).data?.data) || [];
  // });

  return useMemo(() => {
    return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-32k']
  }, [])
}

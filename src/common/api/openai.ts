import { Configuration, OpenAIApi } from 'openai';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { useSettings } from '../store/settings';

const useOpenAPI = () => {
  const { settings } = useSettings();
  const openAIRef = useRef<OpenAIApi>();

  useEffect(() => {
    const config = new Configuration({
      apiKey: settings?.apiKey,
    });

    openAIRef.current = new OpenAIApi(config);
  }, [settings?.apiKey]);

  return openAIRef;
};

export const useQueryOpenAIPrompt = () => {
  const openAI = useOpenAPI();
  const { settings } = useSettings();

  return async (
    prompt: string,
    onData?: (text: string, error?: Error, end?: boolean) => void
  ) => {
    openAI?.current?.createCompletion?.(
      {
        model: settings.model,
        prompt: prompt,
        max_tokens: 2048 - prompt.replace(/[\u4e00-\u9fa5]/g, 'aa').length,
        stream: true,
      },
      {
        responseType: 'stream',
        onDownloadProgress: (e) => {
          try {
            const lines = e.currentTarget.response
              .toString()
              .split('\n')
              .filter((line) => line.trim() !== '');

            let result = '';

            for (const line of lines) {
              const message = line.replace(/^data: /, '');

              if (message === '[DONE]') {
                onData('', undefined, true);
                return; // Stream finished
              }

              const parsed = JSON.parse(message);

              const text = parsed.choices[0].text;

              if (!result && !text.trim()) {
                continue;
              }

              result += parsed.choices[0].text;
            }

            onData?.(result);
          } catch (e) {
            onData?.('', e);
          }
        },
      }
    );
  };
};

export const useModels = () => {
  const api = useOpenAPI();

  return useSWR('models', async () => {
    return (await (await api?.current?.listModels()).data?.data) || [];
  });
};

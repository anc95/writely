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

  return async (prompt: string) => {
    return (
      // chat and normal completion
      (
        await openAI?.current?.createCompletion?.({
          model: settings.model,
          prompt: prompt,
          max_tokens: 2000,
        })
      )?.data?.choices?.[0].text
    );
  };
};

export const useModels = () => {
  const api = useOpenAPI();

  return useSWR('models', async () => {
    return (await (await api?.current?.listModels()).data?.data) || [];
  });
};

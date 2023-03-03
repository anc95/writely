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

export const useModels = () => {
  const api = useOpenAPI();

  return useSWR('models', async () => {
    return (await (await api?.current?.listModels()).data?.data) || [];
  });
};

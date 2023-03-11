import i18next from 'i18next';
import { Configuration, OpenAIApi } from 'openai';
import { useEffect, useMemo, useRef } from 'react';
import { logger } from '../debug';
import { useSettings } from '../store/settings';

const useOpenAPI = () => {
  const { settings } = useSettings();
  const openAIRef = useRef<OpenAIApi>();

  useEffect(() => {
    const config = new Configuration({
      apiKey: settings?.apiKey,
      basePath: settings.url,
    });

    openAIRef.current = new OpenAIApi(config);
  }, [settings?.apiKey, settings.url]);

  return openAIRef;
};

const axiosOptionForOpenAI = (
  onData: (text: string, err?: any, end?: boolean) => void
) => ({
  responseType: 'stream' as ResponseType,
  onDownloadProgress: (e) => {
    if (e.currentTarget.status !== 200) {
      onData('', e.currentTarget.responseText, true);
      return;
    }

    try {
      const lines = e.currentTarget.response
        .toString()
        .split('\n')
        .filter((line) => line.trim() !== '');

      let result = '';

      logger.debug('[EventSource]', e.currentTarget.response);

      let ended = false;

      for (const line of lines) {
        const message = line.replace(/^data: /, '');

        if (message === '[DONE]') {
          // stream finished
          ended = true;
          break;
        }

        const parsed = JSON.parse(message);

        const text =
          parsed.choices[0].text ||
          parsed.choices[0]?.delta?.content ||
          parsed.choices[0]?.message?.content ||
          '';

        if (!text && !result) {
          continue;
        }

        result += text;

        // edits don't support stream
        if (parsed.object === 'edit') {
          ended = true;
          break;
        }
      }

      if (ended) {
        onData(result, '', true);
      } else {
        onData?.(result);
      }
    } catch (e) {
      // expose current response for error display
      onData?.('', e.currentTarget.response);
    }
  },
});

export const useQueryOpenAIPrompt = () => {
  const openAI = useOpenAPI();
  const { settings } = useSettings();

  return async (
    prompt: string,
    onData?: (text: string, error?: Error, end?: boolean) => void
  ) => {
    const isChat = settings.model.includes('turbo');

    const commonOption = {
      max_tokens: 4000 - prompt.replace(/[\u4e00-\u9fa5]/g, 'aa').length,
      stream: true,
      model: settings.model,
    };

    if (isChat) {
      openAI?.current?.createChatCompletion(
        {
          ...commonOption,
          messages: [{ role: 'user', content: prompt }],
        },
        axiosOptionForOpenAI(onData) as any
      );
    } else {
      openAI?.current?.createCompletion(
        {
          ...commonOption,
          prompt: prompt,
        },
        axiosOptionForOpenAI(onData) as any
      );
    }
  };
};

export const useOpenAIEditPrompt = () => {
  const openAI = useOpenAPI();
  const { settings } = useSettings();
  const queryPrompt = useQueryOpenAIPrompt();

  return async (
    input: string,
    instruction: string,
    onData?: (text: string, error?: Error, end?: boolean) => void
  ) => {
    // https://platform.openai.com/docs/api-reference/edits
    if (
      settings.model !== 'text-davinci-edit-001' &&
      settings.model !== 'code-davinci-edit-001'
    ) {
      queryPrompt(
        !instruction
          ? input
          : i18next.t('Prompt template', { content: input, task: instruction }),
        onData
      );

      return;
    }

    openAI.current.createEdit(
      {
        input,
        instruction,
        // max_tokens: 4000 - prompt.replace(/[\u4e00-\u9fa5]/g, 'aa').length,
        // stream: true,
        model: settings.model,
      },
      axiosOptionForOpenAI(onData) as any
    );
  };
};

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
        price: '$0.002 / 1K tokens',
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
    ];
  }, []);
};

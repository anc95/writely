import i18n from 'i18next';

const defaultPrompt = (params: { prefix: string; suffix?: string }) => {
  return (text: string) => {
    return `${params.prefix || ''} \n${text} \n ${params.suffix || ''}`;
  };
};

const getPrompts = () => [
  {
    label: i18n.t('Improve writing'),
  },
  {
    label: i18n.t('Fix spell and grammar'),
  },
  {
    label: i18n.t('Make shorter'),
  },
  {
    label: i18n.t('Make Longer'),
  },
  {
    label: i18n.t('Translate to'),
    children: [
      {
        label: i18n.t('English'),
      },
      {
        label: i18n.t('Chinese'),
      },
    ],
  },
];

export class PromptCenter {
  protected prompts;

  constructor() {
    this.prompts = this.constructPrompts(getPrompts());
  }

  private constructPrompts = (prompts, prefix: string = '') => {
    return prompts.map((p) => {
      if (!prompts.children?.length) {
        return {
          ...p,
          prompt: defaultPrompt({
            prefix: prefix + ' ' + p.label + i18n.t(' for bellow content:'),
          }),
        };
      }

      return {
        ...p,
        children: this.constructPrompts(p.children, prefix + ' ' + p.label),
      };
    });
  };

  public useDropDownItems = (keyword = '') => {
    return this.prompts.filter((p) =>
      p.label.toLowerCase().includes(keyword.toLowerCase())
    );
  };
}

import i18n from 'i18next';

export const defaultPrompt = (params: { role: string; task: string }) => {
  return (content: string) => {
    return i18n.t('Prompt template', {
      content,
      task: params.task,
      role: params.role || i18n.t('Senior Writer'),
    });
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
            task: p.label,
            role: i18n.t('Senior Writer'),
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

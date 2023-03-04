const defaultPrompt = (params: { prefix: string; suffix?: string }) => {
  return (text: string) => {
    return `${params.prefix || ''} \n${text} \n ${params.suffix || ''}`;
  };
};

const prompts = [
  {
    label: 'Improve writing',
  },
  {
    label: 'Fix spell and grammar',
  },
  {
    label: 'Make shorter',
  },
  {
    label: 'Make Longer',
  },
  {
    label: 'Translate to',
    children: [
      {
        label: 'English',
      },
      {
        label: 'Chinese',
      },
    ],
  },
];

class PromptCenter {
  protected prompts;

  constructor() {
    this.prompts = this.constructPrompts(prompts);
  }

  private constructPrompts = (prompts, prefix: string = '') => {
    return prompts.map((p) => {
      if (!prompts.children?.length) {
        return {
          ...p,
          prompt: defaultPrompt({
            prefix: prefix + ' ' + p.label + ' for bellow content:',
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

export const promptCenter = new PromptCenter();

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
].map((item, index) => ({
  ...item,
  key: index,
  prompt: defaultPrompt({ prefix: item.label + ' to bellow text' + ':' }),
}));

class PromptCenter {
  protected prompts = prompts;

  public useDropDownItems = (keyword = '') => {
    return this.prompts.filter((p) =>
      p.label.toLowerCase().includes(keyword.toLowerCase())
    );
  };
}

export const promptCenter = new PromptCenter();

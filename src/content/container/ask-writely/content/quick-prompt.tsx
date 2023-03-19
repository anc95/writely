import { useMemo } from 'react';
import { PromptCenter } from '../prompts';
import { List, ListProps } from './list';

export const QuickPrompt: React.FC<{
  filter: string;
  onClick: (instruction: string) => void;
}> = ({ filter, onClick }) => {
  const promptCenter = useMemo(() => new PromptCenter(), []);
  const items = promptCenter.useDropDownItems(filter);

  return (
    <div>
      {items.map((item, index) => (
        <Card {...item} key={index} onClick={onClick} />
      ))}
    </div>
  );
};

const Card: React.FC<{
  category: string;
  menus: ListProps['items'];
  onClick: (instruction: string) => void;
}> = ({ category, menus, onClick }) => {
  return (
    <div
      className="border-b border-gray-200 py-1"
      style={{ borderBottomStyle: 'solid' }}
    >
      <div className="py-1 px-2">
        <div className="text-gray-600 text-xs mb-1">{category}</div>
        <List
          items={menus}
          max={4}
          onClick={(i) => onClick(i.instruction || (i.label as string))}
        />
      </div>
    </div>
  );
};

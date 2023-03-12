import { Popover } from 'antd';
import React, { useCallback, useRef } from 'react';
import { RightArrowIcon } from '../../../../components/icon';

export type ListProps = {
  items: {
    label: React.ReactNode;
    children: ListProps['items'];
    icon: React.ReactNode;
    instruction: string;
  }[];
  onClick?: (item: ListProps['items'][number]) => void;
};

export const List: React.FC<ListProps> = ({ items, onClick }) => {
  const handleClick = useCallback(
    (item) => {
      if (item.children) {
        return;
      }

      onClick?.(item);
    },
    [onClick]
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {items.map((item, index) => {
        const hasChildren = !!item.children?.length;

        const itemEle = (
          <div
            key={index}
            onClick={() => handleClick(item)}
            className="h-7 hover:bg-zinc-200 rounded-none hover:rounded-md flex items-center justify-between text-[13px] hover:text-[14px] cursor-pointer px-1.5 transition-all duration-300"
          >
            <div className="flex items-center gap-1">
              <span className="text-amber-600 text-base h-4">{item.icon}</span>{' '}
              {item.label}
            </div>
            {hasChildren ? (
              <div className="w-3 rotate-90">
                <RightArrowIcon />
              </div>
            ) : null}
          </div>
        );

        if (!item.children?.length) {
          return itemEle;
        }

        return (
          <Popover
            key={index}
            placement="right"
            getPopupContainer={(e) => e.parentElement}
            content={<List items={item.children} onClick={handleClick} />}
          >
            {itemEle}
          </Popover>
        );
      })}
    </div>
  );
};

import { Popover } from 'antd';
import React, { useCallback, useRef } from 'react';
import { RightArrowIcon } from '../../../components/icon';

type ListProps = {
  items: {
    label: React.ReactNode;
    children: ListProps['items'];
    [key: string]: any;
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
    <div className="p-1.5 flex flex-col">
      {items.map((item, index) => {
        const hasChildren = !!item.children?.length;

        const itemEle = (
          <div
            key={index}
            onClick={() => handleClick(item)}
            className="h-7 hover:bg-zinc-200 rounded-md flex items-center justify-between text-sm cursor-pointer px-1.5"
          >
            {item.label}
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

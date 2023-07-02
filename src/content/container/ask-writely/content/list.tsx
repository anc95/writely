import { MaterialSymbolsMoreHoriz } from '@/components/icon/more'
import { Popover } from 'antd'
import i18next from 'i18next'
import React, { useCallback, useRef } from 'react'
import { RightArrowIcon } from '../../../../components/icon'

export type ListProps = {
  items: {
    label: React.ReactNode
    children: ListProps['items']
    icon: React.ReactNode
    instruction: string
  }[]
  onClick?: (item: ListProps['items'][number]) => void
  max?: number
}

export const List: React.FC<ListProps> = ({ items, onClick, max }) => {
  const handleClick = useCallback(
    (item) => {
      if (item.children) {
        return
      }

      onClick?.(item)
    },
    [onClick]
  )

  const maxShownItem = typeof max === 'number' ? max : Infinity

  if (items.length === 0) {
    return null
  }

  const shouldShowMore = items.length > maxShownItem

  return (
    <div className="flex flex-col">
      {items.slice(0, maxShownItem).map((item, index) => {
        const itemEle = <Item item={item} onClick={handleClick} key={index} />

        if (!item.children?.length) {
          return itemEle
        }

        return (
          <Popover
            key={index}
            placement="right"
            getPopupContainer={(e) => e.parentElement}
            content={<List items={item.children} onClick={handleClick} />}
          >
            <div>{itemEle}</div>
          </Popover>
        )
      })}
      {shouldShowMore ? (
        <Popover
          placement="left"
          getPopupContainer={(e) => e.parentElement}
          content={
            <List items={items.slice(maxShownItem)} onClick={handleClick} />
          }
        >
          <div>
            <Item
              item={{
                icon: <MaterialSymbolsMoreHoriz />,
                label: i18next.t('More'),
              }}
            />
          </div>
        </Popover>
      ) : null}
    </div>
  )
}

const Item: React.FC<{ item: any; onClick?: (item: any) => void }> = ({
  item,
  onClick,
}) => {
  const hasChildren = !!item.children?.length

  return (
    <div
      onClick={() => onClick?.(item)}
      className="h-7 hover:bg-zinc-200 rounded-none hover:rounded-md flex items-center justify-between text-[13px] hover:text-[14px] cursor-pointer px-1.5 transition-all duration-300"
    >
      <div className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="text-amber-600 text-base h-4">{item.icon}</span>{' '}
        {item.label}
      </div>
      {hasChildren ? (
        <div className="w-3 rotate-90">
          <RightArrowIcon />
        </div>
      ) : null}
    </div>
  )
}

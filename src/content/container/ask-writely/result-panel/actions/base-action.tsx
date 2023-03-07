import { Tooltip } from 'antd';
import { PropsWithChildren, useRef } from 'react';

export const BaseAction: React.FC<
  PropsWithChildren<{ tooltip: string; onClick?: () => void }>
> = ({ tooltip, children, onClick }) => {
  const btnRef = useRef<HTMLDivElement>();

  return (
    <Tooltip title={tooltip} getPopupContainer={() => btnRef.current}>
      <div
        ref={btnRef}
        className="p-2 text-xs hover:text-base hover:bg-black hover:text-orange-600 rounded-sm flex items-center justify-center cursor-pointer transition-all"
        onClick={() => onClick?.()}
      >
        {children}
      </div>
    </Tooltip>
  );
};

import { Tooltip } from 'antd';
import { PropsWithChildren, useCallback, useRef, useState } from 'react';

export const BaseAction: React.FC<
  PropsWithChildren<{
    tooltip: string;
    successTooltip?: string;
    onClick?: () => void;
  }>
> = ({ tooltip, successTooltip, children, onClick }) => {
  const [title, setTitle] = useState<string>();
  const [open, setOpen] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpen(false);
    setTitle(tooltip);
  }, []);

  const handleClick = useCallback(() => {
    onClick?.();
    successTooltip && setTitle(successTooltip);
  }, [onClick]);

  return (
    <Tooltip open={open} title={title}>
      <div
        className="h-8 w-8 text-base hover:text-lg hover:bg-black hover:text-white rounded-sm flex items-center justify-center cursor-pointer transition-all"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </Tooltip>
  );
};

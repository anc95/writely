import { useClickAway, useTextSelection } from 'ahooks';
import { Button, Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Content } from './content';

export const AskWritely: React.FC = () => {
  const ts = useTextSelection(document.body);
  const [open, setOpen] = useState<boolean>(false);
  const tsRef = useRef<ReturnType<typeof useTextSelection>>();
  const contentRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!open && !!ts.text) {
      tsRef.current = ts;
      setOpen(true);
    }
  }, [ts.text]);

  useClickAway(() => {
    if (open === true) {
      setOpen(false);
    }
  }, contentRef);

  return (
    <Popover
      open={open}
      content={<Content text={tsRef?.current?.text} ref={contentRef} />}
    >
      <span
        style={{
          position: 'fixed',
          top: `${tsRef.current?.top}px`,
          left: `${tsRef.current?.left}px`,
          height: `${tsRef.current?.height}px`,
          width: `${tsRef.current?.width}px`,
          pointerEvents: 'none',
        }}
      />
    </Popover>
  );
};

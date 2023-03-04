import { useClickAway, useTextSelection } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import ReactDraggable from 'react-draggable';
import { Content } from './content';

export const AskWritely: React.FC = () => {
  const ts = useTextSelection(document.body);
  const [visible, setVisible] = useState<boolean>(false);
  const tsRef = useRef<ReturnType<typeof useTextSelection>>();
  const contentRef = useRef<HTMLDivElement>();

  useEffect(() => {
    debugger;
    if (!visible && !!ts.text) {
      tsRef.current = ts;
      setVisible(true);
    }
  }, [ts.text]);

  useClickAway(() => {
    if (visible === true) {
      setVisible(false);
    }
  }, contentRef);

  if (!visible) {
    return null;
  }

  return (
    <ReactDraggable>
      <div
        style={{
          padding: '10px',
          position: 'fixed',
          top: `${tsRef.current?.top + tsRef.current?.height}px`,
          left: `${tsRef.current?.left}px`,
        }}
      >
        <Content text={tsRef?.current?.text} ref={contentRef} />
      </div>
    </ReactDraggable>
  );
};

import { useClickAway, useTextSelection } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import ReactDraggable from 'react-draggable';
import { tag } from '../../shadow-dom';
import { useSelectionManager } from '../store/selection';
import { Content } from './content';

export const AskWritely: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>();
  const selectionManager = useSelectionManager();

  useEffect(() => {
    selectionManager.onSelectionChange((s) => {
      setVisible(!!s.anchorNode);
      selectionManager.setLock(true);
      if (!!s.anchorNode) {
        deplayListener('click', () => {
          setVisible(false);
          selectionManager.setLock(false);
        });
      }
    });
  }, []);

  if (!visible) {
    return null;
  }

  const { selectionBoundingRect: boundingRect } = selectionManager;

  return (
    <ReactDraggable>
      <div
        ref={contentRef}
        style={{
          padding: '10px',
          position: 'fixed',
          top: `${boundingRect?.top + boundingRect?.height}px`,
          left: `${boundingRect?.left}px`,
          zIndex: 9999999999999,
        }}
      >
        <Content />
      </div>
    </ReactDraggable>
  );
};

const deplayListener = (eventName: string, handler) => {
  const id = setTimeout(() => {
    document.addEventListener(eventName, handler);
  }, 300);

  return () => {
    clearTimeout(id);
    document.removeEventListener(eventName, handler);
  };
};

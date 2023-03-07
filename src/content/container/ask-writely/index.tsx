import { useEffect, useRef, useState } from 'react';
import ReactDraggable from 'react-draggable';
import { useSelectionManager } from '../store/selection';
import { Content } from './content';

export const AskWritely: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>();
  const selectionManager = useSelectionManager();
  const clickedRef = useRef<boolean>(false);

  useEffect(() => {
    selectionManager.onSelectionChange((s) => {
      const valid = !!s.anchorNode;

      setVisible(valid);
      selectionManager.setLock(true);

      const destroy = () => {
        setVisible(false);
        selectionManager.setLock(false);
        clickedRef.current = false;
      };

      if (valid) {
        deplayListener('click', destroy);

        clickedRef.current = false;

        // if 3s later, user doesn't interact, hide myself
        setTimeout(() => {
          if (!clickedRef.current) {
            destroy();
          }
        }, 3000);
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
        onClick={() => (clickedRef.current = true)}
        style={{
          padding: '10px',
          position: 'fixed',
          top: `${boundingRect?.top + boundingRect?.height}px`,
          left: `${boundingRect?.left}px`,
          zIndex: 9999999999999,
        }}
        className="animate__animated animate__bounce"
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

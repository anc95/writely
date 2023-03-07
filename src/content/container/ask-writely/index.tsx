import { useEffect, useRef, useState } from 'react';
import ReactDraggable from 'react-draggable';
import { useSelectionManager } from '../store/selection';
import { useView } from '../store/view';
import { Content } from './content';

export const AskWritely: React.FC = () => {
  const selectionManager = useSelectionManager();
  const { selectionBoundingRect: boundingRect } = selectionManager;
  const { viewStatus } = useView();

  if (viewStatus === 'none') {
    return null;
  }

  return (
    <ReactDraggable handle=".handle">
      <div
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

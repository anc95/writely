import { Avatar } from 'antd';
import Draggable from 'react-draggable';
import { editDetecor } from '../utils/edit-detector';

export const Menu: React.FC = () => {
  const visible = editDetecor.useVisibility();

  if (!visible) {
    return null;
  }

  const { x, y, width, height } = editDetecor.boundingReact;

  return (
    <Draggable defaultPosition={{ x: x + width, y: y + height / 2 }}>
      <div
        className="fixed z-[9999999999] left-0 right-0"
        onKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          editDetecor.keepFocus();
        }}
      >
        <Avatar>W</Avatar>
      </div>
    </Draggable>
  );
};

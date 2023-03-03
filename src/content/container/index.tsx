import { SettingsProvider } from '../../common/store/settings';
import { editDetecor } from '../utils/edit-detector';
import { AskWritely } from './ask-writely';

export const Menu: React.FC = () => {
  const visible = editDetecor.useVisibility();

  if (!visible) {
    return null;
  }

  const { x, y, width, height } = editDetecor.boundingReact;

  return (
    <SettingsProvider>
      <AskWritely />
    </SettingsProvider>
  );
};

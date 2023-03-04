import { SettingsProvider } from '../../common/store/settings';
import { AskWritely } from './ask-writely';

export const Menu: React.FC = () => {
  return (
    <SettingsProvider>
      <AskWritely />
    </SettingsProvider>
  );
};

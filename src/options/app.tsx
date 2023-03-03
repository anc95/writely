import { SettingsForm } from './setting-form';
import { SettingsProvider } from './store/settings';

export const App: React.FC = () => {
  return (
    <SettingsProvider>
      <div className="flex justify-center">
        <div className="w-[1280px]">
          <SettingsForm />
        </div>
      </div>
    </SettingsProvider>
  );
};

import { useCallback, useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { Settings } from '../types';

const key = 'writingly-settings';

const _useSettings = () => {
  const [settings, _setSettings] = useState<Settings>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initSettings = async () => {
      _setSettings((await chrome.storage.sync.get(key))?.[key] || {});
      setLoading(false);
    };

    initSettings();
  }, []);

  const setSettings = useCallback(
    async (newSettings: Partial<Settings>) => {
      _setSettings({
        ...settings,
        ...newSettings,
      });

      chrome.storage.sync.set({
        [key]: {
          ...settings,
          ...newSettings,
        },
      });
    },
    [settings]
  );

  return {
    settings,
    setSettings,
    loading,
  };
};

const { useContainer: useSettings, Provider: SettingsProvider } =
  createContainer(_useSettings);

export { useSettings, SettingsProvider };

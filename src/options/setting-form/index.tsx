import { Form } from 'antd';
import { useCallback, useEffect } from 'react';
import { useSWRConfig } from 'swr';
import { Settings } from '../types';
import { useSettings } from '../../common/store/settings';
import { OPENAISettings } from './open-api';

export const SettingsForm: React.FC = () => {
  const { loading, settings, setSettings } = useSettings();
  const { mutate } = useSWRConfig();

  const handleFormChange = useCallback(
    async (changedValue: Settings) => {
      setSettings(changedValue);
    },
    [setSettings]
  );

  useEffect(() => {
    if (!loading) {
      mutate('models');
    }
  }, [loading]);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="font-semibold text-3xl lg:w-5/6 border-b border-gray-200 py-5 mb-4">
        Settings
      </div>
      <Form onValuesChange={handleFormChange} initialValues={settings}>
        <div className="max-w-4xl">
          <OPENAISettings />
        </div>
      </Form>
    </div>
  );
};

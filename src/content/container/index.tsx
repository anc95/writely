import { ConfigProvider } from 'antd';
import { useEffect } from 'react';
import { theme } from '../../common/antd-theme';
import { AskWritely } from './ask-writely';
import { SelectionManagerProvider } from './store/selection';
import 'highlight.js/styles/github.css';
import { ViewProvider } from './store/view';
import { SettingsProvider } from '@/common/store/settings';

export const Menu: React.FC = () => {
  return (
    <ConfigProvider theme={theme}>
      <SelectionManagerProvider>
        <ViewProvider>
          <AskWritely />
        </ViewProvider>
      </SelectionManagerProvider>
    </ConfigProvider>
  );
};

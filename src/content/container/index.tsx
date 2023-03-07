import { ConfigProvider } from 'antd';
import { useEffect } from 'react';
import { theme } from '../../common/antd-theme';
import { AskWritely } from './ask-writely';
import { SelectionManagerProvider } from './store/selection';
import 'highlight.js/styles/github.css';

export const Menu: React.FC = () => {
  return (
    <ConfigProvider theme={theme}>
      <SelectionManagerProvider>
        <AskWritely />
      </SelectionManagerProvider>
    </ConfigProvider>
  );
};

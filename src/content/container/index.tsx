import { ConfigProvider } from 'antd';
import { useEffect } from 'react';
import { theme } from '../../common/antd-theme';
import { AskWritely, getFixedDom } from './ask-writely';
import { SelectionManagerProvider } from './store/selection';
import 'highlight.js/styles/github.css';
import { ViewProvider } from './store/view';

export const Menu: React.FC = () => {
  return (
    <ConfigProvider
      theme={theme}
      getPopupContainer={() => getFixedDom()}
      getTargetContainer={() => getFixedDom()}
    >
      <SelectionManagerProvider>
        <ViewProvider>
          <AskWritely />
        </ViewProvider>
      </SelectionManagerProvider>
    </ConfigProvider>
  );
};

import { createRoot } from 'react-dom/client';
import { App } from './app';
import 'antd/dist/reset.css';
import './index.css';
import '../common/i18n';
import { initI18n } from '../common/i18n';

const render = async () => {
  await initI18n();
  createRoot(document.getElementById('app')).render(<App />);
};

render();

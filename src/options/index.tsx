import { createRoot } from 'react-dom/client';
import { App } from './app';
import 'antd/dist/reset.css';
import './index.css';
import '../common/i18n';

createRoot(document.getElementById('app')).render(<App />);

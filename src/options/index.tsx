import { createRoot } from 'react-dom/client';
import { App } from './app';
import 'antd/dist/reset.css';
import './index.css';

createRoot(document.getElementById('app')).render(<App />);

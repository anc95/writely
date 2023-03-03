import { createRoot } from 'react-dom/client';
import { appElement } from './app';
import './index.css';

const render = () => {
  const container = document.createElement('div');
  container.className = 'writly-container';
  document.body.append(container);

  createRoot(container).render(appElement);
};

render();

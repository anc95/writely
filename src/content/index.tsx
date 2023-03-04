import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import { createRoot } from 'react-dom/client';
import { appElement } from './app';
import './index.css';
import { tag, conatinerId } from './shadow-dom.js';

const render = () => {
  window.addEventListener('load', () => {
    const container = document.createElement(tag);
    container.className = 'writly-container';
    document.body.append(container);

    createRoot(container.shadowRoot.querySelector(`#${conatinerId}`)).render(
      appElement
    );
  });
};

render();

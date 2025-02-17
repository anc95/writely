import '@webcomponents/webcomponentsjs/webcomponents-bundle'
import { createRoot } from 'react-dom/client'
import { StyleProvider } from '@ant-design/cssinjs'
import { App } from './app'
import './index.css'
import { tag, conatinerId } from './shadow-dom.js'
import { initI18n } from '../common/i18n'
import 'animate.css'

const render = async () => {
  const container = document.createElement(tag)
  container.className = 'writly-container'
  document.documentElement.append(container)

  await initI18n()

  createRoot(container.shadowRoot.querySelector(`#${conatinerId}`)).render(
    <StyleProvider container={container.shadowRoot}>
      <App />
    </StyleProvider>
  )
}

render()

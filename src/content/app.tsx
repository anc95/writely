import { Menu } from './container/index'
// first, import these 2 badboys
import { StyleProvider } from '@ant-design/cssinjs'
import Cache from '@ant-design/cssinjs/es/Cache'
import { conatinerId, tag } from './shadow-dom'
import { SettingsProvider } from '../common/store/settings'
import { isElectron } from '@/common/env'

// second, create custom Cache entity
class CustomCache extends Cache {
  override update(keys, valFn) {
    const shadowRoot = isElectron
      ? document
      : document.getElementsByTagName(tag)[0].shadowRoot
    let path = keys.join('%')
    let prevValue = this.cache.get(path)!
    let nextValue = valFn(prevValue)
    let id = keys.join('-')
    let style = shadowRoot.getElementById(id)
    if (!style) {
      style = document.createElement('style')
      style.id = id
      shadowRoot.appendChild(style)
    }
    style.innerText = nextValue
    super.update(keys, valFn)
  }
}

export const App: React.FC = () => {
  return (
    <StyleProvider
      cache={new CustomCache()}
      // https://github.com/ant-design/cssinjs/issues/28
      container={getRoot()}
    >
      <SettingsProvider>
        <div className="text-black">
          <Menu />
        </div>
      </SettingsProvider>
    </StyleProvider>
  )
}

const getRoot = () => {
  if (isElectron) {
    return document.getElementById('app')
  }

  return document
    .getElementsByTagName(tag)[0]
    .shadowRoot.ownerDocument.getElementById(conatinerId)
}

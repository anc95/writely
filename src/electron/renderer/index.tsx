import { App as OptionsApp } from '../../options/app'
import { App as ContentApp } from '../../content/app'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { initI18n } from '@/common/i18n'
import { createRoot } from 'react-dom/client'

const MainApp = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" Component={ContentApp} />
        <Route path="/setting" Component={OptionsApp} />
      </Routes>
    </HashRouter>
  )
}

const render = async () => {
  await initI18n()
  createRoot(document.getElementById('app')).render(<MainApp />)
}

render()

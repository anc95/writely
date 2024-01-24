import { SettingsForm } from './setting-form'
import { SettingsProvider } from '../common/store/settings'
import { ConfigProvider } from 'antd'
import { theme } from '../common/antd-theme'
import 'antd/dist/reset.css'
import './index.css'
import '../common/i18n'

export const App: React.FC = () => {
  return (
    <ConfigProvider theme={theme}>
      <SettingsProvider>
        <div className="flex justify-center min-h-[100vh] min-w-full">
          <div className="w-[1280px]">
            <SettingsForm />
          </div>
        </div>
      </SettingsProvider>
    </ConfigProvider>
  )
}

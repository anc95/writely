import { DashiconsAdminGeneric } from '@/components/icon'
import './index.css'
import browser from 'webextension-polyfill'

export const App: React.FC = () => {
  return (
    <div className="rounded-lg overflow-hidden w-96 bg-white pb-4">
      <div className="text-2xl font-semibold from-neutral-900 flex items-baseline justify-between pt-4 border-gray-200 border-b px-3">
        <div className="animate-bounce">Writely</div>
        <div
          className="text-xl cursor-pointer hover:bg-slate-300 p-1"
          onClick={() => {
            const url = browser.runtime.getURL('dist/options/index.html')
            window.open(url)
          }}
        >
          <DashiconsAdminGeneric />
        </div>
      </div>
    </div>
  )
}

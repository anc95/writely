import { useRef } from 'react'
import { ResultPanelProvider } from '../../store/result-panel'
import { Content } from './content'
import { Header } from './header'

export const ResultPanel: React.FC<{
  text: string
}> = ({ text }) => {
  const abortRef = useRef<() => void>(() => {})

  return (
    <ResultPanelProvider>
      <div className="overflow-hidden rounded-lg shadow-xl w-[500px]">
        <div className="border-zinc-200 rounded-lg">
          <Header abortRef={abortRef} />
        </div>
        <Content text={text} abortRef={abortRef} />
      </div>
    </ResultPanelProvider>
  )
}

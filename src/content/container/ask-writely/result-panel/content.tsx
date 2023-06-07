import { IcOutlineModeEdit } from '@/components/icon'
import { MutableRefObject, useCallback, useEffect, useRef } from 'react'
import mdit from 'markdown-it'
import hljsPlugin from 'markdown-it-highlightjs'
import { Actions } from './actions'
import { Copy } from './actions/copy'
import { Replay } from './actions/replay'
import cx from 'classnames'
import { useSelectionManager } from '../../store/selection'
import { Alert, Tooltip, message } from 'antd'
import { useOpenAIEditPrompt } from '@/common/api/openai'
import { useResultPanel } from '../../store/result-panel'
import { Insert } from './actions/update'
import { Replace } from './actions/replace'
import { IconBtn } from '@/components/icon-btn'
import { MaterialSymbolsStopCircleOutline } from '@/components/icon/stop'
import i18next from 'i18next'
import { getToken } from '@/common/api/writely'
import { LoginInstruction } from './login-instruction'
import { useSettings } from '@/common/store/settings'
import { ServiceProvider } from '@/options/types'

const md = mdit().use(hljsPlugin)

export const Content: React.FC<{ text: string }> = ({ text: task }) => {
  const mdContainerRef = useRef<HTMLDivElement>()
  const selectionManager = useSelectionManager()
  const queryOpenAIPrompt = useOpenAIEditPrompt()
  const {
    result,
    setResult,
    loading,
    setLoading,
    setText,
    text: resultText,
    setIsError,
    isError,
  } = useResultPanel()
  const { settings } = useSettings()
  const sequenceRef = useRef<number>(0)
  const { isOriginText } = useResultPanel()
  const abortRef = useRef<() => void>(null)

  const handleQuery = useCallback(async () => {
    if (!selectionManager.text) {
      return message.warning('No selection')
    }

    sequenceRef.current += 1
    const currentSequence = sequenceRef.current

    const handler = (text: string, err: Error, end: boolean) => {
      if (currentSequence != sequenceRef.current) {
        return
      }

      if (end) {
        setText(text)
        setLoading(false)
        return
      }

      if (err) {
        setText(err.message)
        setLoading(false)
        setIsError(true)
      } else {
        setText(text)
        setIsError(false)
      }
    }

    try {
      abortRef.current = queryOpenAIPrompt(selectionManager.text, task, handler)
      // queryOpenAIEdit(selectionManager.text, text, handler);
    } catch (e) {
      setResult(e.toString())
      setLoading(false)
    }
  }, [queryOpenAIPrompt])

  useEffect(() => {
    if (loading) {
      setResult('')
      setText('')
      handleQuery()
    }
  }, [loading])

  useEffect(() => {
    if (!isOriginText) {
      setResult(md.render(resultText))
    } else {
      setResult(resultText)
    }
  }, [isOriginText, resultText])

  useEffect(() => setLoading(true), [])

  const content = (
    <div
      ref={mdContainerRef}
      className="transition-all duration-500"
      dangerouslySetInnerHTML={{ __html: result }}
    ></div>
  )

  if (!getToken() && settings.serviceProvider === ServiceProvider.Writely) {
    return <LoginInstruction />
  }

  return (
    <div className="shadow-xl bg-zinc-100">
      <div className="p-4 max-h-[50vh] overflow-auto transition-all duration-700">
        {loading ? (
          <div className="flex justify-center text-xl">
            <StopGenerate
              onClick={() => {
                abortRef?.current?.()
                setLoading(false)
              }}
            />
          </div>
        ) : null}
        {isError ? <Alert description={content} type="error" /> : content}
        {loading ? <AutoScroll /> : null}
      </div>
      <div
        className={cx(
          'h-10 flex items-center justify-center border-t border-zinc-200 transition-all duration-700',
          loading ? 'opacity-0 !h-0' : 'opacity-100'
        )}
      >
        {loading ? null : (
          <Actions>
            <Replace dom={mdContainerRef} />
            <Insert dom={mdContainerRef} />
            <Copy dom={mdContainerRef} />
            <Replay />
          </Actions>
        )}
      </div>
    </div>
  )
}

const StopGenerate: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div className="w-fit">
      <Tooltip title={i18next.t('##Stop Generate')} trigger="hover">
        <IconBtn
          color="red"
          className="animate-breathe-heavy"
          onClick={onClick}
        >
          <MaterialSymbolsStopCircleOutline className="text-2xl" />
        </IconBtn>
      </Tooltip>
    </div>
  )
}

const AutoScroll: React.FC = () => {
  const divRef = useRef<HTMLDivElement>()

  useVisibleEffect(divRef)

  return <div className="w-1 h-1" ref={divRef}></div>
}

const useVisibleEffect = (ref: MutableRefObject<HTMLDivElement>) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio !== 1) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
          })
        }
      })
    })

    if (!ref.current) {
      return
    }

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])
}

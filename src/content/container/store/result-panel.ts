import { useCallback, useState } from 'react'
import { createContainer } from 'unstated-next'

const { useContainer: useResultPanel, Provider: ResultPanelProvider } =
  createContainer(() => {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState('')
    const [text, setText] = useState('')
    const [isError, setIsError] = useState(false)
    const [isOriginText, setIsOriginText] = useState(false)

    return {
      loading,
      setLoading,
      result,
      setResult,
      text,
      isOriginText,
      setIsOriginText,
      setText: useCallback((newText: string) => {
        setText((value) => {
          if (newText.length > value.length) {
            return newText
          }

          return value
        })
      }, []),
      isError,
      setIsError,
    }
  })

export { useResultPanel, ResultPanelProvider }

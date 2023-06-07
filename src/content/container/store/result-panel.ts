import { useState } from 'react'
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
      setText,
      isError,
      setIsError,
    }
  })

export { useResultPanel, ResultPanelProvider }

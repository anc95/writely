import { logger } from './debug'

export const parseStream = (content: string) => {
  const lines = content
    .toString()
    .split('\n')
    .filter((line) => line.trim() !== '')

  let result = ''

  logger.debug('[EventSource]', content)

  let ended = false

  for (const line of lines) {
    const message = line.replace(/^data: /, '')

    if (message === '[DONE]') {
      // stream finished
      ended = true
      break
    }

    try {
      const parsed = JSON.parse(message)

      const text =
        parsed?.message?.content?.parts?.join('') ||
        parsed.choices[0].text ||
        parsed.choices[0]?.delta?.content ||
        parsed.choices[0]?.message?.content ||
        ''

      if (!text && !result) {
        continue
      }

      // ChatGPT Web
      if (!!parsed?.message?.content?.parts) {
        if (text.length > result.length) {
          result = text
        }
        console.log(text, '=======', result)
      } else {
        result += text
      }

      // edits don't support stream
      if (parsed.object === 'edit') {
        ended = true
        break
      }
    } catch {
      continue
    }
  }

  return {
    data: result,
    ended: ended,
  }
}

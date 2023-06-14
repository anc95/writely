import useSWR from 'swr'
import browser from 'webextension-polyfill'
import { EventName } from '../event-name'

export const useUser = () => {
  return useSWR(['user'], async () => {
    const result = await fetch('https://writely.miao-ya.com/api/user')
    const value = (await result.json()) as {
      data: {
        user: {
          email: string
        }
      }
    }

    return value
  })
}

let writely_token = ''
;(async function _getToken() {
  const setToken = async () => {
    const result = await browser.runtime.sendMessage({
      type: EventName.getToken,
    })
    writely_token = decodeURI(result)
  }

  setToken()

  setInterval(setToken, 5000)
})()

export const getToken = () => writely_token

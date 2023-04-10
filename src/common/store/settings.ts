import { useCallback, useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import browser from 'webextension-polyfill'
import { v4 as uuidv4 } from 'uuid'
import { Instruction, Settings } from '../../options/types'
import { uniqueId } from 'lodash-es'

const key = 'writingly-settings'

const _useSettings = () => {
  const [settings, _setSettings] = useState<Settings>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    refresh()
  }, [])

  const setSettings = useCallback(
    async (newSettings: Partial<Settings>) => {
      _setSettings({
        ...settings,
        ...newSettings,
      })

      browser.storage.sync.set({
        [key]: {
          ...settings,
          ...newSettings,
        },
      })
    },
    [settings]
  )

  const refresh = useCallback(async () => {
    const initSettings = async () => {
      _setSettings(await getSetting())
      setLoading(false)
    }

    initSettings()
  }, [])

  return {
    settings,
    setSettings,
    refresh,
    loading,
  }
}

const { useContainer: useSettings, Provider: SettingsProvider } =
  createContainer(_useSettings)

export { useSettings, SettingsProvider }

export const getSetting = async () => {
  const res = (await browser.storage.sync.get(key))?.[key] || {}

  if (!res.url) {
    res.url = 'https://api.openai.com/v1'
  }

  patchCustomInstructions(res)

  return res as Settings
}

export const saveSetting = async (newSettings: Partial<Settings>) => {
  const settings = await getSetting()

  browser.storage.sync.set({
    [key]: {
      ...settings,
      ...newSettings,
    },
  })
}

const patchCustomInstructions = (setting: Settings) => {
  setting.customInstructions =
    setting.customInstructions?.map((instruction) => {
      if (typeof instruction === 'string') {
        return {
          id: uniqueId(),
          name: instruction,
          instruction: instruction,
          icon: '😄',
        }
      }

      return instruction
    }) || []
}

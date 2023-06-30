import { useCallback, useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import browser from 'webextension-polyfill'
import { omit, uniqueId } from 'lodash-es'
import { ServiceProvider, Settings } from '../../options/types'

const key = 'writingly-settings'

export const defaultSetting: Settings = {
  model: 'gpt-3.5-turbo',
  url: 'https://api.openai.com/v1',
}

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

      saveSetting(newSettings)
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
  const res = {
    ...((await browser.storage.local.get(key))?.[key] || {}),
    ...((await browser.storage.sync.get(key))?.[key] || {}),
  }

  patchDefaultSetting(res)
  patchCustomInstructions(res)

  if (!res.serviceProvider) {
    res.serviceProvider = ServiceProvider.Writely
  }

  return res as Settings
}

export const saveSetting = async (newSettings: Partial<Settings>) => {
  const settings = {
    ...(await getSetting()),
    ...newSettings,
  }

  // 只有 customInstruction 存在本地
  const localNewSettings = settings.customInstructions
    ? {
        customInstructions: settings.customInstructions,
      }
    : null
  const remoteSettings = omit(settings, 'customInstructions')

  browser.storage.sync.set({
    [key]: remoteSettings,
  })

  if (localNewSettings) {
    browser.storage.local.set({ [key]: localNewSettings })
  }
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

const patchDefaultSetting = (setting: Settings) => {
  Object.keys(defaultSetting).forEach((s) => {
    if (!setting[s]) {
      setting[s] = defaultSetting[s]
    }
  })
}

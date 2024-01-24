import browser from 'webextension-polyfill'

class Storage implements StorageInterface {
  set = async (key: string, value: any): Promise<void> => {
    return await browser.storage.local.set({
      [key]: value,
    })
  }
  get = async <T>(key: string): Promise<T> => {
    return (await browser.storage.local.get(key))?.[key] as T
  }
}

export const storage = new Storage()

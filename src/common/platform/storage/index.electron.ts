import Store from 'electron-store'

const store = new Store()

export const storage = {
  set: (values: Record<string, any>) => {
    Object.keys(values).forEach((k) => {
      store.set(k, values[k])
    })
  },
  get: (key: string) => {
    return store.get(key)
  },
}

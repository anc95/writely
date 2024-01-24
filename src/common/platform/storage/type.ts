interface StorageInterface {
  set(key: string, value: any): Promise<void>
  get<T>(key: string): Promise<T>
}

export const download = (url: string, filename: string) => {
  const a = document.createElement('a') as HTMLAnchorElement
  a.href = url
  a.download = filename

  a.click()
}

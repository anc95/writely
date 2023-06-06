import useSWR from 'swr'

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

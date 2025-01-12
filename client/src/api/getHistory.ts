import { config } from 'config'
import { Word } from 'entities'

export const getHistory = async (jwt: string): Promise<Word[]> => {
  const response = await fetch(`${config.apiUrl}/user/me/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  })

  if (!response.ok) throw new Error('Http request failed')

  const data = await response.json()

  return data.results as Word[]
}

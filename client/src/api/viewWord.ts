import { config } from 'config'
import { Word } from 'entities'

export const viewWord = async (word: string, jwt: string): Promise<Word> => {
  const response = await fetch(`${config.apiUrl}/entries/en/${word}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  })

  if (!response.ok) throw new Error('Http request failed')

  const data: Word = await response.json()

  return data
}

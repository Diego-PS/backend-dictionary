import { config } from 'config'

export const addWordToFavorites = async (word: string, jwt: string) => {
  const response = await fetch(`${config.apiUrl}/entries/en/${word}/favorite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  })

  if (!response.ok) throw new Error('Http request failed')
}

import { config } from 'config'

export const removeWordFromFavorites = async (word: string, jwt: string) => {
  const response = await fetch(
    `${config.apiUrl}/entries/en/${word}/unfavorite`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  )

  if (!response.ok) throw new Error('Http request failed')
}

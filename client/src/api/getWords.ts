import { config } from 'config'

export const getWords = async (
  search: string,
  page: number,
  limit: number
): Promise<{ words: string[]; hasNext: boolean }> => {
  const response = await fetch(
    `${config.apiUrl}/entries/en?search=${search}&limit=${limit}&page=${page}`
  )

  if (!response.ok) throw new Error('Http request failed')

  const data = await response.json()

  return { words: data.results as string[], hasNext: data.hasNext as boolean }
}

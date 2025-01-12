/* eslint-disable react-hooks/exhaustive-deps */
import { api } from 'api'
import { useAuth } from 'contetxs'
import { Word } from 'entities'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Word[]>([])
  const navigate = useNavigate()
  const { jwt } = useAuth()

  const getFavorites = async () => {
    try {
      const favs = await api.getFavorites(jwt)
      setFavorites(favs)
    } catch {
      navigate('/signin')
    }
  }

  const removeWordFromFavorites = async (word: string) => {
    try {
      await api.removeWordFromFavorites(word, jwt)
      await getFavorites()
    } catch {
      navigate('/signin')
    }
  }

  useEffect(() => {
    getFavorites()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5">
      {favorites.map((word) => (
        <div key={word.word} className="flex flex-row items-center gap-2">
          <div
            className="bg-blue-100 px-3 py-2 hover:bg-blue-200 cursor-pointer"
            onClick={() => navigate(`/word/${word.word}`)}
          >
            <p>{word.word}</p>
          </div>
          <div
            className="bg-red-200 px-2 py-1 hover:bg-red-300 cursor-pointer"
            onClick={() => removeWordFromFavorites(word.word)}
          >
            <p className="text-xs">Unfavorite</p>
          </div>
        </div>
      ))}
    </div>
  )
}

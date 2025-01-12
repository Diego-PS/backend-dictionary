/* eslint-disable react-hooks/exhaustive-deps */
import { api } from 'api'
import { useAuth } from 'contetxs'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const WordPage = () => {
  const { word } = useParams()
  const { jwt } = useAuth()
  const navigate = useNavigate()

  const viewWord = async () => {
    try {
      if (word === undefined) throw new Error('Word is undefined')
      await api.viewWord(word, jwt)
    } catch {
      navigate('/signin')
    }
  }

  const addToFavorites = async () => {
    try {
      if (word === undefined) throw new Error('Word is undefined')
      await api.addWordToFavorites(word, jwt)
    } catch {
      navigate('/signin')
    }
  }

  useEffect(() => {
    viewWord()
  }, [])

  const handleClick = async () => {
    await addToFavorites()
    navigate('/favorites')
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5">
      <h1 className="text-xl font-semibold">{word}</h1>
      <div
        className="border-2 border-gray-500 bg-yellow-100 px-3 py-2 hover:bg-yellow-200 cursor-pointer"
        onClick={handleClick}
      >
        <p>Add to favorites</p>
      </div>
    </div>
  )
}

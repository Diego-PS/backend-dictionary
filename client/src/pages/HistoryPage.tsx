/* eslint-disable react-hooks/exhaustive-deps */
import { api } from 'api'
import { useAuth } from 'contetxs'
import { Word } from 'entities'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const HistoryPage = () => {
  const [history, setHistory] = useState<Word[]>([])
  const navigate = useNavigate()
  const { jwt } = useAuth()

  const getHistory = async () => {
    try {
      const hist = await api.getHistory(jwt)
      setHistory(hist)
    } catch {
      navigate('/signin')
    }
  }

  useEffect(() => {
    getHistory()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5">
      <h1>History</h1>
      {history.map((word) => (
        <div
          key={word.word}
          className="bg-blue-100 px-3 py-2 hover:bg-blue-200 cursor-pointer"
          onClick={() => navigate(`/word/${word.word}`)}
        >
          <p>{word.word}</p>
        </div>
      ))}
    </div>
  )
}

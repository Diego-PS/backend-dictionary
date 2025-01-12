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
        <p key={word.word}>{word.word}</p>
      ))}
    </div>
  )
}

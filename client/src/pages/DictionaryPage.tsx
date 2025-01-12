/* eslint-disable react-hooks/exhaustive-deps */
import { api } from 'api'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const DictionaryPage = () => {
  const [words, setWords] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState<{
    page: number
    search: string
  }>({ page: 1, search: '' })
  const navigate = useNavigate()

  const renderAfterCalled = useRef(false)

  const fetchWords = async (searchInput: { page: number; search: string }) => {
    try {
      setLoading(true)
      const { words: newWords, hasNext } = await api.getWords(
        searchInput.search,
        searchInput.page,
        limit
      )
      console.log(newWords)
      if (searchInput.page === 1) {
        setWords(newWords)
      } else {
        setWords((prevWords) => [...prevWords, ...newWords])
      }
      setHasMore(hasNext)
      setLoading(false)
    } catch {
      navigate('/signin')
    }
  }

  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchWords(searchInput)
    }

    renderAfterCalled.current = true
  }, [searchInput])

  useEffect(() => {
    setSearchInput({ page: 1, search })
  }, [search])

  useEffect(() => {
    setSearchInput((prev) => ({ ...prev, page }))
  }, [page])

  useEffect(() => {
    console.log('Updated words:', words)
  }, [words])

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 // Trigger near the bottom
    ) {
      if (!loading && hasMore) {
        setPage((prevPage) => prevPage + 1)
        renderAfterCalled.current = false
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore])

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5">
      <h1>Dictionary</h1>
      <input
        type="text"
        placeholder="Search words"
        className="w-68 border-2 border-gray-700 bg-gray-100 px-3 py-2 focus:outline-none"
        onChange={(event) => {
          setSearch(event.target.value)
          renderAfterCalled.current = false
        }}
      />
      {words.map((word) => (
        <div
          key={word}
          className="bg-blue-100 px-3 py-2 hover:bg-blue-200 cursor-pointer"
          onClick={() => navigate(`/word/${word}`)}
        >
          <p>{word}</p>
        </div>
      ))}
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more words available.</p>}
    </div>
  )
}

import { useParams } from 'react-router-dom'

export const WordPage = () => {
  const { word } = useParams()

  return <div className="flex flex-col items-center justify-center">{word}</div>
}

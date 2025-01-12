import { api } from 'api'
import { useAuth } from 'contetxs'
import { useNavigate } from 'react-router-dom'

export const SignupPage = () => {
  const { updateJwt } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    const jwt = await api.signup(
      data as { name: string; email: string; password: string }
    )
    updateJwt(jwt)
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="w-80 h-12 flex flex-row items-center justify-between gap-3">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            className="w-68 border-2 border-gray-700 bg-gray-100 px-3 py-2 focus:outline-none"
          />
        </div>
        <div className="w-80 h-12 flex flex-row items-center justify-between gap-3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            className="w-68 border-2 border-gray-700 bg-gray-100 px-3 py-2 focus:outline-none"
          />
        </div>
        <div className="w-80 h-12 flex flex-row items-center justify-between gap-3">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-68 border-2 border-gray-700 bg-gray-100 px-3 py-2 focus:outline-none"
          />
        </div>
        <div className="flex flex-col items-center mt-5">
          <button
            type="submit"
            className="w-32 h-12 bg-gray-100 hover:bg-gray-200 border-2 border-gray-700"
          >
            Signup
          </button>
        </div>
      </form>
    </div>
  )
}

import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export const Menu = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={() => navigate('/')}
          className={`border-2 border-gray-500 px-3 py-2 cursor-pointer ${
            isActive('/') ? 'bg-blue-300' : 'bg-blue-100 hover:bg-blue-200'
          }`}
        >
          <p>Dictionary</p>
        </div>
        <div
          onClick={() => navigate('/history')}
          className={`border-2 border-gray-500 px-3 py-2 cursor-pointer ${
            isActive('/history')
              ? 'bg-blue-300'
              : 'bg-blue-100 hover:bg-blue-200'
          }`}
        >
          <p>History</p>
        </div>
        <div
          onClick={() => navigate('/favorites')}
          className={`border-2 border-gray-500 px-3 py-2 cursor-pointer ${
            isActive('/favorites')
              ? 'bg-blue-300'
              : 'bg-blue-100 hover:bg-blue-200'
          }`}
        >
          <p>Favorites</p>
        </div>
        <div
          onClick={() => navigate('/signin')}
          className="border-2 border-gray-500 px-3 py-2 cursor-pointer bg-red-200 hover:bg-red-300"
        >
          <p>Signout</p>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

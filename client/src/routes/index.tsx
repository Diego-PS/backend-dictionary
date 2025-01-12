import {
  DictionaryPage,
  FavoritesPage,
  HistoryPage,
  SigninPage,
  SignupPage,
  WordPage,
} from 'pages'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <DictionaryPage />,
  },
  {
    path: '/signin',
    element: <SigninPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/favorites',
    element: <FavoritesPage />,
  },
  {
    path: '/history',
    element: <HistoryPage />,
  },
  { path: '/word/:word', element: <WordPage /> },
])

export const Router = () => <RouterProvider router={router} />

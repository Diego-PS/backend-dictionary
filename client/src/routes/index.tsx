import {
  DictionaryPage,
  FavoritesPage,
  HistoryPage,
  SigninPage,
  SignupPage,
  WordPage,
} from 'pages'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Menu } from './Menu'

const router = createBrowserRouter([
  {
    element: <Menu />,
    children: [
      {
        path: '/',
        element: <DictionaryPage />,
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
    ],
  },
  {
    path: '/signin',
    element: <SigninPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
])

export const Router = () => <RouterProvider router={router} />

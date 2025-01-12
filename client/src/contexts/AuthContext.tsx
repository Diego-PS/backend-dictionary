import { PropsWithChildren, createContext, useContext, useState } from 'react'
import { useLocalStorage } from 'hooks'

type AuthContextContent = {
  jwt: string
  updateJwt: (jwt: string) => void
}

const AuthContext = createContext<AuthContextContent>({
  jwt: '',
  updateJwt: () => {},
})

export const AuthContextProvider = (props: PropsWithChildren) => {
  const { storage } = useLocalStorage()

  const getJwt = (): string => {
    const jwt = storage.get('jwt') ?? ''
    return jwt
  }

  const [jwt, setJwt] = useState<string>(getJwt())

  const updateJwt = (jwt: string) => {
    storage.set('jwt', jwt)
    setJwt(getJwt())
  }

  return (
    <AuthContext.Provider value={{ jwt, updateJwt }}>
      {props.children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

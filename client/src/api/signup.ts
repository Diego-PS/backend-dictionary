import { config } from 'config'

export const signup = async (signupInfo: {
  name: string
  email: string
  password: string
}): Promise<string> => {
  const response = await fetch(`${config.apiUrl}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupInfo),
  })

  if (!response.ok) throw new Error('Http request failed')

  const data: { token: string } = await response.json()

  return data.token
}

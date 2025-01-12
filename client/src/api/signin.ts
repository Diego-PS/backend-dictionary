import { config } from 'config'

export const signin = async (signupInfo: {
  email: string
  password: string
}): Promise<string> => {
  const response = await fetch(`${config.apiUrl}/auth/signin`, {
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

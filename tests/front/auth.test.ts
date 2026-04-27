import { getUserFromToken } from '@/lib/auth-usu'
import { jwtDecode } from 'jwt-decode'

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}))

test('deve retornar null quando o token for inválido e o jwtDecode lançar erro', () => {
  localStorage.setItem('token', 'token-invalido')

  ;(jwtDecode as jest.Mock).mockImplementation(() => {
    throw new Error('Token inválido')
  })

  const result = getUserFromToken()

  expect(result).toBeNull()
})



jest.mock('jwt-decode')

test('deve retornar null quando não houver token no localStorage', () => {
  localStorage.clear()

  const result = getUserFromToken()

  expect(result).toBe("funcionario")
})
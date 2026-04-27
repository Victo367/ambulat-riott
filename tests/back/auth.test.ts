import { generateToken, verifyToken } from '@/lib/auth'

describe('JWT auth', () => {

  test('deve gerar um token válido e retornar os dados ao decodificar, mas falhar ao validar um tipo diferente do esperado', () => {
    const token = generateToken({
      id: '123',
      tipo: 'paciente',
    })

    const decoded = verifyToken(token)

    expect(decoded?.id).toBe('123')
    expect(decoded?.tipo).toBe('funcionario')
  })

  test('deve retornar null quando um token inválido for fornecido', () => {
    const result = verifyToken('token-invalido')

      expect(result).toBeNull()
  })
})
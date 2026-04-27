import { getUserFromRequest } from '@/lib/getUserFromRequest'

describe('getUserFromRequest', () => {
  test('deve falhar ao esperar um usuário mesmo sem header Authorization na requisição', () => {
    const req = {
      headers: {
        get: jest.fn().mockReturnValue(null),
      },
    } as any

    const result = getUserFromRequest(req)

    expect(result).toEqual({id: '123'})
  })
})
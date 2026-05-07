describe('Login e Sidebar', () => {
  it('deve mostrar menu de funcionario após login', () => {
    cy.visit('/login')

    cy.get('[data-cy="email"]').type('alicedias@gamil.com')
    cy.get('[data-cy="password"]').type('admin')
    cy.get('[data-cy="submit"]').click()



  })
})

describe('Login e Sidebar', () => {
  it('deve mostrar menu de funcionario após login', () => {
    cy.visit('/login')

    cy.get('[data-cy="email"]').type('alicedias@gamil.com',{ delay: 50 })
    cy.get('[data-cy="password"]').type('admin', { delay: 50 })
    cy.get('[data-cy="submit"]').click()

    cy.get('[data-cy="nav-pacientes"]').click()
    cy.url().should('include', '/funcionario/pacientes')

    cy.get('[data-cy="novo-paciente"]').click()

    cy.url().should('include', '/funcionario/pacientes/novo')

    // preenche o formulário
    cy.get('[data-cy="nome"]').type('João Teste', { delay: 50 })
    cy.get('[data-cy="identidade-genero"]').type('Masculino',{ delay: 50 })
    cy.get('[data-cy="data-nascimento"]').type('2000-01-01', { delay: 50 })
    cy.get('[data-cy="pronomes"]').type('Ele/Dele',{ delay: 50 })
    cy.get('[data-cy="endereco"]').type('Rua Teste',{ delay: 50 })
    cy.get('[data-cy="telefone"]').type('83999999999', { delay: 50 })
    cy.get('[data-cy="email"]').type('joao.teste@email.com', { delay: 50 })
    cy.get('[data-cy="senha"]').type('12345678',{ delay: 50 })

    // envia
    cy.get('[data-cy="submit-paciente"]').click()

    // valida que aparece na lista
    cy.contains('João Teste').should('exist')

    cy.contains('João Teste').click()
  })
})

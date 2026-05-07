describe('Fluxo completo com botões', () => {
  it('deve criar e editar paciente', () => {

    cy.visit('/login')

    cy.get('[data-cy="email"]').type('alicedias@gamil.com', { delay: 50 })
    cy.get('[data-cy="password"]').type('admin', { delay: 50 })
    cy.get('[data-cy="submit"]').click()

    // sidebar
    cy.get('[data-cy="nav-pacientes"]').should('be.visible').click()

    // novo paciente
    cy.get('[data-cy="novo-paciente"]').should('be.visible').click()

    // espera form
    cy.get('[data-cy="nome"]').should('be.visible')

    // cria paciente
    cy.get('[data-cy="nome"]').type('João Teste', { delay: 30 })
    cy.get('[data-cy="identidade-genero"]').type('Masculino', { delay: 30 })
    cy.get('[data-cy="data-nascimento"]').type('2000-01-01', { delay: 30 })
    cy.get('[data-cy="pronomes"]').type('Ele/Dele', { delay: 30 })
    cy.get('[data-cy="endereco"]').type('Rua Teste', { delay: 30 })
    cy.get('[data-cy="telefone"]').type('83999999999', { delay: 30 })
    cy.get('[data-cy="email"]').type('joao@email.com', { delay: 30 })
    cy.get('[data-cy="senha"]').type('12345678', { delay: 30 })

    cy.get('[data-cy="submit-paciente"]').click()

    // valida criação
    cy.contains('João Teste').should('exist')

    // abre paciente
    cy.contains('João Teste').click()

    // 🔥 INTERCEPTA A API ANTES DE ENTRAR NA EDIÇÃO
    cy.intercept('GET', '/api/users/*').as('getPaciente')

    // editar
    cy.get('[data-cy="editar-paciente"]').should('be.visible').click()

    // 🔥 ESPERA A API TERMINAR
    cy.wait('@getPaciente')
    cy.wait('@getPaciente')

    cy.intercept('DELETE', '/api/users/*').as('deletePaciente')

    cy.get('[data-cy="deletar"]').should('be.visible').click()

    // 🔥 espera delete terminar
    cy.wait('@deletePaciente')

    // 🔥 espera redirecionamento/DOM estabilizar
    cy.url().should('not.include', '/editar')
    // CRIAR FUNCIONARIO
    
    // agora sim navega
    cy.get('[data-cy="nav-perfil"]').should('be.visible').click()
    cy.get('[data-cy="logout"]').should('be.visible').click()
  })
})

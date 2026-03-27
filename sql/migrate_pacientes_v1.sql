-- Se já existir tabela `pacientes` sem a coluna `sexo`, execute uma vez no MySQL:

ALTER TABLE pacientes
  ADD COLUMN sexo ENUM('M', 'F', 'O') NULL AFTER data_nascimento;

-- Se der erro de coluna duplicada, ignore (já está migrado).

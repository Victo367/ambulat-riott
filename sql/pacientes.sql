-- Tabela de pacientes do ambulatório (execute no MySQL apontado por MYSQL_*)
CREATE TABLE IF NOT EXISTS pacientes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NULL,
  data_nascimento DATE NULL,
  sexo ENUM('M', 'F', 'O') NULL,
  telefone VARCHAR(40) NULL,
  email VARCHAR(255) NULL,
  endereco TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pacientes_cpf (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

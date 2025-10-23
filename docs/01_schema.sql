-- Tabelas básicas
CREATE TABLE paciente (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL,
  cpf           VARCHAR(14) UNIQUE NOT NULL,
  nascimento    DATE NOT NULL,
  sexo          CHAR(1) CHECK (sexo IN ('M','F','O')),
  telefone      VARCHAR(40),
  email         VARCHAR(120),
  observacoes   TEXT
);

CREATE TABLE medico (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL,
  crm           VARCHAR(20) UNIQUE NOT NULL,
  telefone      VARCHAR(40),
  email         VARCHAR(120)
);

CREATE TABLE especialidade (
  id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE medico_especialidade (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  medico_id BIGINT NOT NULL REFERENCES medico(id) ON DELETE CASCADE,
  especialidade_id BIGINT NOT NULL REFERENCES especialidade(id) ON DELETE RESTRICT,
  UNIQUE (medico_id, especialidade_id)
);

CREATE TABLE consulta (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  paciente_id BIGINT NOT NULL REFERENCES paciente(id) ON DELETE CASCADE,
  medico_id   BIGINT NOT NULL REFERENCES medico(id)   ON DELETE RESTRICT,
  data_hora   TIMESTAMP NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'AGENDADA',
  motivo      VARCHAR(240)
);

CREATE TABLE exame (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  consulta_id BIGINT NOT NULL REFERENCES consulta(id) ON DELETE CASCADE,
  tipo        VARCHAR(80) NOT NULL,
  resultado_texto TEXT
);

CREATE TABLE leito (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ala   VARCHAR(40) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  ocupado BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(ala, numero)
);

CREATE TABLE internacao (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  paciente_id BIGINT NOT NULL REFERENCES paciente(id) ON DELETE CASCADE,
  leito_id    BIGINT NOT NULL REFERENCES leito(id)    ON DELETE RESTRICT,
  entrada     TIMESTAMP NOT NULL,
  alta        TIMESTAMP
);

CREATE TABLE prescricao (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  consulta_id BIGINT NOT NULL REFERENCES consulta(id) ON DELETE CASCADE,
  texto       TEXT NOT NULL
);

-- BLOB binário exigido pelo trabalho
CREATE TABLE arquivo_clinico (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  paciente_id BIGINT NOT NULL REFERENCES paciente(id) ON DELETE CASCADE,
  nome_arquivo VARCHAR(180) NOT NULL,
  mime_type    VARCHAR(80) NOT NULL,
  conteudo     BYTEA NOT NULL,
  criado_em    TIMESTAMP NOT NULL DEFAULT now()
);
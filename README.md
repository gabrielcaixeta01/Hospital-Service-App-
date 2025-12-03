# Hospital Front-End

Aplicação front-end desenvolvida em Next.js para o sistema de gestão hospitalar.  
Interface moderna, responsiva e integrada à API REST do back-end.


## Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## Instalação

```
npm install
```

ou

```
yarn install
```

## Executar Ambiente de Desenvolvimento

```
npm run dev
```

## Build de Produção

```
npm run build
npm start
```

## Estrutura das Principais Páginas

- `/login` – autenticação do usuário
- `/registro` – criação de conta
- `/dashboard` – visão geral do sistema
- `/pacientes` – CRUD de pacientes
- `/medicos` – cadastro e gerenciamento de médicos
- `/consultas` – agendamento e gerenciamento
- `/internacoes` – controle de internações e alta
- `/leitos` – gestão de ocupação e manutenção de leitos
- `/relatorios` – consultas e estatísticas

## Scripts Disponíveis

```
npm run dev     # ambiente de desenvolvimento
npm run build   # gera build
npm run start   # inicia produção
```

## Variáveis de Ambiente

- `NEXT_PUBLIC_API_URL` – URL base da API


## Estilo e UI

- Layout responsivo com Tailwind
- Componentes reutilizáveis (cards, tabela, navbar moderna)


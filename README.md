# Hospital Service App — Frontend

Aplicação web para gestão hospitalar construída com Next.js (App Router), TypeScript e Tailwind CSS. Inclui CRUD de Pacientes, Médicos, Consultas e Internações, relatórios simples e rotas de API mockadas para desenvolvimento local.

> Status (22/10/2025): MVP funcional com CRUD completo para consultas, pacientes e médicos; internações e relatórios básicos; autenticação pública simples. Uploads por paciente em progresso.

## ✨ Funcionalidades

- Autenticação (pública): login e registro básicos
- Dashboard com atalhos principais
- Pacientes: listar, criar, editar e excluir
- Médicos: listar, criar, editar e excluir
- Consultas: agendar (novo), visualizar, editar, cancelar/excluir
- Internações: listar, criar e editar
- Relatórios: agenda do médico e leitos (estático)
- Uploads: página por paciente (estrutura criada)
- API mock local em `/api/*` para desenvolvimento

## 🧱 Tecnologias

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- ESLint e eslint-config-next
- React Icons

## 🗂️ Estrutura de pastas (principal)

```
src/app
	(publico)/
		login/
		registro/
	(protected)/
		dashboard/
		pacientes/
			page.tsx        # lista
			novo/           # criação
			[id]/           # detalhe/edição
			components/
		medicos/
			page.tsx
			novo/
			[id]/
			components/
		consultas/
			page.tsx
			novo/
			[id]/
		internacoes/
			page.tsx
			novo/
			[id]/
			components/
		relatorios/
			page.tsx
			agenda-medico/
			leitos/
		uploads/
			[pacientId]/
	api/
		pacientes/ (GET, POST)
		pacientes/[id]/ (GET, PUT, DELETE)
		medicos/ e medicos/[id]/
		consultas/ e consultas/[id]/
		internacoes/ e internacoes/[id]/
```

## 🚀 Como rodar localmente

1. Instale as dependências: `npm install`
2. Ambiente de desenvolvimento: `npm run dev`
3. Acesse em: http://localhost:3000

Build e produção:

- Build: `npm run build`
- Produção: `npm start` (após o build)

Scripts disponíveis:

- `dev` — inicia o servidor de desenvolvimento
- `build` — gera o build de produção
- `start` — inicia o servidor com o build gerado
- `lint` — executa o ESLint

## 🔌 API Mock (desenvolvimento)

As rotas em `src/app/api/*` simulam persistência em memória durante a sessão de desenvolvimento. Disponível para recursos:

- Pacientes: `/api/pacientes`, `/api/pacientes/[id]`
- Médicos: `/api/medicos`, `/api/medicos/[id]`
- Consultas: `/api/consultas`, `/api/consultas/[id]`
- Internações: `/api/internacoes`, `/api/internacoes/[id]`

Operações suportadas (por recurso):

- GET (lista e por id)
- POST (criação, nas coleções)
- PUT (atualização, por id)
- DELETE (exclusão, por id)

> Observação: como os dados vivem em memória, qualquer reinício do servidor de desenvolvimento reseta o estado.

### 🔗 Integração com Backend (futuro)

Todos os arquivos de API e páginas client já possuem código **comentado** mostrando como fazer a integração direta com um backend real:

1. **Crie um arquivo `.env.local`** na raiz do projeto com as variáveis de ambiente:

```bash
API_URL=http://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. **Descomente os blocos** nos arquivos:

   - **API Routes** (`src/app/api/*/route.ts`): substituem mocks por proxy para o backend.
   - **Client Pages** (ex: `src/app/(protected)/pacientes/[id]/page.tsx`): fazem fetch direto ao backend com `NEXT_PUBLIC_API_URL` e tokens (localStorage/cookies).

3. **Autenticação**: os exemplos incluem padrões para adicionar `Authorization: Bearer <token>` nos headers quando disponível.

Veja o arquivo `.env.example` para referência de variáveis de ambiente.

## 🔐 Rotas

- Público: `(publico)/login`, `(publico)/registro`
- Protegido: `(protected)/*` — dashboard, pacientes, médicos, consultas, internações, relatórios, uploads

## 📝 Convenções

- Linguagem: TypeScript
- UI: Tailwind CSS (classes utilitárias)
- App Router (diretório `app`), componentes client quando necessário (hooks)
- Padrão de fetch: tenta `/api/*` e pode fazer fallback para mocks locais quando aplicável

## 🛣️ Próximos passos (roadmap)

- Finalizar módulo de uploads por paciente (UI + integração)
- Melhorar autenticação (tokens e proteção real de rotas)
- Validações e máscaras (telefone, CRM, etc.)
- Testes (unitários e e2e)
- Integração com API real e remoção gradativa dos mocks

---

Se tiver dúvidas ou sugestões, abra uma issue ou envie um PR. 😊

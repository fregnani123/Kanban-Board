# FlowBoard Pro

Kanban comercial feito com NestJS, TypeORM, SQLite e frontend em HTML/CSS/JavaScript puro.

## Funcionalidades

- Quadro Kanban com drag and drop entre A fazer, Em andamento e Concluidas.
- Criacao rapida de tarefas.
- Modal completo para criar e editar titulo, descricao, responsavel, prioridade, prazo e status.
- Busca por titulo, descricao ou responsavel.
- Filtro por prioridade e ordenacao por data, prazo ou prioridade.
- Indicadores de total, tarefas em andamento, concluidas e atrasadas.
- Persistencia em SQLite.
- Layout responsivo com visual mais proximo de um produto SaaS.

## Como executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build de producao

```bash
npm run build
npm start
```

## API

- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

Exemplo:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Preparar proposta","description":"Enviar versao final","priority":"high","assignee":"Fabiano"}'
```

## Campos da tarefa

- `id`
- `title`
- `description`
- `assignee`
- `priority`: `low`, `medium` ou `high`
- `dueDate`
- `status`: `todo`, `in-progress` ou `completed`
- `createdAt`
- `updatedAt`

## Proximos passos para vender

- Autenticacao e multiusuario.
- Workspaces por cliente ou empresa.
- Planos, limite por uso e assinatura.
- Convites de equipe e permissoes.
- Exportacao de relatorios.
- Testes automatizados e pipeline de deploy.

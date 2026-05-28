# 📋 Kanban Board - NestJS + SQLite3

Um aplicativo de Kanban completo e responsivo com drag-and-drop para gerenciar tarefas, construído com NestJS no backend e vanilla JavaScript no frontend, com persistência de dados em SQLite3.

## Funcionalidades

- ✅ **Drag and Drop**: Mova tarefas entre três colunas (Nova Tarefa, Em Andamento, Concluída)
- 💾 **Persistência de Dados**: Todas as tarefas são salvas automaticamente em banco de dados SQLite3
- 📱 **Responsivo**: Interface otimizada para desktop, tablet e mobile
- ⚡ **Rápido**: Carregamento instantâneo com sincronização em tempo real
- 🎨 **Design Moderno**: Interface com gradientes e animações suaves
- 🔄 **Atualização em Tempo Real**: Mudanças salvas automaticamente

## 🛠️ Tecnologias Utilizadas

### Backend
- **NestJS**: Framework moderno para Node.js
- **TypeORM**: ORM para gerenciar banco de dados
- **SQLite3**: Banco de dados leve e sem dependências
- **TypeScript**: Tipagem estática

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilo responsivo com Flexbox e Grid
- **Vanilla JavaScript**: Sem dependências de framework
- **Drag and Drop API**: Nativa do navegador

## 📋 Pré-requisitos

- Node.js >= 16.0.0
- npm >= 8.0.0

## 🚀 Como Executar

### 1. Instalar Dependências

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

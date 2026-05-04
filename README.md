# 📋 Kanban Board - NestJS + SQLite3

Um aplicativo de Kanban completo e responsivo com drag-and-drop para gerenciar tarefas, construído com NestJS no backend e vanilla JavaScript no frontend, com persistência de dados em SQLite3.

---

## 📸 Demonstração

O **Kanban Board** oferece uma interface limpa para o gerenciamento ágil de tarefas.

![Kanban Board](./public/screenshots/kanban-demo.png](https://github.com/fregnani123/Kanban-Board/blob/main/public/Captura%20de%20tela%202026-05-04%20104419.png))

> [!IMPORTANT]
> **Status do Projeto:** Este projeto é estritamente para fins de **estudo e portfólio**. Ele **não está em produção** e deve ser executado apenas em ambiente de desenvolvimento local para testes das funcionalidades de NestJS e SQLite3.

---

## 🎯 Funcionalidades

- ✅ **Drag and Drop**: Mova tarefas entre três colunas (Nova Tarefa, Em Andamento, Concluída).
- 💾 **Persistência de Dados**: Todas as tarefas são salvas automaticamente em banco de dados SQLite3.
- 📱 **Responsivo**: Interface otimizada para desktop, tablet e mobile.
- ⚡ **Rápido**: Carregamento instantâneo com sincronização em tempo real.
- 🎨 **Design Moderno**: Interface com gradientes e animações suaves.
- 🔄 **Atualização em Tempo Real**: Mudanças salvas automaticamente.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **NestJS**: Framework moderno para Node.js.
- **TypeORM**: ORM para gerenciar banco de dados.
- **SQLite3**: Banco de dados leve e sem dependências.
- **TypeScript**: Tipagem estática.

### Frontend
- **HTML5**: Estrutura semântica.
- **CSS3**: Estilo responsivo com Flexbox e Grid.
- **Vanilla JavaScript**: Sem dependências de framework.
- **Drag and Drop API**: Nativa do navegador.

---

## 📋 Pré-requisitos

- Node.js >= 16.0.0
- npm >= 8.0.0

---

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Modo Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`

### 3. Construir para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
estudar-node/
├── src/
│   ├── task/
│   │   ├── entities/
│   │   │   └── task.entity.ts
│   │   ├── dto/
│   │   │   └── task.dto.ts
│   │   ├── task.controller.ts
│   │   ├── task.service.ts
│   │   └── task.module.ts
│   ├── app.module.ts
│   └── main.ts
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── database/
│   └── kanban.db (criado automaticamente)
├── package.json
├── tsconfig.json
└── README.md
```

## 🎮 Como Usar

1. **Criar Nova Tarefa**: Digite o nome da tarefa no input e clique em "Adicionar" (ou pressione Enter)
2. **Mover Tarefas**: Clique e arraste uma tarefa para outra coluna
3. **Deletar Tarefa**: Clique no botão 🗑️ na tarefa
4. **Persistência**: Todas as mudanças são automaticamente salvas no banco de dados

## 🔌 API Endpoints

### Tarefas
- `GET /api/tasks` - Listar todas as tarefas
- `POST /api/tasks` - Criar nova tarefa
- `GET /api/tasks/:id` - Obter tarefa específica
- `PATCH /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

### Exemplo de Requisição POST
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Minha Nova Tarefa","description":""}'
```

## 💾 Banco de Dados

### Tabela: task
```sql
- id (UUID, Primary Key)
- title (String, Obrigatório)
- description (String, Opcional)
- status (String: 'todo' | 'in-progress' | 'completed')
- createdAt (DateTime)
- updatedAt (DateTime)
```

O banco de dados é criado automaticamente na primeira execução em `database/kanban.db`.

## 🎨 Personalizações

### Alterar Cores
Edite `public/styles.css` e mude os valores de `background` e `color` das classes:
- `.header` - Cabeçalho
- `.board-column` - Colunas
- `.task-card` - Cards de tarefas

### Alterar Port
Edite `src/main.ts` e mude o número da porta em `app.listen(3000)`

### Adicionar Mais Colunas
1. Edite `src/task/entities/task.entity.ts` para adicionar novo status
2. Adicione coluna HTML em `public/index.html`
3. Atualize `public/app.js` para renderizar a nova coluna

## 📱 Recursos Responsivos

A aplicação se adapta automaticamente para:
- 📺 Desktop (3 colunas lado a lado)
- 📱 Tablet (2-3 colunas)
- 📱 Mobile (1 coluna com scroll)

## 🐛 Troubleshooting

### Banco de dados não está sendo criado
- Verifique se a pasta `database/` existe e tem permissões de escrita
- Delete `database/kanban.db` e reinicie a aplicação

### Portas já em uso
- Mude a porta em `src/main.ts`
- Ou finalize o processo usando a porta 3000

### Tarefas não sincronizam
- Verifique o console do navegador (F12) para erros
- Verifique se o servidor está rodando
- Tente recarregar a página (Ctrl+R ou Cmd+R)

## 📝 Licença

MIT

## 👨‍💻 Autor

Desenvolvido com ❤️ usando NestJS e SQLite3

---

**Dica**: As tarefas são persistidas em banco de dados SQLite3, então você pode fechar e reabrir a aplicação que elas continuarão lá! 💾✨

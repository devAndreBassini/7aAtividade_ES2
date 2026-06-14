# Sistema Web para Clínica Médica

Projeto desenvolvido para o **Trabalho 7 de Engenharia de Software**.

O sistema implementa uma aplicação web simples para uma clínica médica, contendo:

- Cadastro de pacientes;
- Cadastro de médicos;
- Cadastro de especialidades;
- Agendamento de consultas;
- Consulta de agenda por médico;
- Registro de status da consulta;
- Relatórios simples.

## Tecnologias usadas

- Node.js
- Express
- SQLite
- HTML
- CSS
- JavaScript

## Como executar

### 1. Instalar o Node.js

Baixe e instale o Node.js em:

https://nodejs.org

### 2. Instalar as dependências

Abra a pasta do projeto no terminal e execute:

```bash
npm install
```

### 3. Iniciar o sistema

```bash
npm start
```

### 4. Acessar no navegador

Abra:

```text
http://localhost:3000
```

## Estrutura do projeto

```text
sistema_clinica_scrumwise/
├── server.js
├── database.js
├── package.json
├── README.md
├── data/
│   └── clinica.db
└── public/
    ├── index.html
    ├── pacientes.html
    ├── medicos.html
    ├── especialidades.html
    ├── agendamentos.html
    ├── agenda.html
    ├── relatorios.html
    ├── css/
    │   └── style.css
    └── js/
        ├── api.js
        ├── pacientes.js
        ├── medicos.js
        ├── especialidades.js
        ├── agendamentos.js
        ├── agenda.js
        └── relatorios.js
```

## Observação

O banco de dados SQLite é criado automaticamente na primeira execução.


## Deploy no Render

Configurações recomendadas:

```text
Build Command: npm install
Start Command: npm start
Environment: Node
NODE_VERSION: 20
```

O arquivo `database.js` cria automaticamente a pasta `data/` antes de abrir o banco SQLite. Isso evita o erro:

```text
Cannot open database because the directory does not exist
```

Observação: no plano gratuito do Render, o banco SQLite pode ser perdido em novos deploys ou reinicializações, pois o armazenamento local não é permanente. Para um trabalho acadêmico/demonstração, funciona. Para uso real, o ideal seria usar PostgreSQL.

<h1 align="center"> Backend - Fogazza</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Flask-2.3-000000?logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/SQLAlchemy-2.x-D71F00?logo=sqlalchemy&logoColor=white" alt="SQLAlchemy" />
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white" alt="Python" />
</p>

Este documento detalha a arquitetura e o funcionamento interno do backend da aplicação Fogazza.

## 1. Visão técnica rápida

O backend foi estruturado em camadas para separar responsabilidades:

- **Route**: recebe requisições HTTP, extrai payload e devolve resposta.
- **Service**: concentra regras de negócio.
- **Repository**: acessa banco com SQLAlchemy.
- **Model**: define entidades/tabelas.
- **DB**: configura engine, sessão e inicialização do schema.

Fluxo padrão:

```text
Cliente -> Route -> Service -> Repository -> MySQL
```

## 2. Estrutura do backend

```text
back/
  app_fast.py                     # Entrada principal em produção local
  app.py                          # Entrada alternativa (debug)
  db/db.py                        # Engine SQLAlchemy + SessionFactory
  enums/tipo_cliente.py           # Enum de tipos de cliente
  model/fogazza.py                # Modelo Fogazza
  model/atendimento.py            # Modelo Atendimento + item de associação
  repository/fogazza_repository.py
  repository/atendimento_repository.py
  service/fogazza_service.py
  service/atendimento_service.py
  route/fogazza_route.py
  route/atendimento_route.py
```

## 3. Boot da API

### app_fast.py

- Sobe Flask em `127.0.0.1:5000`
- `debug=False`
- `threaded=True`
- Registra blueprints de fogazza e atendimento
- CORS habilitado

Comando:

```powershell
cd back
.\.venv\Scripts\Activate.ps1
python app_fast.py
```

## 4. Banco de dados e sessão

Arquivo: `db/db.py`

- Lê `SENHA_BD` do `.env`
- Monta URL com:
  - usuário: `root`
  - host: `localhost`
  - database: `fogazza`
- Cria `engine` com pool:
  - `pool_size=20`
  - `max_overflow=40`
  - `pool_pre_ping=True`
  - `pool_timeout=30`
- Expõe `SessionFactory` para abrir sessões por request
- Executa `Base.metadata.create_all(engine)` ao carregar módulo

## 5. Modelo de domínio

### Fogazza (`model/fogazza.py`)

Campos:

- `id_fogazza` (PK)
- `nome_fogazza` (string)
- `preco_fogazza` (float)
- `ativo` (bool)

### Atendimento (`model/atendimento.py`)

Campos:

- `id_atendimento` (PK)
- `tipo_cliente` (`Enum(TipoCliente)`)
- `preco_total` (float)
- `comprado_em` (datetime)
- `viagem` (bool)
- `ativo` (bool)

### Itens do atendimento (`AtendimentoFogazza`)

Tabela de associação com chave composta:

- `id_atendimento` (FK)
- `id_fogazza` (FK)
- `quantidade`

## 6. Regras de negócio principais

### Atendimento

- O preço total é a soma de `preco_fogazza * quantidade` dos itens.
- Se `tipo_cliente == EQUIPE`, o `preco_total` é forçado para `0`.
- `adicionar-massa` reaproveita a lógica de `adicionar_atendimento`.
- Remoção é lógica (`ativo = False`), não delete físico.
- Filtros suportam paginação e ordenação.

### Fogazza

- Cadastro simples com nome e preço.
- Listagem retorna apenas ativas.
- Remoção também é lógica (`ativo = False`).

## 7. Endpoints e responsabilidades

### Módulo Fogazza

- `POST /fogazza/adicionar`
- `GET /fogazza/listar`
- `DELETE /fogazza/remover`

### Módulo Atendimento

- `POST /atendimento/adicionar`
- `POST /atendimento/adicionar-massa`
- `GET /atendimento/listar`
- `POST /atendimento/filtrar`
- `PUT /atendimento/atualizar`
- `DELETE /atendimento/remover`
- `POST /atendimento/imprimir`
- `POST /atendimento/imprimir-relatorio`
- `POST /atendimento/imprimir-relatorio-agregado`

Referência de payloads e exemplos de resposta:

- `back/README.md`

## 8. Relatórios e impressão

### Excel

Em `AtendimentoService`:

- `imprimir_relatorio`: gera planilha detalhada e agrupada
- `imprimir_relatorio_agregado`: gera visão agregada de vendas por hora

Tecnologias usadas:

- `pandas`
- `openpyxl` / `xlsxwriter` (via `ExcelWriter`)

### Impressão térmica

`imprimir_atendimento` usa `python-escpos` com `Usb(0x0FE6, 0x811E, 0)`.

Importante:

- IDs USB estão fixos no código
- Em outro hardware pode ser necessário ajustar Vendor ID / Product ID

## 9. Padrão de tratamento de erros

Nas rotas:

- `try/except/finally` por endpoint
- Em erro retorna `{"erro": "mensagem"}` com status `400`
- Sessão é sempre fechada no `finally`

Nos repositórios:

- Operações com commit usam rollback em exceção

## 10. Convenções atuais

- Soft delete com campo `ativo`
- Sessão por request (instanciada em cada rota)
- Serialização de resposta feita principalmente no service/route
- Datas de resposta no formato `%Y-%m-%d %H:%M:%S`

## 11. Como evoluir o backend (roteiro prático)

### Adicionar nova funcionalidade

1. Criar/ajustar método em `repository`.
2. Implementar regra no `service`.
3. Expor endpoint em `route`.
4. Validar payload e respostas.
5. Atualizar documentação em `back/README.md` e neste arquivo.

### Melhorias recomendadas

- Adicionar validação de payload (ex.: Pydantic/Marshmallow).
- Padronizar DTO de erro e códigos HTTP (400/404/422/500).
- Centralizar tratamento de exceções com handlers Flask.
- Criar suíte de testes (service + integração de rotas).
- Externalizar configurações de impressora para `.env`.

## 12. Operação local

- API local: `http://127.0.0.1:5000`
- Frontend local (Vite): `http://localhost:5173`
- Variável obrigatória em `back/.env`:

```env
SENHA_BD=sua_senha_root_mysql
```

---

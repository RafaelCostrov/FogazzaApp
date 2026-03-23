# API Fogazza

## Base URL

- Desenvolvimento local: `http://127.0.0.1:5000`

## Fogazza

### `POST /fogazza/adicionar`

Adiciona uma nova fogazza.

**Recebe:**
```json
{
    "nome_fogazza": "Calabresa",
    "preco_fogazza": 15.0
}
```

**Resposta (201):**
```json
{
    "mensagem": "Fogazza adicionada com sucesso!",
    "fogazza": {
        "id_fogazza": 1,
        "nome_fogazza": "Calabresa",
        "preco_fogazza": 15.0,
        "ativo": true
    }
}
```

---

### `GET /fogazza/listar`

Lista todas as fogazzas ativas.

**Resposta (200):**
```json
[
    {
        "id_fogazza": 1,
        "nome_fogazza": "Calabresa",
        "preco_fogazza": 15.0,
        "ativo": true
    }
]
```

---

### `DELETE /fogazza/remover`

Remove (inativa) uma fogazza pelo ID.

**Recebe:**
```json
{
    "id_fogazza": 1
}
```

**Resposta (200):**
```json
{
    "mensagem": "Fogazza removida com sucesso!"
}
```

---

## Atendimento

Notas:
- `tipo_cliente` deve ser enviado em maiúsculo: `EQUIPE`, `VISITANTE`, `VOLUNTARIO`.
- Se `tipo_cliente` for `EQUIPE`, o `preco_total` do atendimento fica `0`.

### `POST /atendimento/adicionar`

Adiciona um atendimento.

**Recebe:**
```json
{
    "tipo_cliente": "VISITANTE",
    "fogazzas": [
        { "id_fogazza": 1, "quantidade": 2 }
    ],
    "viagem": false
}
```

**Resposta (201):**
```json
{
    "id_atendimento": 1,
    "tipo_cliente": "VISITANTE",
    "preco_total": 30.0,
    "comprado_em": "2026-02-19 14:30:00",
    "viagem": false,
    "ativo": true,
    "itens": [
        {
            "id_fogazza": 1,
            "quantidade": 2,
            "preco_fogazza": 15.0
        }
    ]
}
```

---

### `POST /atendimento/adicionar-massa`

Adiciona vários atendimentos de uma vez.

**Recebe:**
```json
{
    "atendimentos": [
        {
            "tipo_cliente": "VISITANTE",
            "fogazzas": [
                { "id_fogazza": 1, "quantidade": 2 }
            ],
            "viagem": false,
            "comprado_em": "2026-02-19 14:30:00"
        }
    ]
}
```

**Resposta (201):**
```json
[
    {
        "id_atendimento": 1,
        "tipo_cliente": "VISITANTE",
        "preco_total": 30.0,
        "comprado_em": "2026-02-19 14:30:00",
        "viagem": false,
        "ativo": true,
        "itens": [
            {
                "id_fogazza": 1,
                "quantidade": 2,
                "preco_fogazza": 15.0
            }
        ]
    }
]
```

---

### `GET /atendimento/listar`

Lista atendimentos ativos.

**Resposta (200):**
```json
[
    {
        "id_atendimento": 1,
        "tipo_cliente": "VISITANTE",
        "preco_total": 30.0,
        "comprado_em": "2026-02-19 14:30:00",
        "itens": [
            { "id_fogazza": 1, "quantidade": 2 }
        ]
    }
]
```

---

### `POST /atendimento/filtrar`

Filtra atendimentos com paginação e ordenação (campos opcionais).

**Recebe:**
```json
{
    "id_atendimento": [1, 3],
    "id_fogazzas": [1, 2],
    "tipo_cliente": ["VISITANTE", "EQUIPE"],
    "preco_min": 10.0,
    "preco_max": 100.0,
    "data_hora_min": "2025-01-01 00:00:00",
    "data_hora_max": "2026-12-31 23:59:59",
    "pagina": 1,
    "limit": 50,
    "order_by": "comprado_em",
    "order_dir": "desc"
}
```

**Resposta (200):**
```json
{
    "atendimentos": [
        {
            "id_atendimento": 1,
            "tipo_cliente": "VISITANTE",
            "preco_total": 30.0,
            "comprado_em": "2026-02-19 14:30:00",
            "ativo": true,
            "itens": [
                { "id_fogazza": 1, "quantidade": 2, "preco_fogazza": 15.0 }
            ]
        }
    ],
    "total": 100,
    "total_filtrado": 1,
    "valor_total": 30.0
}
```

---

### `PUT /atendimento/atualizar`

Atualiza um atendimento.

**Recebe:**
```json
{
    "id_atendimento": 1,
    "tipo_cliente": "EQUIPE",
    "fogazzas": [
        { "id_fogazza": 1, "quantidade": 3 }
    ]
}
```

**Resposta (200):**
```json
{ "mensagem": "Atendimento atualizado com sucesso!" }
```

---

### `DELETE /atendimento/remover`

Remove (inativa) um atendimento.

**Recebe:**
```json
{ "id_atendimento": 1 }
```

**Resposta (200):**
```json
{ "mensagem": "Atendimento removido com sucesso!" }
```

---

### `POST /atendimento/imprimir`

Imprime recibo de um atendimento na impressora térmica.

**Recebe:**
```json
{
    "id_atendimento": 1,
    "via": 1
}
```

`via` é opcional (usado para indicar via 1/2 no cupom).

**Resposta (200):**
```json
{ "mensagem": "Recibo impresso com sucesso!" }
```

---

### `POST /atendimento/imprimir-relatorio`

Gera e retorna um arquivo Excel com relatório detalhado/agrupado dos atendimentos filtrados.

**Recebe:**
```json
{
    "id_atendimento": [1, 3],
    "id_fogazzas": [1, 2],
    "tipo_cliente": ["VISITANTE"],
    "preco_min": 10.0,
    "preco_max": 100.0,
    "data_hora_min": "2025-01-01 00:00:00",
    "data_hora_max": "2026-12-31 23:59:59"
}
```

**Resposta (200):**
- Download de arquivo `.xlsx` (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).

---

### `POST /atendimento/imprimir-relatorio-agregado`

Gera e retorna um relatório agregado de vendas por hora em Excel.

**Recebe:**
```json
{
    "data_1": "2026-02-19",
    "data_2": "2026-02-20",
    "missa_11_1": true,
    "missa_11_2": false,
    "missa_17_1": true,
    "missa_17_2": false
}
```

**Resposta (200):**
- Download de arquivo `.xlsx` (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).

---

## Erros

Em caso de erro, as rotas retornam:

```json
{ "erro": "mensagem de erro" }
```

com status HTTP `400`.

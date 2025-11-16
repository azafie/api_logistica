# **Documentação da API – EstoqueMovimentacao**

## **Índice**

1. [Introdução](#introducao)
2. [Descrição Geral](#descricao-geral)
3. [Modelo Relacionado](#modelo-relacionado)
4. [Endpoints da API](#endpoints-da-api)

   * [1. Criar Movimentação (CREATE)](#criar)
   * [2. Listar Movimentações (READ ALL)](#listar)
   * [3. Buscar Movimentação por ID (READ ONE)](#buscar-id)
   * [4. Atualizar Movimentação (UPDATE)](#update)
   * [5. Deletar Movimentação (DELETE)](#delete)
   * [6. Buscar Movimentações por Termo (SEARCH)](#search)
5. [Erros Comuns](#erros-comuns)
6. [Observações Importantes](#observacoes)

---

<a name="introducao"></a>

## **1. Introdução**

Esta documentação descreve detalhadamente os endpoints relacionados ao controle de movimentações de estoque do sistema. Serve como referência futura para desenvolvimento, manutenção e integração com outros módulos.

---

<a name="descricao-geral"></a>

## **2. Descrição Geral**

A API de **movimentações de estoque** permite:

* Criar, consultar, atualizar e deletar movimentações.
* Pesquisar movimentações usando termos livres.
* Controlar entradas e saídas de produtos.

Cada movimentação possui:

* **data** – data da movimentação.
* **tipo** – entrada ou saída.
* **produto** – nome ou identificação do item.
* **quantidade** – quantidade movimentada.
* **usuario_origem** – quem realizou ou originou a movimentação.
* **observacoes** – informações adicionais.

---

<a name="modelo-relacionado"></a>

## **3. Modelo Relacionado**

O controller utiliza o model `EstoqueMovimentacao`, responsável por persistir os dados no banco.

Principais campos esperados:

* `data`
* `tipo`
* `produto`
* `quantidade`
* `usuario_origem`
* `observacoes`
* `created_at`

---

<a name="endpoints-da-api"></a>

## **4. Endpoints da API**

A seguir, cada rota é detalhada com funcionalidade, parâmetros e respostas.

---

<a name="criar"></a>

### **4.1 Criar Movimentação – (POST /estoque)**

Cria uma nova movimentação de estoque.

#### **Body esperado (JSON):**

```
{
  "data": "2025-01-01",
  "tipo": "entrada",
  "produto": "Teclado",
  "quantidade": 10,
  "usuario_origem": "João",
  "observacoes": "Reposição de estoque"
}
```

#### **Resposta de sucesso – 201:**

Retorna o objeto recém-criado.

#### **Erros possíveis:**

* 400 – erro de validação.

---

<a name="listar"></a>

### **4.2 Listar Movimentações – (GET /estoque)**

Retorna todas as movimentações cadastradas.

#### **Resposta de sucesso – 200:**

```
{
  "movimentacoes": [ ... ],
  "total": 25
}
```

Ordenação padrão:

* data DESC
* created_at DESC

---

<a name="buscar-id"></a>

### **4.3 Buscar Movimentação por ID – (GET /estoque/:id)**

Retorna uma única movimentação.

#### **Resposta de sucesso – 200:**

Objeto da movimentação.

#### **Erros possíveis:**

* 404 – movimentação não encontrada.

---

<a name="update"></a>

### **4.4 Atualizar Movimentação – (PUT /estoque/:id)**

Atualiza uma movimentação existente.

#### **Body exemplo:**

```
{
  "produto": "Monitor",
  "quantidade": 3
}
```

#### **Resposta de sucesso – 200:**

Objeto atualizado.

#### **Erros possíveis:**

* 404 – movimentação não existe.
* 400 – erro de validação.

---

<a name="delete"></a>

### **4.5 Deletar Movimentação – (DELETE /estoque/:id)**

Remove uma movimentação.

#### **Resposta de sucesso – 204:**

Sem retorno.

#### **Erros possíveis:**

* 404 – movimentação não existe.

---

<a name="search"></a>

### **4.6 Buscar Movimentações por Termo – (GET /estoque/search/:term)**

Pesquisa movimentações usando palavras-chave.

Campos pesquisados:

* produto
* usuario_origem
* observacoes

Busca com `iLike` (case insensitive).

#### **Resposta exemplo – 200:**

```
{
  "movimentacoes": [ ... ],
  "total": 4,
  "searchTerm": "teclado"
}
```

---

<a name="erros-comuns"></a>

## **5. Erros Comuns**

* **500** – falha interna do servidor ou erro inesperado.
* **400** – dados enviados inválidos.
* **404** – registro não encontrado.

---

<a name="observacoes"></a>

## **6. Observações Importantes**

* Recomenda-se validar os dados do cliente antes de enviar para a API.
* As rotas seguem padrão REST.
* Ideal para integração com sistemas de estoque e dashboards.
* O campo `tipo` deve ser padronizado (ex.: "entrada" / "saida").

---

**Fim da documentação.**

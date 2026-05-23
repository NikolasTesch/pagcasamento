# Contract: config.json Schema

**Feature**: `001-wedding-site-gifts`
**Date**: 2026-05-23

O arquivo `config.json` é a única fonte de verdade do site. Ele deve residir em `public/config.json` (ou `config.json` na raiz, dependendo da estrutura final). Qualquer pessoa com acesso ao repositório pode editar este arquivo para atualizar o conteúdo sem alterar código.

---

## Schema Completo (JSON)

```json
{
  "wedding": {
    "coupleName": "string (obrigatório) — ex: 'Ana & Pedro'",
    "weddingDate": "string ISO 8601 (obrigatório) — ex: '2026-08-15'",
    "weddingTime": "string (obrigatório) — ex: '17:00'",
    "venue": {
      "name": "string (obrigatório) — ex: 'Espaço Giardino'",
      "address": "string (obrigatório) — ex: 'Rua das Flores, 123 - São Paulo, SP'",
      "mapsUrl": "string | null (opcional) — URL do Google Maps"
    },
    "couplePhotoUrl": "string | null (opcional) — URL da foto principal",
    "message": "string | null (opcional) — Mensagem de boas-vindas"
  },
  "gifts": [
    {
      "id": "string (obrigatório) — ex: 'gift-001' (deve ser único)",
      "name": "string (obrigatório) — ex: 'Jogo de Jantar Completo'",
      "description": "string | null (opcional) — até 100 caracteres",
      "value": "number (obrigatório) — positivo, máx 2 casas decimais — ex: 150.00",
      "imageUrl": "string | null (opcional) — URL ou caminho relativo da imagem",
      "category": "string | null (opcional) — ex: 'Cozinha'",
      "available": "boolean (obrigatório) — true = disponível para presentear"
    }
  ],
  "pix": {
    "key": "string (obrigatório) — a chave Pix do casal",
    "keyType": "enum (obrigatório) — 'cpf' | 'email' | 'phone' | 'random'",
    "receiverName": "string (obrigatório) — nome do recebedor, máx 25 caracteres",
    "city": "string (obrigatório) — cidade, máx 15 caracteres",
    "whatsappNumber": "string | null (opcional) — ex: '+5511999999999'"
  }
}
```

---

## Exemplo de config.json Completo

```json
{
  "wedding": {
    "coupleName": "Ana & Pedro",
    "weddingDate": "2026-08-15",
    "weddingTime": "17:00",
    "venue": {
      "name": "Espaço Giardino",
      "address": "Rua das Flores, 123 - Jardins, São Paulo - SP",
      "mapsUrl": "https://maps.google.com/?q=Espaco+Giardino+Sao+Paulo"
    },
    "couplePhotoUrl": "/images/casal.jpg",
    "message": "Ficamos felizes em contar com a sua presença neste dia tão especial para nós!"
  },
  "gifts": [
    {
      "id": "gift-001",
      "name": "Jogo de Jantar Completo",
      "description": "Conjunto para 12 pessoas com pratos, bowls e travessas",
      "value": 350.00,
      "imageUrl": "/images/gifts/jantar.jpg",
      "category": "Cozinha",
      "available": true
    },
    {
      "id": "gift-002",
      "name": "Air Fryer 5L",
      "description": "Fritadeira elétrica sem óleo, controle digital",
      "value": 249.90,
      "imageUrl": "/images/gifts/airfryer.jpg",
      "category": "Cozinha",
      "available": true
    },
    {
      "id": "gift-003",
      "name": "Jogo de Cama Queen",
      "description": "Conjunto 4 peças 100% algodão 300 fios",
      "value": 189.00,
      "imageUrl": "/images/gifts/cama.jpg",
      "category": "Quarto",
      "available": false
    }
  ],
  "pix": {
    "key": "ana.pedro@email.com",
    "keyType": "email",
    "receiverName": "ANA E PEDRO",
    "city": "SAO PAULO",
    "whatsappNumber": "+5511999999999"
  }
}
```

---

## Regras de Validação

| Campo | Regra |
|-------|-------|
| `gifts[].id` | Deve ser único dentro do array |
| `gifts[].value` | > 0, máximo 2 casas decimais |
| `pix.receiverName` | Máximo 25 caracteres (requisito do padrão EMV Pix) |
| `pix.city` | Máximo 15 caracteres (requisito do padrão EMV Pix) |
| `pix.keyType` | Apenas: `"cpf"`, `"email"`, `"phone"`, `"random"` |
| `wedding.weddingDate` | Formato ISO 8601: YYYY-MM-DD |
| `wedding.weddingTime` | Formato HH:MM (24h) |

---

## Contrato de Atualização de Presentes

Para marcar um presente como indisponível (já presenteado pelo casal de forma definitiva):

1. Editar `config.json`
2. Alterar `gifts[n].available` de `true` para `false`
3. Fazer commit e push → Vercel redeploya automaticamente em < 30 segundos

Este fluxo não requer nenhum acesso ao servidor ou painel de administração.

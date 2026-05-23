# Data Model: Site de Casamento com Lista de Presentes

**Feature**: `001-wedding-site-gifts`
**Date**: 2026-05-23

---

## Entidades

### 1. WeddingInfo

Informações principais do evento. Lida do `config.json` na inicialização.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|------------|-----------|
| `coupleName` | `string` | ✅ | Nome completo do casal (ex: "Ana & Pedro") |
| `weddingDate` | `string` (ISO 8601) | ✅ | Data do casamento (ex: "2026-08-15") |
| `weddingTime` | `string` | ✅ | Horário da cerimônia (ex: "17:00") |
| `venue.name` | `string` | ✅ | Nome do local (ex: "Espaço Giardino") |
| `venue.address` | `string` | ✅ | Endereço completo |
| `venue.mapsUrl` | `string` | ❌ | Link Google Maps (opcional) |
| `couplePhotoUrl` | `string` | ❌ | URL da foto principal do casal |
| `message` | `string` | ❌ | Mensagem de boas-vindas personalizada |

---

### 2. Gift

Representa um item na lista de presentes.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|------------|-----------|
| `id` | `string` | ✅ | Identificador único (ex: "gift-001") |
| `name` | `string` | ✅ | Nome do presente (ex: "Jogo de Jantar") |
| `description` | `string` | ❌ | Descrição curta (até 100 chars) |
| `value` | `number` | ✅ | Valor em reais (ex: 150.00) |
| `imageUrl` | `string` | ❌ | URL da imagem ilustrativa |
| `category` | `string` | ❌ | Categoria (ex: "Cozinha", "Quarto") |
| `available` | `boolean` | ✅ | Se ainda pode ser presenteado (gerenciado via `config.json` pelo casal) |

**Estado local** (gerenciado via `localStorage`, não persistido no `config.json`):
- `giftedByMe: boolean` — se o convidado neste dispositivo marcou como presenteado

**Regras de negócio**:
- `value` deve ser positivo e ter no máximo 2 casas decimais.
- Se `available: false` no `config.json`, o card é exibido como "Presenteado" independente do `localStorage`.
- Se `giftedByMe: true` no `localStorage`, o card exibe "Você já presenteou este item" com ícone ✓.

---

### 3. PixConfig

Configuração estática do recebedor Pix. Usada para gerar o payload do QR Code.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|------------|-----------|
| `key` | `string` | ✅ | Chave Pix (CPF, e-mail, telefone ou chave aleatória) |
| `keyType` | `enum` | ✅ | Tipo: `"cpf"` \| `"email"` \| `"phone"` \| `"random"` |
| `receiverName` | `string` | ✅ | Nome do recebedor (máx 25 chars para payload Pix) |
| `city` | `string` | ✅ | Cidade do recebedor (máx 15 chars para payload Pix) |
| `whatsappNumber` | `string` | ❌ | Número do casal para mensagens (ex: "+5511999999999") |

**Regras de negócio**:
- `receiverName` e `city` são truncados automaticamente se excederem o máximo Pix EMV.
- O campo `txid` no payload Pix é sempre fixado como `"***"` (código estático reutilizável).

---

### 4. AppConfig (raiz do `config.json`)

Envelope que agrupa todas as entidades acima no arquivo de configuração.

```
AppConfig
├── wedding: WeddingInfo
├── gifts: Gift[]
└── pix: PixConfig
```

---

## Payload Pix EMV (estrutura gerada em runtime)

O payload Pix estático é uma string gerada pelo utilitário `pix.js` a partir dos dados `PixConfig` + valor do presente selecionado.

**Campos do payload** (padrão BACEN/Pix - Especificação de API de Pagamentos Instantâneos):

```
ID    Valor
00    01                          → Payload Format Indicator
26    [Merchant Account Info]
  00  br.gov.bcb.pix              → GUI
  01  [chave Pix]                 → Chave
52    0000                        → Merchant Category Code
53    986                         → Currency (BRL)
54    [valor]                     → Transaction Amount (ex: "150.00")
58    BR                          → Country Code
59    [receiverName]              → Merchant Name
60    [city]                      → Merchant City
62    [Additional Data]
  05  ***                         → txid
63    [CRC16-CCITT]               → CRC checksum (4 hex chars)
```

---

## Fluxo de Estado da UI

```
[INÍCIO]
    │
    ▼
[HOME] ── click "Lista de Presentes" ──► [LISTA]
                                            │
                                   click card disponível
                                            │
                                            ▼
                                    [MODAL CONFIRMAÇÃO]
                                      "Você quer presentear
                                      [Nome] por R$ [Valor]?"
                                         │         │
                                   Confirmar    Cancelar
                                         │         │
                                         ▼         ▼
                                  [TELA PAGAMENTO] [LISTA]
                                  QR Code + Chave
                                  "Copiar chave" btn
                                         │
                                  marca localStorage
                                         │
                              ┌──────────┴──────────┐
                              ▼                      ▼
                      [DEIXAR MENSAGEM]       [VOLTA LISTA]
                      (abre WhatsApp)
```

---

## localStorage Schema

Chave: `cadife_wedding_gifted` (namespace para evitar conflitos)

```json
{
  "gift-001": true,
  "gift-003": true
}
```

- Cada key é um `Gift.id`.
- Valor sempre `true` (presença na chave indica que foi presenteado por este usuário neste device).
- Nunca armazena dados pessoais do convidado.

---

## Diagrama de Dependências

```
config.json (fonte da verdade)
    ├─► WeddingInfo  →  renderizado na HOME
    ├─► Gift[]       →  renderizado na LISTA
    │       └─► Gift.value  ┐
    └─► PixConfig           ├─► pix.js → payload string → QR Code
                            └─► chave Pix
```

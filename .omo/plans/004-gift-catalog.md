# Plan 004: Catálogo de Presentes — Expansão da Lista

**Branch sugerida**: `004-gift-catalog`
**Baseado no fluxo atual**: Firestore (fonte primária) → fallback config.json → fallback in-memory

---

## 1. Escopo

Substituir a lista atual de presentes (5 itens + 3 vaquinhas do fallback) pela **nova lista completa** com 18+ itens, incluindo vaquinhas para itens de alto valor. Manter os vaquinhas existentes (Lua de Mel, Geladeira, Smart TV) que o usuário já tem.

### Lista Completa de Presentes — Valores e Descrições

#### Presentes Individuais (valor fixo)

| # | Item | Valor | Descrição |
|---|------|-------|-----------|
| 1 | **Micro-ondas Espelhado** | R$ 450 | *(já existe)* Praticidade e estilo para preparar deliciosas receitas no dia a dia do nosso novo lar. |
| 2 | **Cooktop 4 Bocas** | R$ 650 | Um cooktop moderno para prepararmos juntos refeições deliciosas e especiais — a cozinha é o coração da casa. |
| 3 | **Liquidificador** | R$ 180 | Para sucos naturais, vitaminas e aquela massa de bolo especial de domingo com a família. |
| 4 | **Air Fryer** | R$ 380 | Receitas práticas e saudáveis para o nosso dia a dia com muito sabor e crocância. |
| 5 | **Rede de Descanso** | R$ 180 | Uma rede confortável para relaxarmos juntos nos fins de tarde na varanda, aproveitando a brisa. |
| 6 | **Kit de Panelas** | R$ 400 | Conjunto completo de panelas antiaderentes para cozinhar com amor e praticidade todos os dias. |
| 7 | **Mesa de Jantar** | R$ 1.800 | Uma mesa linda para recebermos nossa família e amigos com todo o carinho e aconchego. |
| 8 | **Jogo de Cadeiras Varanda** | R$ 500 | Cadeiras confortáveis e estilosas para aproveitarmos os dias ensolarados na varanda. |
| 9 | **Batedeira Planetária** | R$ 400 | Para prepararmos bolos, massas e sobremesas deliciosas juntos na cozinha — como bons parceiros. |
| 10 | **Prateleira Decorativa** | R$ 150 | Uma prateleira versátil para organizar e decorar nosso cantinho especial com fotos e memórias. |
| 11 | **Cama de Casal Box** | R$ 3.200 | *(ajustado de R$ 2.500)* Uma cama confortável com colchão de qualidade para começarmos e terminarmos cada dia juntinhos — nosso refúgio. |
| 12 | **Jogo de Cama** | R$ 250 | Kit completo de lençóis e fronhas macios para noites de sono perfeitas e aconchegantes. |
| 13 | **Armário Auxiliar** | R$ 600 | Um armário compacto e funcional para organizar objetos e otimizar os espaços da casa. |
| 14 | **Armário de Cozinha** | R$ 1.000 | Armário planejado para manter a cozinha organizada, funcional e bonita. |
| 15 | **Kit de Quadros Decorativos** | R$ 250 | Conjunto de quadros para encher as paredes da nossa casa com arte, cor e personalidade. |

#### Vaquinhas (contribuição livre, meta total)

| # | Item | Meta | Descrição |
|---|------|------|-----------|
| 16 | **Cota para Máquina de Lavar** 🎯 | R$ 2.800 | Ajude a gente a realizar o sonho da máquina de lavar nova — praticidade e economia para o nosso lar! |
| 17 | **Cota para Sofá da Sala** 🎯 | R$ 3.500 | Contribua com o sofá que vai ser o ponto de encontro da nossa família — aconchego e boas conversas! |

#### Vaquinhas Existentes (manter)

| # | Item | Meta | Descrição |
|---|------|------|-----------|
| 18 | **Lua de Mel dos Sonhos** 🏖️ | R$ 5.000 | Ajude-nos a realizar a viagem de lua de mel que sempre sonhamos — uma semana inesquecível para começar nossa vida juntos. |
| 19 | **Cota para Geladeira** ❄️ | R$ 3.500 | Uma geladeira espaçosa e moderna para guardar tudo com organização e estilo na nossa nova casa. |
| 20 | **Cota para Smart TV 65"** 📺 | R$ 2.800 | Uma Smart TV enorme para as noites de cinema em casa, assistindo filmes e séries abraçadinhos no sofá. |

> **Decisão**: Micro-ondas individual mantido (R$ 450). Geladeira **apenas como vaquinha** (R$ 3.500) — valor de eletrodoméstico grande fica melhor como cota coletiva. Isso evita duplicidade e dá mais flexibilidade pros convidados.
>
> ⚠️ **Itens antigos (gift-001, 003, 004, 005)**: Foram REMOVIDOS da lista para dar lugar aos novos. Se quiser mantê-los como extras, a contagem sobe para 24 itens.

---

## 2. JSON da Lista de Presentes

Arquivo de destino: `config.json` (raiz do projeto) — atualizar campo `gifts[]`.
Também serve como seed para popular o Firestore.

```json
{
  "gifts": [
    {
      "id": "gift-002",
      "name": "Micro-ondas Espelhado",
      "description": "Praticidade e estilo para preparar deliciosas receitas no dia a dia do nosso novo lar.",
      "value": 450.00,
      "imageUrl": "/images/gifts/gift-002.png",
      "category": "Eletrodomésticos",
      "available": true
    },
    {
      "id": "gift-006",
      "name": "Cooktop 4 Bocas",
      "description": "Um cooktop moderno para prepararmos juntos refeições deliciosas e especiais — a cozinha é o coração da casa.",
      "value": 650.00,
      "imageUrl": "/images/gifts/gift-006.png",
      "category": "Eletrodomésticos",
      "available": true
    },
    {
      "id": "gift-007",
      "name": "Liquidificador",
      "description": "Para sucos naturais, vitaminas e aquela massa de bolo especial de domingo com a família.",
      "value": 180.00,
      "imageUrl": "/images/gifts/gift-007.png",
      "category": "Eletrodomésticos",
      "available": true
    },
    {
      "id": "gift-008",
      "name": "Air Fryer",
      "description": "Receitas práticas e saudáveis para o nosso dia a dia com muito sabor e crocância.",
      "value": 380.00,
      "imageUrl": "/images/gifts/gift-008.png",
      "category": "Eletrodomésticos",
      "available": true
    },
    {
      "id": "gift-009",
      "name": "Rede de Descanso",
      "description": "Uma rede confortável para relaxarmos juntos nos fins de tarde na varanda, aproveitando a brisa.",
      "value": 180.00,
      "imageUrl": "/images/gifts/gift-009.png",
      "category": "Casa & Decor",
      "available": true
    },
    {
      "id": "gift-010",
      "name": "Kit de Panelas",
      "description": "Conjunto completo de panelas antiaderentes para cozinhar com amor e praticidade todos os dias.",
      "value": 400.00,
      "imageUrl": "/images/gifts/gift-010.png",
      "category": "Cozinha",
      "available": true
    },
    {
      "id": "gift-011",
      "name": "Mesa de Jantar",
      "description": "Uma mesa linda para recebermos nossa família e amigos com todo o carinho e aconchego.",
      "value": 1800.00,
      "imageUrl": "/images/gifts/gift-011.png",
      "category": "Casa & Decor",
      "available": true
    },
    {
      "id": "gift-012",
      "name": "Jogo de Cadeiras Varanda",
      "description": "Cadeiras confortáveis e estilosas para aproveitarmos os dias ensolarados na varanda.",
      "value": 500.00,
      "imageUrl": "/images/gifts/gift-012.png",
      "category": "Casa & Decor",
      "available": true
    },
    {
      "id": "gift-013",
      "name": "Batedeira Planetária",
      "description": "Para prepararmos bolos, massas e sobremesas deliciosas juntos na cozinha — como bons parceiros.",
      "value": 400.00,
      "imageUrl": "/images/gifts/gift-013.png",
      "category": "Cozinha",
      "available": true
    },
    {
      "id": "gift-014",
      "name": "Prateleira Decorativa",
      "description": "Uma prateleira versátil para organizar e decorar nosso cantinho especial com fotos e memórias.",
      "value": 150.00,
      "imageUrl": "/images/gifts/gift-014.png",
      "category": "Casa & Decor",
      "available": true
    },
    {
      "id": "gift-015",
      "name": "Cama de Casal Box",
      "description": "Uma cama confortável para começarmos e terminarmos cada dia juntinhos — nosso refúgio.",
      "value": 3200.00,
      "imageUrl": "/images/gifts/gift-015.png",
      "category": "Cama, Mesa & Banho",
      "available": true
    },
    {
      "id": "gift-016",
      "name": "Jogo de Cama",
      "description": "Kit completo de lençóis e fronhas macios para noites de sono perfeitas e aconchegantes.",
      "value": 250.00,
      "imageUrl": "/images/gifts/gift-016.png",
      "category": "Cama, Mesa & Banho",
      "available": true
    },
    {
      "id": "gift-017",
      "name": "Armário Auxiliar",
      "description": "Um armário compacto e funcional para organizar objetos e otimizar os espaços da casa.",
      "value": 600.00,
      "imageUrl": "/images/gifts/gift-017.png",
      "category": "Casa & Decor",
      "available": true
    },
    {
      "id": "gift-018",
      "name": "Armário de Cozinha",
      "description": "Armário planejado para manter a cozinha organizada, funcional e bonita.",
      "value": 1000.00,
      "imageUrl": "/images/gifts/gift-018.png",
      "category": "Cozinha",
      "available": true
    },
    {
      "id": "gift-019",
      "name": "Kit de Quadros Decorativos",
      "description": "Conjunto de quadros para encher as paredes da nossa casa com arte, cor e personalidade.",
      "value": 250.00,
      "imageUrl": "/images/gifts/gift-019.png",
      "category": "Casa & Decor",
      "available": true
    },
    {
      "id": "vaquinha-004",
      "name": "Cota para Máquina de Lavar",
      "description": "Ajude a gente a realizar o sonho da máquina de lavar nova — praticidade e economia para o nosso lar!",
      "value": 2800.00,
      "imageUrl": "/images/gifts/vaquinha-004.png",
      "category": "Eletrodomésticos",
      "available": true,
      "is_crowdfunding": true,
      "amount_collected": 0
    },
    {
      "id": "vaquinha-005",
      "name": "Cota para Sofá da Sala",
      "description": "Contribua com o sofá que vai ser o ponto de encontro da nossa família — aconchego e boas conversas!",
      "value": 3500.00,
      "imageUrl": "/images/gifts/vaquinha-005.png",
      "category": "Casa & Decor",
      "available": true,
      "is_crowdfunding": true,
      "amount_collected": 0
    },
    {
      "id": "vaquinha-001",
      "name": "Lua de Mel dos Sonhos",
      "description": "Ajude-nos a realizar a viagem de lua de mel que sempre sonhamos — uma semana inesquecível para começar nossa vida juntos.",
      "value": 5000.00,
      "imageUrl": "/images/gifts/vaquinha-001.png",
      "category": "Viagem",
      "available": true,
      "is_crowdfunding": true,
      "amount_collected": 1200.00
    },
    {
      "id": "vaquinha-002",
      "name": "Cota para Geladeira",
      "description": "Uma geladeira espaçosa e moderna para guardar tudo com organização e estilo na nossa nova casa.",
      "value": 3500.00,
      "imageUrl": "/images/gifts/vaquinha-002.png",
      "category": "Eletrodomésticos",
      "available": true,
      "is_crowdfunding": true,
      "amount_collected": 700.00
    },
    {
      "id": "vaquinha-003",
      "name": "Cota para Smart TV 65\"",
      "description": "Uma Smart TV enorme para as noites de cinema em casa, assistindo filmes e séries abraçadinhos no sofá.",
      "value": 2800.00,
      "imageUrl": "/images/gifts/vaquinha-003.png",
      "category": "Eletrônicos",
      "available": true,
      "is_crowdfunding": true,
      "amount_collected": 0
    }
  ]
}
```

---

## 3. Especificação das Imagens (para geração)

Arquivo de referência: `.omo/plans/004-gift-images.json` (imagens devem ser criadas em `public/images/gifts/`)

| ID | Item | Estilo da Imagem | Fundo | Elementos |
|----|------|-----------------|-------|-----------|
| gift-002 | Micro-ondas | Produto isolado, ângulo 3/4 | #FAF7F2 (marfim) | Micro-ondas preto espelhado, luz interna suave |
| gift-006 | Cooktop | Produto isolado, vista superior | #FAF7F2 | Cooktop 4 bocas inox, queimas apagados |
| gift-007 | Liquidificador | Produto isolado | #FAF7F2 | Liquidificador com copo de vidro, frutas ao lado |
| gift-008 | Air Fryer | Produto isolado | #FAF7F2 | Air fryer digital, cesta semiaberta |
| gift-009 | Rede | Cena ambiente | #F5F0E8 | Rede colorida em varanda, luz natural |
| gift-010 | Kit Panelas | Conjunto empilhado | #FAF7F2 | Panelas antiaderentes empilhadas, tampa inclinada |
| gift-011 | Mesa Jantar | Cena ambiente | #F5F0E8 | Mesa redonda de madeira, 4 cadeiras, arranjo floral |
| gift-012 | Cadeiras Varanda | Conjunto 2 peças | #F5F0E8 | 2 cadeiras de ferro/madeira estilo varanda |
| gift-013 | Batedeira | Produto isolado | #FAF7F2 | Batedeira planetária, bowl inox, batedor ao lado |
| gift-014 | Prateleira Decorativa | Produto isolado, parede | #F5F0E8 | Prateleira flutuante decorativa com objetos |
| gift-015 | Cama Casal | Cena ambiente | #F5F0E8 | Cama box casal com cabeceira estofada, roupa de cama neutra |
| gift-016 | Jogo Cama | Produto dobrado | #FAF7F2 | Lençóis dobrados, fronhas empilhadas, tecido aparente |
| gift-017 | Armário Auxiliar | Produto isolado | #F5F0E8 | Armário estreito, portas fechadas, puxadores dourados |
| gift-018 | Armário Cozinha | Cena ambiente | #F5F0E8 | Armário planejado cinza/inox, bancada com objetos |
| gift-019 | Quadros | Conjunto na parede | #F5F0E8 | 3 quadros estilosos pendurados composição |
| gift-001 | Jogo de Pratos | Conjunto | #FAF7F2 | Pratos de porcelana empilhados (manter existente) |
| gift-003 | Toalhas Banho | Empilhadas | #FAF7F2 | Toalhas felpudas dobradas (manter existente) |
| gift-004 | Cafeteira | Produto isolado | #FAF7F2 | Nespresso com xícara ao lado (manter existente) |
| gift-005 | Fitas LED | Cena ambiente escura | #1C1412 | Fitas LED acesas, efeito luminoso (manter existente) |
| vaquinha-001 | Lua de Mel | Cena aspiracional | Gradiente dourado | Praia/pôr do sol, casal silhoueta |
| vaquinha-002 | Geladeira | Produto isolado | #FAF7F2 | Geladeira duplex inox, portas fechadas |
| vaquinha-003 | Smart TV | Produto isolado, tela | #1C1412 | TV fina, tela preta, suporte de parede |
| vaquinha-004 | Máq. Lavar | Produto isolado | #FAF7F2 | Máquina de lavar branca, painel digital |
| vaquinha-005 | Sofá Sala | Cena ambiente | #F5F0E8 | Sofá 3 lugares estofado, almofadas decorativas |

> **Nota**: As imagens podem ser geradas com IA (Midjourney/DALL-E), fotos de banco de imagens (Unsplash/Pexels) ou ilustrações SVG. Sugestão de prompt base: *"Produto isolado em fundo marfim claro, estilo fotografia de catalogo, iluminação suave, tons neutros e elegantes"*

---

## 4. Categorias

```
Eletrodomésticos  → Micro-ondas, Cooktop, Liquidificador, Air Fryer, Máquina de Lavar (vaq)
Cozinha           → Kit Panelas, Batedeira, Jogo Pratos, Armário Cozinha, Cafeteira
Casa & Decor      → Rede, Mesa Jantar, Cadeiras Varanda, Prateleira Decorativa, Armário Auxiliar, Quadros, Sofá (vaq)
Cama, Mesa & Banho → Cama Casal, Jogo Cama
Eletrônicos       → Smart TV (vaq)
Viagem            → Lua de Mel (vaq)
```

---

## 5. Tasks de Implementação

### Phase 1: Estrutura de Dados
- [ ] T001 Atualizar `config.json` com a nova lista completa de **20 gifts** (15 individuais + 5 vaquinhas)
- [ ] T002 Simplificar fallbacks em `presentes/page.tsx`:
  - Remover o fallback in-memory (propenso a erro por duplicação)
  - Manter apenas Firestore (fonte primária) → `config.json` (fallback)
- [ ] T003 Seed no Firestore: criar script ou execução manual para popular coleção `gifts` com os 20 itens

### Phase 2: Imagens
- [ ] T004 Gerar/criar imagens para cada gift em `public/images/gifts/` seguindo a especificação da seção 3
- [ ] T005 Verificar que todas as imagens existem e têm boa qualidade visual

### Phase 3: Remoção de Itens Antigos
- [ ] T006 Remover gifts que não estão mais na lista: Jogo de Pratos (gift-001), Toalhas (gift-003), Cafeteira (gift-004), Fitas LED (gift-005) — ou mantê-los como adicionais
- [ ] T007 Decidir: vaquinha Geladeira (existente) substitui a Geladeira individual? (recomendo sim)

### Phase 4: Validação
- [ ] T008 Verificar que todos os IDs são únicos e seguem padrão `gift-NNN` / `vaquinha-NNN`
- [ ] T009 Testar renderização dos cards na página de presentes
- [ ] T010 Verificar que vaquinhas exibem barra de progresso corretamente

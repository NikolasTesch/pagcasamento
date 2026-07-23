# Plan 003: Rebrand Visual — Paleta do Convite + Flores + Tipografia Script

**Branch sugerida**: `003-invitation-rebrand`
**Feat spec**: `specs/003-invitation-rebrand/spec.md`

---

## 1. O que será feito

Alinhar visualmente o site ao **convite de casamento** (descrito no JSON do convite):
1. **Nova paleta de cores** — extraída do convite (fundo marfim, dourado, pink floral, verde folha)
2. **Nova tipografia** — adicionar fonte **script/handwritten** (Great Vibes) para os nomes do casal no hero; manter Inter (sans-serif) para corpo
3. **Componente floral** — lírios aquarelados em pink com folhas verdes, posicionados nos cantos (top-right + bottom-left), replicando o design do convite
4. **Imagem do convite na página principal** — `convite.jpg` inserido OBRIGATORIAMENTE na homepage como seção dedicada "O Convite", visível para todos os visitantes
5. **Dourado como nova cor de destaque** — substituir o marrom (#9B8264) por dourado (#B89736) como cor brand principal

---

## 2. Análise das Mudanças

### 2.1 Paleta Atual vs. Nova

| Token | Atual | Nova (Convite) |
|-------|-------|----------------|
| `--color-bg-light` | `#FAF8F5` | `#FAF7F2` (marfim) |
| `--color-bg-warm` | `#F5EFE8` | `#F5F0E8` (creme) |
| `--color-bg-dark` | `#1C1412` | `#3D372E` (marrom escuro) |
| `--color-bg-dark-muted` | `#3A3028` | `#5C5549` (taupe) |
| `--color-brand` | `#9B8264` (marrom) | `#B89736` **(dourado)** ⚠️ |
| `--color-brand-hover` | `#8B7254` | `#A38B42` (dourado escuro) |
| `--color-brand-light` | *(não existe)* | `#D4AF37` (dourado claro) |
| `--color-text-dark` | `#1C1412` | `#3D372E` |
| `--color-text-mid` | `#6B5B45` | `#5C5549` |
| `--color-text-muted` | `#9B8264` | `#A38B42` |
| `--color-border` | `#E8E0D5` | `#E8E0D5` (mantido) |
| `--color-floral-pink` | *(não existe)* | `#D86B81` ✨ |
| `--color-floral-pink-dark` | *(não existe)* | `#8A2E43` ✨ |
| `--color-floral-pink-light` | *(não existe)* | `#E8A3B1` ✨ |
| `--color-floral-green` | *(não existe)* | `#4A6043` ✨ |

⚠️ **Atenção**: Trocar o marrom por dourado como `--color-brand` vai afetar **botões, links, hover states, ícones e seleção de texto** em todo o site. É a mudança mais visível.

### 2.2 Tipografia

| Uso | Atual | Nova |
|-----|-------|------|
| Nomes do casal (hero) | Playfair Display (serif) | **Great Vibes** (script) ✨ |
| Headings/secções | Playfair Display | Playfair Display (mantido) |
| Corpo/datas | Inter (sans-serif) | Inter (mantido) |
| Detalhes/uppercase | Inter | Inter ou **Cinzel** (serif clássico) |

### 2.3 Novos Componentes

- `FloralDecoration.tsx` — SVG de lírios + folhas, posicionado nos cantos superior direito e inferior esquerdo
- `convite.jpg` — **seção obrigatória na homepage** com preview clicável que abre lightbox em tela cheia

---

## 3. Estrutura de Arquivos

```
specs/003-invitation-rebrand/
├── spec.md              # Especificação desta feature
├── plan.md              # Plano de implementação
└── tasks.md             # Tarefas

src/
├── app/
│   ├── globals.css      # [EDIT] Nova paleta de cores, fontes
│   ├── layout.tsx       # [EDIT] Adicionar fonte Great Vibes
│   └── page.tsx         # [EDIT] Inserir convite.jpg + floral decorator
├── components/
│   ├── FloralDecoration.tsx   # [NEW] Elementos florais SVG
│   └── InvitationCard.tsx     # [NEW] Seção do convite com preview + lightbox
└── lib/
    └── utils.ts         # (se não existir ainda)
```

### Ordem das seções na homepage (após as alterações)

```text
src/app/page.tsx (ordem final das seções):

  1. Navbar
  2. Hero (com nomes em Great Vibes dourado)
  3. Countdown Timer                 ← do plano 002
  4. Detalhes do Evento
  5. Mapa Interativo                 ← do plano 002
  6. Nossa História
  7. ▸ O CONVITE ◄                   ← NOVO — seção com convite.jpg
  8. Galeria de Fotos
  9. Gift CTA (Lista de Presentes)
  10. Footer
  └── + FloralDecoration (top-right + bottom-left, fixo)
  └── + WhatsAppButton               ← do plano 002
  └── + BackToTop                    ← do plano 002
```
```

---

## 4. Dependências

- **Fonte Great Vibes** (Google Fonts) — adicionar no `layout.tsx`
- **Nenhuma lib externa** — flores serão SVG inline (leve, sem dependência)

---

## 5. Tasks

### Phase 1: Paleta de Cores

- [ ] T001 Atualizar `--color-*` tokens no `globals.css` conforme tabela acima
- [ ] T002 Verificar visualmente contraste das novas cores (WCAG AA) — especialmente brand dourado sobre bg-light
- [ ] T003 Atualizar `:root` vars `--background` e `--foreground`

### Phase 2: Tipografia

- [ ] T004 Adicionar `Great_Vibes` no `layout.tsx` (Google Fonts, weight 400)
- [ ] T005 Definir `--font-script` no `globals.css`
- [ ] T006 Atualizar hero da homepage (`page.tsx`): nomes do casal em Great Vibes dourado (#B89736) com drop-shadow sutil

### Phase 3: Imagem do Convite na Página Principal ⚠️ OBRIGATÓRIO

O convite DEVE estar na página principal (`/`) — não em página separada, não opcional, não escondido.

- [ ] T007 Inserir `convite.jpg` como **seção visível na homepage** — posicionada entre a seção "Nossa História" e a seção "Galeria" (antes do CTA de presentes)
  - Título: "O Convite" em Playfair Display
  - Preview centralizado da imagem com borda sutil e sombra (mockup de papel)
  - Texto abaixo: "Clique para ampliar" ou "Veja o convite completo"
  - Layout responsivo: imagem ocupa `max-w-[400px]` no desktop, 100% largura no mobile
- [ ] T008 Extrair lógica de lightbox da `page.tsx` para `src/components/GalleryLightbox.tsx` (se ainda não extraído no plano 002)
- [ ] T009 Ao clicar na imagem do convite, abrir overlay/lightbox em tela cheia com o convite em alta resolução
  - Reutilizar `GalleryLightbox` (T008) ou criar overlay específico com botão "Fechar" + clique fora
- [ ] T010 Garantir que a seção do convite apareça em toda visita à homepage — sem scroll excessivo (acima do "fold" parcial ou no máximo 1 scroll abaixo do hero)

### Phase 4: Componente Floral

- [ ] T011 Criar `src/components/FloralDecoration.tsx`:
  - SVG vetorial estilizado de lírios + folhas (não aquarela raster — SVG puro com gradientes e paths)
  - Alternativa viável: PNG com fundo transparente e opacidade 0.6-0.8 se o SVG ficar complexo demais
  - Props: `position: "top-right" | "bottom-left"`, `size: "sm" | "md" | "lg"`
  - Opcionalmente, animação sutil de "flutuação" (CSS float)
- [ ] T012 Integrar `FloralDecoration` na homepage (top-right + bottom-left)
- [ ] T013 Integrar `FloralDecoration` na página de presentes (opcional)

### Phase 5: Revisão Geral

- [ ] T014 **VERIFICAR** que `convite.jpg` aparece na homepage (`/`) em todas as resoluções — não está em rota separada, não está oculto, não está quebrado
- [ ] T015 Verificar botões, links e hover states com nova cor brand dourada
- [ ] T016 Verificar contraste do texto dourado sobre fundos claros (especialmente botões com bg dourado)
- [ ] T017 Testar em mobile (375px) e desktop (1440px) — convite visível e legível em ambos
- [ ] T018 Ajustar opacidade/brilho dos florais se interferirem com conteúdo

---

## 6. Observações de Design

### Dourado como Brand
O dourado (#B89736) é **menos contrastante** que o marrom (#9B8264) sobre fundos claros. Recomendações:
- Botões com bg dourado → texto **sempre branco** (nunca texto escuro sobre dourado)
- Texto dourado → usar **apenas em fundos escuros** ou como cor decorativa (não para body text)
- Manter `text-mid` e `text-dark` escuros (#3D372E, #5C5549) para legibilidade do conteúdo
- A cor `--color-brand` deve ser usada com moderação — acentos, não grandes áreas

### Florais
Os lírios pink com folhas verdes são o elemento mais distinto do convite. No site:
- **Posição**: canto superior direito + canto inferior esquerdo (como no convite)
- **Tamanho**: responsivo — sumir ou reduzir drasticamente em mobile (< 640px)
- **Opacidade**: sutil (0.6-0.8) para não competir com o conteúdo
- **SVG puro**: sem PNG, sem lib externa. Cria-se um SVG inline com paths dos lírios

### Fonte Script
Great Vibes é elegante mas **não deve ser usada para parágrafos longos**. Apenas:
- Nomes do casal no hero
- Iniciais K&L no navbar (opcional — testar)
- Citação ou frase romântica (opcional)

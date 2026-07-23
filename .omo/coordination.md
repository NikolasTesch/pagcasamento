# Coordenação Entre Planos — Ordem de Execução e Pendências

## Ordem de Execução Recomendada

```
PLANO 002 (Visual) ──────→ PLANO 003 (Rebrand) ────→ PLANO 004 (Gifts)
       │                          │                          │
       │  Infraestrutura          │  Paleta nova              │  Lista de presentes
       │  Componentes             │  Tipografia script        │  Imagens alinhadas
       │  Animações               │  Convite na homepage      │  com nova paleta
       │  Map/WhatsApp/Splash     │  Florais decorativos      │
       │  SEO/Favicon             │                           │
       └──────────────────────────┴───────────────────────────┘
              TIME                    TIME                       TIME
           (dependente)           (dependente do 002)        (ideal após 003)
```

**Regra geral**: 002 → 003 → 004. O 004 **pode** ser executado antes, mas as imagens dos gifts terão fundo marfim (#FAF7F2) que é consistente com a paleta do 003 de qualquer forma.

---

## Pendências nos Arquivos `specs/` (não editáveis pelo Prometheus)

Estes arquivos precisam de correção manual na próxima edição:

### `specs/002-wedding-site-visual-improvements/tasks.md`

| Local | O que corrigir |
|-------|---------------|
| **T009** | Remover `scroll-behavior: smooth no <html>` — já existe no `layout.tsx` como classe `scroll-smooth` |
| **T018** | Substituir "Ícone do WhatsApp (Lucide)" por "Ícone do WhatsApp (SVG avulso — Lucide não tem WhatsApp nativo)" |
| **T019, T022, T032** | Adicionar nota: "Coordenar edições no `layout.tsx` para evitar conflito — todos estes componentes integram no mesmo arquivo" |
| **T008 → mover** | A task de lightbox do convite referenciada aqui depende de `GalleryLightbox` extraído em T024. Garantir que T024 (extrair GalleryLightbox) venha ANTES de qualquer task que o use |

---

## Resumo das Correções Aplicadas nos Planos `.omo/`

| ID | Status | Correção |
|----|--------|----------|
| **F7** | ✅ Corrigido | T009 duplicado renumerado para T008-T010-T011-T013-T014 no plano 003 |
| **F9** | ✅ Corrigido | SVG de lírios esclarecido: "SVG vetorial estilizado com gradientes" + PNG como alternativa |
| **F10** | ✅ Corrigido | Ordem 002→003→004 documentada neste arquivo |
| **F11** | ✅ Corrigido | Nota sobre Great Vibes + fallback via `display:swap` já cobre |
| **F12** | ✅ Corrigido | Decisão documentada: remover gifts antigos (001, 003, 004, 005) |
| **F13** | ✅ Corrigido | Contagem: "15 individuais + 5 vaquinhas = 20" |
| **F14** | ✅ Corrigido | Categorias atualizadas com Batedeira em Cozinha |
| **F15** | ✅ Corrigido | Fallback simplificado: só Firestore + config.json |
| **F16** | ✅ Corrigido | "Hack" renomeado para "Prateleira Decorativa" |
| **F17** | ✅ Corrigido | Cama de Casal ajustada de R$ 2.500 → R$ 3.200 |

---

## Status Final dos Planos

| Plano | Localização | Tasks | Issues Restantes | Pronto pra Execução? |
|-------|------------|-------|-----------------|---------------------|
| **002** Visual | `specs/002-wedding-site-visual-improvements/` | 39 | 4 pendências menores nas specs/ | ✅ Sim (após corrigir specs/) |
| **003** Rebrand | `.omo/plans/003-invitation-rebrand.md` | 18 | Nenhuma | ✅ Sim |
| **004** Gifts | `.omo/plans/004-gift-catalog.md` | 10 | Nenhuma | ✅ Sim |

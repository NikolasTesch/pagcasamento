<!--
SYNC IMPACT REPORT
==================
Version change: [TEMPLATE] → 1.0.0 (initial ratification)
Modified principles: N/A (first version)
Added sections:
  - Core Principles (5 principles)
  - Design & UX Standards
  - Development Workflow
  - Governance
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (no changes required — generic structure applies)
  - .specify/templates/spec-template.md ✅ (no changes required — generic structure applies)
  - .specify/templates/tasks-template.md ✅ (no changes required — generic structure applies)
Follow-up TODOs:
  - TODO(COUPLE_NAMES): Replace with actual couple names when provided
  - TODO(PIX_KEY): Confirm Pix key type (CPF, phone, e-mail, or random key) with couple
  - TODO(EVENT_DATE): Confirm wedding date for any time-sensitive features
-->

# Site de Casamento — Constituição do Projeto

## Core Principles

### I. Conteúdo em Primeiro Lugar

O site existe para informar os convidados sobre o casal e o evento. Toda decisão de design e desenvolvimento DEVE priorizar a clareza e a acessibilidade das informações essenciais: quem são os noivos, quando e onde será o casamento.

**Regras não negociáveis**:
- A página principal DEVE exibir nome do casal, data, local e horário do evento de forma imediata e legível.
- Nenhum elemento decorativo ou interativo DEVE sobrepor ou dificultar o acesso às informações do evento.
- O conteúdo do evento DEVE ser facilmente atualizável sem alterar o código-fonte.

### II. Simplicidade e Elegância Visual

O site representa um momento único e especial. A interface DEVE transmitir sofisticação, leveza e emoção — sem poluição visual ou complexidade desnecessária.

**Regras não negociáveis**:
- Paleta de cores, tipografia e espaçamento DEVEM ser consistentes em todas as páginas.
- Animações e transições, quando usadas, DEVEM ser sutis e servir ao conteúdo, nunca distrair.
- Menos é mais: nenhum componente ou seção DEVE ser adicionado sem uma justificativa clara de valor para o convidado.

### III. Experiência de Presentes Sem Atrito

A lista de presentes é a funcionalidade central após a página principal. O fluxo de escolha e pagamento DEVE ser intuitivo, rápido e sem obstáculos técnicos para convidados de qualquer faixa etária.

**Regras não negociáveis**:
- Cada presente DEVE ser representado por um card claro, com imagem ilustrativa, nome e valor.
- O caminho de "ver presente → decidir comprar → realizar pagamento" DEVE ser completado em no máximo 3 interações.
- O sistema DEVE exibir o QR Code Pix ou chave Pix imediatamente após a seleção do presente, sem redirecionamentos externos desnecessários.

### IV. Transparência no Pagamento

O presente é fictício, mas o pagamento é real. O convidado DEVE entender exatamente o que está acontecendo, quanto vai pagar e para quem o dinheiro será transferido.

**Regras não negociáveis**:
- O valor do presente DEVE ser exibido antes de qualquer ação de pagamento.
- A chave Pix do casal e o valor exato DEVEM ser apresentados de forma clara na tela de pagamento.
- NUNCA processar ou armazenar dados de pagamento do convidado — a transferência ocorre diretamente pelo app bancário do convidado.
- Uma mensagem de confirmação de intenção DEVE ser exibida antes de apresentar o QR Code ("Você está presenteando o casal com [PRESENTE] no valor de R$ [VALOR]. Confirmar?").

### V. Responsividade e Acessibilidade

Os convidados acessarão o site principalmente por celular, em diferentes condições de conexão e diferentes níveis de familiaridade com tecnologia. O site DEVE funcionar perfeitamente em qualquer dispositivo.

**Regras não negociáveis**:
- O layout DEVE ser mobile-first: projetado e testado primeiro para telas de celular.
- Todas as imagens DEVEM ter texto alternativo descritivo.
- Contraste de texto DEVE atender ao mínimo WCAG AA (razão 4.5:1 para texto normal).
- O site DEVE carregar a página principal em menos de 3 segundos em conexão 4G.

## Design & UX Standards

**Identidade Visual**:
- Paleta baseada em tons suaves e elegantes (branco, off-white, dourado, ou conforme escolha do casal).
- Tipografia serifada para títulos (romantismo e elegância) e sans-serif para corpo de texto (legibilidade).
- Uso de fotografia do casal como elemento central da página principal.

**Navegação**:
- O site DEVE ter no máximo 2 páginas: Página Principal e Lista de Presentes.
- A transição entre páginas DEVE ser suave e preservar o contexto do usuário.
- Um botão/link claro de "Lista de Presentes" DEVE estar visível na página principal.

**Estados de Interface**:
- Todo card de presente DEVE ter estado padrão, hover/foco e selecionado.
- A tela de pagamento DEVE ter um botão "Copiar chave Pix" com feedback visual de confirmação ("Copiado!").
- Após o pagamento, o convidado DEVE ter uma opção para "Deixar uma mensagem" ou "Voltar à lista".

## Development Workflow

**Priorização**:
1. Página principal com informações do evento (P1 — fundação do site)
2. Lista de presentes com cards (P2 — funcionalidade principal)
3. Fluxo de pagamento via Pix (P3 — converte intenção em ação)
4. Mensagem de confirmação e agradecimento (P4 — experiência completa)

**Qualidade**:
- Cada página DEVE ser revisada em celular (iOS e Android), tablet e desktop antes de ser considerada pronta.
- Links, botões e o mecanismo de cópia do Pix DEVEM ser testados manualmente antes de qualquer deploy.
- Nenhum dado pessoal de convidados DEVE ser coletado sem consentimento explícito.

**Deploy**:
- O site DEVE ser hospedado em domínio com HTTPS obrigatório.
- Atualizações de conteúdo (data, local, lista de presentes) DEVEM ser possíveis sem redesenhar ou reescrever o código.

## Governance

Esta constituição representa os valores e restrições inegociáveis do projeto "Site de Casamento". Qualquer decisão técnica ou de design que conflite com um dos princípios acima DEVE ser escalada para discussão antes de ser implementada.

**Procedimento de emenda**:
- Alterações de princípios existentes requerem justificativa explícita e atualização da versão (MINOR ou MAJOR conforme impacto).
- Adição de nova seção ou princípio: incremento MINOR.
- Correções de redação ou clarificações: incremento PATCH.
- Todas as emendas DEVEM registrar `LAST_AMENDED_DATE`.

**Compliance**:
- A cada nova feature ou correção, verificar se os princípios I–V são respeitados.
- Decisões arquiteturais fora do padrão DEVEM ser documentadas com justificativa.

**Version**: 1.0.0 | **Ratified**: 2026-05-23 | **Last Amended**: 2026-05-23

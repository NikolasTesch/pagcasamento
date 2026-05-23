# Feature Specification: Site de Casamento com Lista de Presentes

**Feature Branch**: `001-wedding-site-gifts`

**Created**: 2026-05-23

**Status**: Draft

**Input**: Wedding website with a gift list and Pix payment flow (derived from project constitution)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Página Principal com Informações do Evento (Priority: P1)

Como convidado, quero acessar o site e ver imediatamente quem são os noivos, a data, o local e o horário do casamento, para confirmar as informações do evento.

**Why this priority**: Fundação do site — sem isso, o site não tem propósito. Todos os convidados passam por aqui primeiro.

**Independent Test**: Pode ser testado abrindo o site em um celular e verificando se nome do casal, data, local e horário estão visíveis sem precisar rolar a página.

**Acceptance Scenarios**:

1. **Given** o convidado acessa a URL do site, **When** a página carrega, **Then** o nome do casal, a data, o local e o horário do casamento estão visíveis no viewport inicial (above the fold em mobile).
2. **Given** o convidado está na página principal, **When** ele rola a página, **Then** um botão ou link visível para "Lista de Presentes" está presente.
3. **Given** o convidado acessa via celular com conexão 4G, **When** a página carrega, **Then** o conteúdo principal aparece em menos de 3 segundos.

---

### User Story 2 - Visualizar Lista de Presentes (Priority: P2)

Como convidado, quero ver a lista de presentes com imagem, nome e valor de cada item, para escolher o que quero presentear ao casal.

**Why this priority**: Funcionalidade central do site — sem a lista, não há propósito comercial.

**Independent Test**: Pode ser testado navegando até a lista e verificando que todos os presentes aparecem com imagem, nome e valor legíveis em celular.

**Acceptance Scenarios**:

1. **Given** o convidado está na lista de presentes, **When** a página carrega, **Then** cada presente é exibido como um card com imagem ilustrativa, nome e valor em reais.
2. **Given** o convidado vê a lista, **When** ele passa o mouse sobre um card (desktop) ou toca (mobile), **Then** o card exibe feedback visual de hover/foco.
3. **Given** o convidado visualiza a lista, **When** um presente já foi presenteado, **Then** o card indica que foi "presenteado" e não permite nova seleção.

---

### User Story 3 - Selecionar Presente e Ver Confirmação (Priority: P2)

Como convidado, quero selecionar um presente e ver uma tela de confirmação antes do pagamento, para ter certeza do que estou escolhendo e quanto vou pagar.

**Why this priority**: Passo intermediário obrigatório — a constituição exige confirmação de intenção antes do QR Code.

**Independent Test**: Pode ser testado selecionando um presente e verificando que a tela de confirmação exibe nome do presente e valor correto.

**Acceptance Scenarios**:

1. **Given** o convidado vê a lista, **When** ele clica em um presente, **Then** aparece uma tela/modal de confirmação com texto "Você está presenteando o casal com [PRESENTE] no valor de R$ [VALOR]. Confirmar?"
2. **Given** a tela de confirmação está aberta, **When** o convidado clica "Confirmar", **Then** a tela de pagamento Pix é exibida imediatamente.
3. **Given** a tela de confirmação está aberta, **When** o convidado clica "Cancelar" ou "Voltar", **Then** retorna à lista de presentes sem alterações.

---

### User Story 4 - Realizar Pagamento via Pix (Priority: P3)

Como convidado, quero ver o QR Code Pix e a chave Pix com o valor exato do presente, para realizar a transferência diretamente pelo meu app bancário.

**Why this priority**: Converte intenção em ação — é o passo que gera o presente de fato.

**Independent Test**: Pode ser testado selecionando um presente, confirmando e verificando que o QR Code e a chave Pix aparecem com o valor correto, e o botão "Copiar chave" funciona.

**Acceptance Scenarios**:

1. **Given** o convidado confirmou a intenção, **When** a tela de pagamento abre, **Then** exibe QR Code Pix, chave Pix do casal e o valor exato do presente em destaque.
2. **Given** o convidado está na tela de pagamento, **When** ele clica em "Copiar chave Pix", **Then** a chave é copiada para a área de transferência e o botão exibe "Copiado!" por 2 segundos.
3. **Given** o convidado está na tela de pagamento, **When** ele escaneia o QR Code com o app bancário, **Then** o app bancário exibe o valor pré-preenchido (se a chave Pix suportar payload dinâmico).

---

### User Story 5 - Deixar Mensagem e Agradecer (Priority: P4)

Como convidado, após o pagamento, quero ter a opção de deixar uma mensagem ao casal e/ou voltar à lista.

**Why this priority**: Completa a experiência — o convidado sente que fez algo significativo além do pagamento.

**Independent Test**: Pode ser testado verificando que após a tela de pagamento há opções de "Deixar uma mensagem" e "Voltar à lista".

**Acceptance Scenarios**:

1. **Given** o convidado está na tela de pagamento, **When** ele vê a tela, **Then** há dois botões: "Deixar uma mensagem" e "Voltar à lista de presentes".
2. **Given** o convidado clica em "Deixar uma mensagem", **When** digita e envia, **Then** a mensagem é registrada (armazenada localmente ou enviada via link de e-mail/WhatsApp ao casal).
3. **Given** o convidado clica em "Voltar à lista", **When** o clique é processado, **Then** retorna à lista de presentes com o presente recém-presenteado marcado como "presenteado".

---

### Edge Cases

- O que acontece quando o convidado tenta acessar a tela de pagamento sem ter selecionado um presente?
- O que acontece se o convidado atualizar a página durante o fluxo de pagamento?
- Como o sistema trata presentes com valores decimais (ex: R$ 149,90)?
- O que acontece se a imagem de um presente não carregar?
- Como o site se comporta sem conexão com internet (offline)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O site DEVE exibir nome do casal, data, local e horário do evento na página principal de forma imediata e legível.
- **FR-002**: O site DEVE ter um botão/link visível de "Lista de Presentes" na página principal.
- **FR-003**: A lista de presentes DEVE exibir cada item como card com imagem ilustrativa, nome e valor em reais.
- **FR-004**: O convidado DEVE poder selecionar um presente e ver uma confirmação de intenção antes do pagamento.
- **FR-005**: A tela de pagamento DEVE exibir QR Code Pix, chave Pix e valor exato do presente.
- **FR-006**: O botão "Copiar chave Pix" DEVE copiar a chave e exibir feedback visual ("Copiado!") por 2 segundos.
- **FR-007**: O fluxo completo de "ver presente → confirmar → pagar" DEVE ser concluído em no máximo 3 interações.
- **FR-008**: O site DEVE funcionar sem backend — todo o conteúdo vem de um arquivo de configuração estático (JSON).
- **FR-009**: O conteúdo (dados do evento, lista de presentes, chave Pix) DEVE ser atualizável sem modificar o código-fonte.
- **FR-010**: O sistema NUNCA deve processar ou armazenar dados de pagamento do convidado.
- **FR-011**: Após o pagamento, o convidado DEVE ter a opção de "Deixar uma mensagem" ou "Voltar à lista".
- **FR-012**: Presentes já presenteados DEVEM ser marcados como tal e não permitir nova seleção (usando localStorage para persistência local).

### Key Entities

- **WeddingInfo**: Informações do evento (nome do casal, data, local, horário, foto do casal)
- **Gift**: Item da lista de presentes (id, nome, valor, imagem, descricao, presenteado)
- **PixConfig**: Configuração do pagamento Pix (chave, tipo, nome do beneficiário, cidade)
- **GuestMessage**: Mensagem deixada pelo convidado (nome, mensagem, presente escolhido)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Convidado completa o fluxo de presentear em no máximo 3 cliques (selecionar → confirmar → ver QR Code).
- **SC-002**: Página principal carrega em menos de 3 segundos em conexão 4G (testado no Chrome DevTools com throttling 4G).
- **SC-003**: Todos os elementos de texto passam no contraste mínimo WCAG AA (razão 4.5:1).
- **SC-004**: O site é funcional e usável em viewport de 375px de largura (iPhone SE) sem scroll horizontal.
- **SC-005**: A chave Pix é copiada corretamente com o botão "Copiar" em iOS Safari, Android Chrome e Chrome Desktop.
- **SC-006**: O conteúdo do site (presentes, data, local) pode ser atualizado editando apenas o arquivo `config.json` sem tocar em HTML/CSS/JS.

## Assumptions

- Os convidados usam principalmente celular (Android e iOS) para acessar o site.
- A chave Pix do casal é um tipo estático (CPF, e-mail, telefone ou chave aleatória) — será configurada em `config.json`.
- O casal fornecerá fotos e imagens dos presentes antes do deploy.
- Não há necessidade de confirmação de pagamento real — o convidado confirma manualmente via WhatsApp ou presencialmente.
- A lista de presentes é pequena (até 50 itens) — não há necessidade de filtros ou busca.
- O site é estático (sem servidor de aplicação) — hospedado em Vercel, Netlify ou GitHub Pages.
- A "mensagem" do convidado será enviada via link de WhatsApp pré-formatado (não requer backend).

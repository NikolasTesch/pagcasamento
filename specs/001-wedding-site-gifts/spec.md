# Feature Specification: Site de Casamento com Lista de Presentes

**Feature Branch**: `001-wedding-site-gifts`

**Created**: 2026-05-23

**Status**: Draft

**Input**: Wedding website with a gift list and Pix payment flow (derived from project constitution)

## Clarifications

### Session 2026-05-23

- Q: Como o casal irá cadastrar e atualizar os presentes? → A: Através de um arquivo `config.json` ou `gifts.json` no código do projeto. Qualquer alteração de valor ou foto exige uma edição no código e um novo deploy.
- Q: Qual o escopo de páginas e visual do site? → A: Teremos duas páginas distintas: uma página principal (Homepage) contendo as informações do evento e a história do casal, e uma página secundária separada exclusivamente para a exibição da lista de presentes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Página Principal com História do Casal e Evento (Priority: P1)

Como convidado, quero acessar o site e ler a história do casal, além de ver imediatamente quem são os noivos, a data, o local e o horário do casamento, para me conectar com o casal e me informar sobre o evento.

**Why this priority**: Fundação do site e engajamento emocional dos convidados — todos os convidados acessam primeiro a homepage para conhecer a história e os detalhes do evento.

**Independent Test**: Pode ser testado abrindo o site, lendo a história do casal e confirmando se a data, local, horário e fotos do casal estão legíveis e bem estruturados.

**Acceptance Scenarios**:

1. **Given** o convidado acessa a URL principal, **When** a homepage carrega, **Then** o nome dos noivos, a data e a história do casal são exibidos de forma fluida com transições suaves e tipografia elegante.
2. **Given** o convidado está na homepage, **When** ele navega no menu ou clica no botão principal, **Then** ele é direcionado para a página separada de "Lista de Presentes".
3. **Given** a homepage é carregada, **When** o convidado visualiza a história, **Then** há fotos do casal que carregam com lazy-loading para otimização de velocidade (< 3 segundos em 4G).

---

### User Story 2 - Visualizar Lista de Presentes em Página Separada (Priority: P2)

Como convidado, quero acessar uma página dedicada à lista de presentes, visualizando imagem, nome e valor de cada item de forma organizada, para escolher o que quero presentear ao casal sem misturar com a homepage.

**Why this priority**: Organização visual clara e foco de navegação — separa a experiência emocional e informativa (história) da experiência transacional (presentes).

**Independent Test**: Pode ser testado clicando em "Lista de Presentes" na homepage, verificando a transição/carregamento da nova página dedicada `/presentes.html` e a exibição legível de todos os cards de presentes.

**Acceptance Scenarios**:

1. **Given** o convidado está na homepage, **When** ele clica no link "Presentes", **Then** a página dedicada `/presentes` (ou `/presentes.html`) carrega exibindo a lista completa de presentes em cards individuais.
2. **Given** o convidado vê a página de presentes, **When** ele passa o mouse sobre um card (desktop) ou toca (mobile), **Then** o card exibe feedback visual premium de hover (leve elevação/zoom sutil) e foco.
3. **Given** o convidado visualiza a lista, **When** um presente já foi marcado como comprado no `config.json` ou `gifts.json`, **Then** o card exibe um selo indiscutível de "Presenteado!" e desabilita novas tentativas de compra.

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

- **FR-001**: A página principal (Homepage) DEVE exibir de forma legível e elegante o nome do casal, a data, o local, o horário e a história de amor dos noivos.
- **FR-002**: A Homepage DEVE conter um botão/link destacado de navegação que direcione para a página separada de "Lista de Presentes".
- **FR-003**: A página dedicada de presentes DEVE exibir a lista carregada dinamicamente a partir de um arquivo `config.json` ou `gifts.json` em formato de cards (com imagem, título e valor).
- **FR-004**: O convidado DEVE poder selecionar um presente na página de presentes e ver uma confirmação de intenção antes do pagamento.
- **FR-005**: A tela de pagamento DEVE exibir QR Code Pix, chave Pix e valor exato do presente.
- **FR-006**: O botão "Copiar chave Pix" DEVE copiar a chave e exibir feedback visual ("Copiado!") por 2 segundos.
- **FR-007**: O fluxo completo de "ver presente → confirmar → pagar" DEVE ser concluído em no máximo 3 interações.
- **FR-008**: O site DEVE funcionar de forma 100% estática (Jamstack), sem banco de dados ativo ou backend — todo o conteúdo de textos, história e lista de presentes vem do arquivo `config.json` ou `gifts.json`.
- **FR-009**: A atualização da lista de presentes ou dados do evento DEVE ser feita editando exclusivamente o arquivo `config.json` ou `gifts.json` no repositório, exigindo um deploy estático automático subsequente.
- **FR-010**: O sistema NUNCA deve processar ou armazenar dados de pagamento do convidado.
- **FR-011**: Após o pagamento, o convidado DEVE ter a opção de ser direcionado a "Deixar uma mensagem" (que abrirá um link de WhatsApp com mensagem pré-formatada para o casal) ou "Voltar à lista".
- **FR-012**: Presentes já presenteados DEVEM ser marcados como tal no dispositivo do convidado (via localStorage) e não permitir nova seleção no mesmo dispositivo. O status não é compartilhado entre dispositivos — o mesmo presente pode ser presenteado por convidados diferentes em dispositivos distintos; eventuais duplicatas são gerenciadas pelo casal.

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

## Clarifications

### Session 2026-05-23

- Q: Como o QR Code Pix deve ser gerado e o que aparece na tela de pagamento? → A: QR Code gerado dinamicamente no navegador (client-side, biblioteca JS) com valor pré-preenchido + chave Pix copiável + imagem do presente, exibidos juntos na tela de pagamento.
- Q: O status "presenteado" de um presente é compartilhado entre todos os convidados ou apenas por dispositivo? → A: Apenas por dispositivo (localStorage) — o site permanece 100% estático; eventuais duplicatas são gerenciadas pelo casal.
- Q: Como a mensagem do convidado deve chegar ao casal após o pagamento? → A: Link WhatsApp (wa.me) com mensagem pré-formatada incluindo o nome do presente escolhido — sem backend, abre diretamente no app do convidado.

## Assumptions

- Os convidados usam principalmente celular (Android e iOS) para acessar o site.
- A chave Pix do casal é um tipo estático (CPF, e-mail, telefone ou chave aleatória) — será configurada em `config.json`.
- O casal fornecerá fotos e imagens dos presentes antes do deploy.
- Não há necessidade de confirmação de pagamento real — o convidado confirma manualmente via WhatsApp ou presencialmente.
- A lista de presentes é pequena (até 50 itens) — não há necessidade de filtros ou busca.
- O site é estático (sem servidor de aplicação) — hospedado em Vercel, Netlify ou GitHub Pages.
- A mensagem do convidado é enviada via link WhatsApp (wa.me) pré-formatado com o nome do presente — não requer backend. O número do WhatsApp do casal será configurado em `config.json`.

# Quickstart: Site de Casamento com Lista de Presentes

**Feature**: `001-wedding-site-gifts`
**Date**: 2026-05-23

---

## Pré-requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- (Opcional) VS Code com extensão "Live Server" para desenvolvimento local

**Não é necessário**: Node.js, npm, Python, ou qualquer runtime. O projeto é HTML puro.

---

## Estrutura de Arquivos do Projeto

```text
pagcasamento/
├── index.html              # Arquivo principal (única página HTML)
├── config.json             # Conteúdo do site (edite aqui para atualizar)
├── css/
│   ├── main.css            # Estilos globais e variáveis CSS
│   ├── home.css            # Estilos da seção home
│   └── gifts.css           # Estilos da lista de presentes e modais
├── js/
│   ├── app.js              # Bootstrap da aplicação e roteamento por hash
│   ├── home.js             # Renderização da seção home
│   ├── gifts.js            # Renderização da lista e interações
│   ├── pix.js              # Geração de payload Pix EMV + CRC16
│   └── storage.js          # Wrapper do localStorage
├── lib/
│   └── qrcode.min.js       # qrcode-generator (copiado localmente, sem CDN)
├── images/
│   ├── casal.jpg           # Foto principal do casal
│   └── gifts/              # Imagens dos presentes
│       ├── gift-001.jpg
│       └── ...
└── specs/                  # Documentação do projeto (não faz parte do site)
```

---

## Desenvolvimento Local

### Opção 1: VS Code + Live Server (recomendado)

1. Instale a extensão "Live Server" no VS Code
2. Abra a pasta `pagcasamento/` no VS Code
3. Clique em "Go Live" na barra de status (canto inferior direito)
4. O site abrirá em `http://localhost:5500` com hot reload automático

### Opção 2: Python HTTP Server

```bash
# Na pasta pagcasamento/
python -m http.server 8080
# Acesse http://localhost:8080
```

### Opção 3: npx serve

```bash
npx serve .
# Acesse http://localhost:3000
```

> **Por que não abrir o index.html direto?** O navegador bloqueia `fetch()` de arquivos locais por segurança (CORS). Um servidor local resolve isso.

---

## Configurar o Site

Edite o arquivo `config.json` na raiz do projeto:

```json
{
  "wedding": {
    "coupleName": "ANA & PEDRO",
    "weddingDate": "2026-08-15",
    "weddingTime": "17:00",
    "venue": {
      "name": "Espaço Giardino",
      "address": "Rua das Flores, 123 - São Paulo, SP",
      "mapsUrl": "https://maps.google.com/..."
    },
    "couplePhotoUrl": "/images/casal.jpg",
    "message": "Mensagem de boas-vindas aqui"
  },
  "gifts": [
    {
      "id": "gift-001",
      "name": "Nome do presente",
      "value": 150.00,
      "imageUrl": "/images/gifts/gift-001.jpg",
      "available": true
    }
  ],
  "pix": {
    "key": "suachavepix@email.com",
    "keyType": "email",
    "receiverName": "ANA E PEDRO",
    "city": "SAO PAULO",
    "whatsappNumber": "+5511999999999"
  }
}
```

---

## Testar o Fluxo de Pagamento Pix

1. Abra o site no navegador
2. Navegue para "Lista de Presentes"
3. Clique em qualquer card disponível
4. Confirme o presente no modal
5. Verifique: QR Code renderizado, chave Pix visível, valor correto
6. Teste o botão "Copiar chave" — deve exibir "Copiado!" por 2 segundos
7. Teste o botão "Deixar uma mensagem" — deve abrir WhatsApp (se configurado)

**Validar QR Code Pix**: Escaneie com seu app bancário e verifique se o nome do recebedor e o valor estão corretos.

---

## Deploy para Produção (Vercel)

### Deploy inicial

1. Crie conta em [vercel.com](https://vercel.com) (gratuito)
2. Conecte ao repositório GitHub
3. Configure:
   - **Framework Preset**: Other
   - **Build Command**: (vazio — sem build)
   - **Output Directory**: `.` (raiz do projeto)
4. Clique em "Deploy"

### Deploy de atualizações

Qualquer `git push` para `main` aciona deploy automático:

```bash
# Após editar config.json ou qualquer arquivo:
git add config.json
git commit -m "feat: atualizar lista de presentes"
git push origin main
# Site atualizado em ~20 segundos
```

---

## Checklist de Go-Live

- [ ] `config.json` preenchido com dados reais do casal
- [ ] Fotos do casal e dos presentes adicionadas em `images/`
- [ ] Chave Pix testada com app bancário real
- [ ] Botão "Copiar chave" testado em iOS Safari e Android Chrome
- [ ] Site revisado em celular iOS e Android
- [ ] Site revisado em desktop (Chrome, Firefox, Safari)
- [ ] Contraste de texto verificado (WCAG AA)
- [ ] Tempo de carregamento < 3 segundos em conexão 4G
- [ ] Domínio personalizado configurado no Vercel (opcional)
- [ ] HTTPS ativo (automático no Vercel)
- [ ] Link do site compartilhado com o casal para aprovação final

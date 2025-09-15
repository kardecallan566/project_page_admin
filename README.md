# 📦 Projeto com PNPM + Prisma + Next.js

## 🚀 Instalação do PNPM
Se ainda não tiver o **pnpm** instalado, rode o comando oficial:  
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Verifique se instalou corretamente:
```bash
pnpm -v
```

---

## 📥 Instalar dependências
Após clonar o repositório, instale as dependências do projeto:  
```bash
pnpm install
```

---

## 🗄️ Prisma
Gere o cliente do Prisma:  
```bash
pnpm prisma generate
```

Se precisar rodar as migrações do banco de dados:  
```bash
pnpm prisma migrate dev
```

---

## 🛠️ Build do projeto
Para gerar a build de produção:  
```bash
pnpm run build
```

---

## ▶️ Rodar em desenvolvimento
Inicie o servidor em modo **dev**:  
```bash
pnpm run dev
```

O projeto estará disponível em:  
👉 [http://localhost:3000](http://localhost:3000)

---

## ✅ Checklist rápido
- [ ] Instalar **pnpm**  
- [ ] Rodar `pnpm install`  
- [ ] Gerar Prisma Client com `pnpm prisma generate`  
- [ ] Rodar migrations (se necessário)  
- [ ] Rodar `pnpm run dev` e acessar a aplicação  

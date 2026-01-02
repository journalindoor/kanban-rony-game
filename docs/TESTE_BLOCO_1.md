# 🧪 TESTE RÁPIDO — BLOCO 1

**Como testar o BLOCO 1 em 2 minutos**

---

## 1️⃣ ABRIR TUTORIAL

```
Abrir: tutorial.html no navegador
```

**Esperado:**
- ✅ Message box aparece no **canto inferior esquerdo**
- ✅ Título: "🎮 Bem-vindo ao Kanban Rony Game!"
- ✅ Contador: "1 / 3"
- ✅ Jogo totalmente visível (sem escurecimento)

---

## 2️⃣ PASSO 1 → PASSO 2

```
Ação: Clicar "Próximo"
```

**Esperado:**
- ✅ Título muda para: "👀 Esse é o seu fluxo de trabalho"
- ✅ Board fica destacado (outline laranja)
- ✅ Contador: "2 / 3"

---

## 3️⃣ PASSO 2 → PASSO 3

```
Ação: Clicar "Próximo"
```

**Esperado:**
- ✅ Título muda para: "🧠 Aqui você não controla tarefas"
- ✅ Área de papéis fica destacada
- ✅ Após 2.5 segundos → Botão "Iniciar Turno" fica destacado
- ✅ Contador: "3 / 3"
- ✅ Botão "Próximo" muda para "Concluir"

---

## 4️⃣ TESTAR BLOQUEIO

```
Ação: Tentar clicar "Iniciar Turno" durante qualquer passo
```

**Esperado:**
- ✅ Nada acontece (ação bloqueada)
- ✅ Console sem erros

```
Ação: Tentar arrastar carta
```

**Esperado:**
- ✅ Drag não inicia (bloqueado)

---

## 5️⃣ FINALIZAR

```
Ação: Clicar "Concluir" no Passo 3
```

**Esperado:**
- ✅ Redireciona para index.html
- ✅ Jogo funciona normalmente

---

## 6️⃣ PULAR TUTORIAL

```
Ação: Recarregar tutorial.html e clicar "Pular"
```

**Esperado:**
- ✅ Alerta de confirmação
- ✅ Redireciona para index.html

---

## ✅ CHECKLIST RÁPIDO

- [ ] Message box no canto inferior esquerdo
- [ ] Sem escurecimento da tela
- [ ] 3 passos visíveis
- [ ] Highlights funcionam
- [ ] Navegação funciona
- [ ] Ações bloqueadas
- [ ] Botão "Pular" funciona
- [ ] Zero erros no console

---

**Se todos os itens OK → ✅ BLOCO 1 FUNCIONANDO**

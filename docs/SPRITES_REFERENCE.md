# Referência de Sprites - RonyOffice

## Arquivo de Expressões do Rony (Modais e UI)
**Arquivo:** `assets/rony-modal.png`  
**Dimensões do arquivo:** 360px × 240px  
**Dimensão de cada sprite:** 120px × 120px  
**Renderização:** `image-rendering: pixelated` para manter estilo pixel art

---

## Layout do Sprite Sheet - Expressões do Rony

O arquivo `rony-modal.png` contém diferentes expressões e poses do Rony para uso em modais, tutoriais e mensagens:

```
[0, 0]              [-120px, 0]           [-240px, 0]
Rony Normal         Rony Apontando        Rony Frustrado
                    pra Direita           

[0, -120px]         [-100px, -120px]      [-225px, -120px]
Rony Sorrindo       Rony Dando Joinha     Rony Fazendo OK
                                          (Elogiando)
```

---

## Posições das Expressões

### Rony Normal
```css
background-image: url('../assets/rony-modal.png');
background-position: 0 0;
```
**Uso:** Estado neutro, padrão

### Rony Apontando pra Direita
```css
background-image: url('../assets/rony-modal.png');
background-position: -120px 0;
```
**Uso:** Indicar direção, dar dicas

### Rony Frustrado
```css
background-image: url('../assets/rony-modal.png');
background-position: -240px 0;
```
**Uso:** Erros, problemas, situações negativas

### Rony Sorrindo
```css
background-image: url('../assets/rony-modal.png');
background-position: 0 -120px;
```
**Uso:** Mensagens positivas, boas-vindas

### Rony Dando Joinha
```css
background-image: url('../assets/rony-modal.png');
background-position: -100px -120px;
```
**Uso:** Aprovação, confirmação, sucesso (usado no Modo Livre)

### Rony Fazendo OK (Elogiando)
```css
background-image: url('../assets/rony-modal.png');
background-position: -225px -120px;
```
**Uso:** Excelente trabalho, conquistas, parabenizações (usado nos Capítulos)

---

## Uso na Tela de Boas-Vindas (index.html)

#### Tutorial
```css
.option-card.tutorial .option-sprite {
    background-image: url('../assets/rony-modal.png');
    background-position: -120px 0; /* Rony Apontando pra Direita */
}
```

#### Modo Livre
```css
.option-card.modo-livre .option-sprite {
    background-image: url('../assets/rony-modal.png');
    background-position: -100px -120px; /* Rony Dando Joinha */
}
```

#### Capítulos
```css
.option-card.capitulos .option-sprite {
    background-image: url('../assets/rony-modal.png');
    background-position: -225px -120px; /* Rony Fazendo OK */
}
```

---

## Sprites Individuais (GIF Animados)

### Analistas
- `assets/analista1-idle.gif` - Analista 1 (idle)
- `assets/analista1-working.gif` - Analista 1 (trabalhando)
- `assets/analista2-idle.gif` - Analista 2 (idle)
- `assets/analista2-working.gif` - Analista 2 (trabalhando)
- `assets/analista3-idle.gif` - Analista 3 (idle)
- `assets/analista3-working.gif` - Analista 3 (trabalhando)

### Programadores
- `assets/programador1-idle.gif` - Programador 1 (idle)
- `assets/programador1-working.gif` - Programador 1 (trabalhando)
- `assets/programador2-idle.gif` - Programador 2 (idle)
- `assets/programador2-working.gif` - Programador 2 (trabalhando)
- `assets/programador3-idle.gif` - Programador 3 (idle)
- `assets/programador3-working.gif` - Programador 3 (trabalhando)

### QA/Testers
- `assets/qa1-idle.gif` - QA 1 (idle)
- `assets/qa1-working.gif` - QA 1 (trabalhando)
- `assets/qa2-idle.gif` - QA 2 (idle)
- `assets/qa2-working.gif` - QA 2 (trabalhando)
- `assets/qa3-idle.gif` - QA 3 (idle)
- `assets/qa3-working.gif` - QA 3 (trabalhando)

### Outros Assets
- `assets/computador1.png` - Computador estado 1
- `assets/computador2.png` - Computador estado 2
- `assets/offline.png` - Estado offline
- `assets/bkp-personagem-base-idle.png` - Backup do personagem base (idle)
- `assets/bkp-personagem-base-working.png` - Backup do personagem base (working)

---

## Notas Técnicas

### Image Rendering
Para manter a qualidade pixel art:
```css
image-rendering: pixelated;
image-rendering: -moz-crisp-edges;
image-rendering: crisp-edges;
```

### Background Size
Quando usar o sprite sheet completo:
```css
background-size: 360px 240px;
```

### Coordenadas Negativas
As posições usam valores negativos porque `background-position` move a imagem, não a viewport:
- `-120px` = move a imagem 120px para a esquerda (mostra a segunda coluna)
- `-240px` = move a imagem 240px para a esquerda (mostra a terceira coluna)

---

## Atualização
**Última atualização:** Janeiro 2026  
**Arquivo CSS principal:** `css/home.css`  
**Sprites desabilitados:** Animações removidas para versão estática

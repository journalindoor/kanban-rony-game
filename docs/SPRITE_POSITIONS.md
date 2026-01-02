# Posições dos Sprites - Rony Modal

## Visão Geral
O arquivo `assets/rony-modal.png` contém 6 variações do personagem Rony em uma sprite sheet.

## Especificações Técnicas
- **Arquivo**: `assets/rony-modal.png`
- **Dimensões da sprite sheet**: 300x200px (para modais de 100px) ou 360x240px (para modais de 120px)
- **Tamanho de cada sprite**: 100x100px ou 120x120px (dependendo do contexto)
- **Grid**: 3 colunas x 2 linhas

## Posições do Rony para Modais

### 1. Rony Normal
**Uso**: Modal de boas-vindas, situações neutras
```css
background-position: 0px 0px;
```

### 2. Rony Apontando
**Uso**: Indicar elementos, dar instruções, tutorial
```css
background-position: -100px 0px;
```

### 3. Rony Frustrado
**Uso**: Erros, avisos, situações negativas
```css
background-position: -200px 0px;
```

### 4. Rony Alegre
**Uso**: Conquistas, feedback positivo
```css
background-position: 0px -100px;
```

### 5. Rony Thumbs Up
**Uso**: Confirmações, aprovações, feedback positivo
```css
background-position: -85px -100px;
```
**Nota**: Offset ajustado para -85px ao invés de -100px

### 6. Rony Parabéns
**Uso**: Conclusão de capítulos, grandes conquistas
```css
background-position: -185px -100px;
```
**Nota**: Offset ajustado para -185px ao invés de -200px

## Implementação

### Modal Padrão (120x120px)
```html
<div class="modal-character" style="flex:0 0 30%; display:flex; justify-content:center; align-items:center;">
    <div style="width:120px; height:120px; background-image:url('assets/rony-modal.png'); background-size:360px 240px; background-position:0 0; background-repeat:no-repeat;"></div>
</div>
```

### Tutorial Box (100x100px)
```html
<div class="tutorial-character" style="flex:0 0 100px; display:flex; justify-content:center; align-items:flex-start; padding-top:8px;">
    <div style="width:100px; height:100px; background-image:url('assets/rony-modal.png'); background-size:300px 200px; background-position:0 0; background-repeat:no-repeat;"></div>
</div>
```

## Exemplos de Uso

### Welcome Modal (index.html)
```css
background-position: 0 0; /* Rony Normal */
```

### Chapter Transition Modal (chapter1.html)
```css
background-position: -120px 0; /* Rony Apontando (ajustado para 120px) */
```

### Tutorial Message Box (tutorial.html)
```css
background-position: 0 0; /* Rony Normal */
```

## Conversão de Coordenadas

Para sprites de **100x100px** (tutorial):
- Use as coordenadas exatas listadas acima
- `background-size: 300px 200px`

Para sprites de **120x120px** (modais):
- Multiplique as coordenadas por 1.2
- `background-size: 360px 240px`

### Tabela de Conversão

| Sprite | 100px (Tutorial) | 120px (Modal) |
|--------|------------------|---------------|
| Normal | `0 0` | `0 0` |
| Apontando | `-100px 0` | `-120px 0` |
| Frustrado | `-200px 0` | `-240px 0` |
| Alegre | `0 -100px` | `0 -120px` |
| Thumbs Up | `-85px -100px` | `-102px -120px` |
| Parabéns | `-185px -100px` | `-222px -120px` |

## Boas Práticas

1. **Consistência**: Use o mesmo Rony para situações similares em todo o jogo
2. **Contexto**: Escolha o Rony apropriado para a emoção/situação do modal
3. **Performance**: Carregue a sprite sheet uma vez, reutilize via `background-position`
4. **Acessibilidade**: Sempre adicione `alt` text apropriado quando usar `<img>` tag

## Futuro

Para adicionar novos personagens:
1. Criar nova sprite sheet no formato 3x2 (300x200px ou múltiplos)
2. Adicionar documentação neste arquivo
3. Atualizar sistema para suportar múltiplos personagens
4. Manter Rony como personagem "coringa" padrão

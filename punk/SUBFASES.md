# Sistema de Subfases (Variantes)

## Conceito

O sistema de subfases permite criar variações visuais da mesma fase narrativa sem duplicar textos ou quebrar a progressão do jogo.

## Arquitetura

### Campos de Fase

Cada fase possui:
- `basePhase` (number): Fase narrativa base (0, 1, 2...)
- `variant` (string | null): Variante visual ("a", "b", "c"... ou null para fase principal)
- Todos os outros campos (name, sky, environment, obstacles, items)

### Funções Auxiliares

- `getCurrentPhase()`: Retorna fase atual completa
- `getCurrentBasePhase()`: Retorna apenas o número da fase base (para narrativa)
- `getCurrentVariant()`: Retorna a variante atual (null, "a", "b"...)
- `getCurrentPhaseId()`: Retorna ID completo ("0", "0a", "1b"...)

## Regras de Implementação

### ✅ Usar `getCurrentBasePhase()` para:

- Desbloqueio de textos no painel de leitura
- Progressão narrativa
- Lógica de história
- Verificações de "qual fase narrativa estamos"

### ✅ Usar `getCurrentPhase()` para:

- Renderização de cenário
- Cores do céu
- Tipo de obstáculos
- Configurações visuais

### ❌ NUNCA usar `currentPhaseIndex` diretamente

Use as funções auxiliares para garantir compatibilidade com variantes.

## Exemplo: Criando Subfase

```javascript
// FASE 0 - Principal (já existe)
{
	basePhase: 0,
	variant: null,
	name: 'Cidade Urbana',
	sky: { color: '#FF9F1C', gradient: null },
	// ... configurações visuais
}

// FASE 0a - Variante "Manhã"
{
	basePhase: 0,           // Mesma fase narrativa
	variant: 'a',           // Variante visual
	name: 'Cidade Urbana - Manhã',
	sky: { color: '#87CEEB', gradient: null },  // Céu azul claro
	environment: {
		type: 'buildings',
		colors: ['#E8D5B5', '#D4C5A0'],  // Cores mais claras
		// ...
	}
	// Obstáculos e itens podem ser diferentes
}

// FASE 0b - Variante "Chuva"
{
	basePhase: 0,           // Mesma fase narrativa
	variant: 'b',           // Outra variante
	name: 'Cidade Urbana - Chuva',
	sky: { color: '#5F6A7A', gradient: null },  // Céu cinza
	environment: {
		type: 'buildings',
		colors: ['#6B7280', '#556270'],  // Cores mais escuras/úmidas
		// ...
	}
}
```

## Comportamento

### Painel de Leitura

- Fase 0 → Desbloqueia texto "Fase 0 – Raízes Digitais"
- Fase 0a → NÃO desbloqueia novo texto (usa mesmo texto da fase 0)
- Fase 0b → NÃO desbloqueia novo texto (usa mesmo texto da fase 0)
- Fase 1 → Desbloqueia texto "Fase 1 – Surto Criativo" (nova narrativa)

### Renderização

- Cada variante usa SEU PRÓPRIO cenário, cores, obstáculos
- Fase 0: Pôr do sol laranja, casas coloridas
- Fase 0a: Manhã clara, casas com tons pastéis
- Fase 0b: Dia chuvoso, cores acinzentadas

### Progressão

A progressão do jogo avança por `basePhase`:
- 0 → 1 → 2 → 3 → 4 → 5 → 6

Mas você pode intercalar variantes:
- 0 → 0a → 0b → 1 → 1a → 2 → ...

## Implementação Técnica

### Arquivos Modificados

1. **punk/phases.js**
   - Adicionado `basePhase` e `variant` a cada fase
   - Criadas funções `getCurrentBasePhase()`, `getCurrentVariant()`, `getCurrentPhaseId()`

2. **punk/ui.js**
   - `unlockReadingContent()` usa `basePhase` ao invés de índice
   - Garante que variantes não desbloqueiam novos textos

3. **punk/renderer.js**
   - Renderização de casas, montanhas, bueiros usa `getCurrentBasePhase()`
   - Elementos narrativos (fase 0) funcionam em todas as variantes

4. **punk/buildings.js**
   - Geração de casas usa `getCurrentBasePhase()`

5. **punk/mountains.js**
   - Montanhas aparecem em todas as variantes da fase 0

## Benefícios

✅ Infinitas variações visuais sem duplicar código
✅ Mesma narrativa com diferentes ambientes
✅ Fácil adicionar "horários do dia", "climas", "estações"
✅ Não quebra sistema de desbloqueio
✅ Mantém compatibilidade com código existente

## Próximos Passos

Para adicionar mais variantes:

1. Adicione nova entrada em `Phases[]` com mesmo `basePhase`
2. Defina `variant` única ("c", "d", "morning", "rain"...)
3. Configure cenário, cores, obstáculos como desejar
4. Pronto! A narrativa será compartilhada automaticamente

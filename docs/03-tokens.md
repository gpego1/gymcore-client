# 03 · Design tokens

Fonte de verdade: `src/app/globals.css`. Exportação: [design-tokens.json](design-tokens.json).

## Cores implementadas

| Token | HEX | Uso |
| --- | --- | --- |
| background | #080E19 | Fundo geral |
| sidebar | #0A101C | Navegação |
| surface | #0E1827 | Cards e tabelas |
| raised | #132035 | Controles e elevação |
| overlay | #172740 | Camada superior |
| border | #24354E | Separadores |
| text | #F0F4FC | Texto principal |
| muted | #A1B0C6 | Texto secundário |
| disabled | #7D8EA8 | Placeholders, informação reduzida |
| primary | #2262DC | Ações com texto branco |
| primaryHover | #2768E6 | Hover de ação |
| accent | #78D7F0 | Realce frio, foco e evolução |
| success | #6ED6AB | Pago, ativo, permitido |
| warning | #F5CB78 | Espera, atraso leve, offline |
| danger | #FF9B9B | Negado e inadimplente |
| info | #8DB8FF | Informação e links |

Fundos de badges: sucesso #17352B, alerta #342C1E, erro #35202B e informação #162947. O gráfico usa #5C97FF sobre azul-noite. Sombras trabalham com preto translúcido, não elevação branca.

## Tipografia

**Geist** é a família de interface e display: formas legíveis, títulos compactos e números financeiros tabulares. **Geist Mono** marca horários, etapas e etiquetas técnicas, associando a precisão dos dados à marca. As duas são distribuídas localmente em WOFF2, com licença OFL, evitando requisições de fonte. Alternativas gratuitas de proposta: Space Grotesk para títulos e IBM Plex Sans para interface; substituir ambas somente com nova revisão tipográfica.

Escala efetiva: 9/10/11/12 para metadados; 14/16 para interface; 20/24/30/34 para títulos; 43/54/70 para superfícies expressivas. Não reduzir conteúdo essencial além dessa escala. Usar a ampliação nativa do navegador.

## Grid, espaço e elevação

Base de 4 px; intervalos predominantes 8/12/16/24/32/48. Sidebar 230 px, reduzida a 210 px abaixo de 1200. Conteúdo até 1520 px, padding 36 px no desktop e 16 px no mobile. Cards com raio 12; controles 8; diálogos 14; prévia do aparelho 24. Sombras: `0 16px 48px #0003` e `0 30px 90px #0009`.

## Compatibilidade

Tailwind v4 importa os tokens via `@theme inline`. As primitivas Button/Modal seguem composição Slot, cva e Radix, compatível com o padrão shadcn/ui; esta versão não declara uma biblioteca inteira shadcn instalada. JSON mantém os valores para adaptação futura a ThemeData.

O script `npm run test:contrast` mede pares sólidos por luminância relativa. [Resultados](contrast.json). Isso não certifica o contraste de todos os gradientes, estados compostos ou transparências da interface.

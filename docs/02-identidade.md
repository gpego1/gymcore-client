# 02 · Identidade de marca

## Nome e personalidade

Gym remete ao espaço de treino; Core é o centro de força, conexão e controle. A marca deve ser forte, precisa, confiável e próxima. Voz: verbos ativos, frases curtas, incentivo sem culpa. “Cada dia, mais forte.” e “Vamos em frente.” são exemplos implementados.

## Três direções

| Direção | Símbolo e racional | Status |
| --- | --- | --- |
| **01 · Núcleo G/C — recomendada** | A anilha aberta forma o C; a barra central fecha o G. Um centro estável, reconhecível em tamanhos pequenos. | Implementada na aplicação e favicon: [SVG](../public/brand/symbol.svg) |
| 02 · Barra contínua | Halter integrado a um G circular. Mais literal, forte em sinalização física, menos simples em ícones pequenos. | Exploração: [SVG](../public/brand/direction-02.svg) |
| 03 · Pulso de energia | Repetição e frequência atravessam um núcleo aberto. Expressa comunidade e evolução, com personalidade mais dinâmica. | Exploração: [SVG](../public/brand/direction-03.svg) |

## Sistema da direção recomendada

Símbolo de 40 × 40 unidades, arco externo de 16 unidades e núcleo negativo; barra de 6 unidades. Wordmark “gymcore.” em Geist, gym com peso 750 e core com peso 450, tracking −1 px na aplicação. A versão SVG textual depende da fonte; converter o wordmark em contornos é etapa de finalização de marca.

- **Horizontal:** símbolo à esquerda, intervalo de 9 px, palavra de 25 px no painel. [Arquivo](../public/brand/wordmark.svg).
- **Vertical — proposta:** símbolo centralizado sobre wordmark, separação igual a um quarto do símbolo.
- **Só símbolo:** navegação do aluno e favicon. Mínimo recomendado: 20 px; aplicação usa 28–34 px.
- **Respiro:** pelo menos 8 unidades em volta do símbolo; uma altura de barra ao redor da assinatura horizontal.
- **Monocromática:** [SVG com currentColor](../public/brand/symbol-monochrome.svg); usar branco em fundo escuro e azul-noite em fundo claro. Validar o contexto antes de aplicar.
- **Ícone do app:** [arte SVG 512 × 512](../public/brand/app-icon.svg). As exportações e máscaras finais iOS/Android são propostas para o app futuro.

## Motion de marca — proposta

Arco e barra se aproximam do núcleo em 600 ms, ease-out, uma vez no onboarding/splash. Fallback estático para redução de movimento. Não há splash que bloqueie a operação nesta versão.

## White-label leve

O cabeçalho implementa Atlas Fitness e Nord Performance, com nome, unidade, monograma e acento discreto. Dados locais são separados por academia. Navegação e cores de status permanecem consistentes. Upload de logo, aplicação em contratos/e-mails e controle de permissões por tenant dependem de integração futura.

## Ícones próprios

SVG em grid de 24 px, traço 1,6 px, pontas e junções arredondadas. Inclui aluno, acesso/catraca, ficha, avaliação, cobrança, lead, comissão, QR e halter, definidos em `src/components/icons.tsx`. Ícones decorativos usam aria-hidden; ações com apenas ícone recebem nomes acessíveis.

# 04 · Movimento e catálogo 3D

## Linguagem: precisão com peso

A operação responde imediatamente. Movimento expressivo pertence à apresentação, não ao check-in repetido ou às tabelas. A finalidade do movimento é indicar resposta, hierarquia e profundidade.

| Token | Duração | Curva | Aplicação efetiva |
| --- | --- | --- | --- |
| press | 120 ms | cubic-bezier(.23,1,.32,1) | Escala .97 ao pressionar com ponteiro |
| dialog | 180 ms | mesma ease-out | Entrada por opacidade; centro estável |
| toast | 160 ms | mesma ease-out | Aparecimento por opacidade |
| carouselTransition | 650 ms | cubic-bezier(.23,1,.32,1) | Troca de fotos por opacidade |

Ações por teclado não recebem transformação ou transição de interface. Navegação e check-in não usam animação de entrada. Hover só altera aparência em ponteiros finos. Redução de movimento remove animações e transformações animadas, mantendo o carrossel estático. A tela inicial oferece pausa explícita, controles anterior/próximo e seleção de imagem. O avanço ocorre a cada 6,5 s, continua durante hover e cliques nas setas e pausa durante foco por teclado ou aba oculta. A navegação manual reinicia o intervalo; o botão Pausar interrompe a rotação até Retomar.

## Catálogo

| Local / status | Objeto | Gatilho | Duração / loop | Tecnologia / easing | Fallback |
| --- | --- | --- | --- | --- | --- |
| Hero / implementado | Fotos locais de academias | Abertura de / ou /site | 6,5 s entre imagens; pausável | Opacidade CSS; ease-out | Primeira imagem estática com redução de movimento |
| Splash / proposta | Núcleo G/C | Primeira abertura do app | 600 ms, uma vez | Rive ou SVG; ease-out | Logo estático, sem bloquear acesso |
| Carregamento / proposta | Anilhas que se encaixam | Carga prolongada em área não operacional | 900 ms, loop limitado a 5 s | Lottie/Rive | Skeleton já presente nas rotas web |
| Check-in / proposta | Catraquinha e anel QR | Validação permitida | 350 ms, uma vez | Rive; ease-out | Ícone e texto imediatos, já implementados |
| Meta concluída / proposta | Anilha encaixa na barra | Meta rara concluída | 700 ms, uma vez | Three.js ou Rive; ease-out | Badge e toast, disponíveis hoje |
| Estado vazio / proposta | Kettlebell apoiado | Ausência de dados | Estático ou 2 s, uma vez | SVG com sombra ou asset 3D | Ícone, texto e ação, já implementados |

O hero usa imagens locais com Next Image. O componente de anilha CSS permanece no código como recurso anterior, sem uso na tela inicial.

## Limites propostos para uma versão WebGL

Meta de 60 fps em equipamento-alvo; até 12 mil triângulos por objeto, textura 1024 px KTX2, DPR limitado a 1,5 e orçamento inicial de 300 KB comprimidos para a cena. Carregar Three.js/React Three Fiber por import dinâmico somente na landing. Pausar quando fora da tela ou aba oculta. Falha de contexto, dispositivo simples e redução de movimento usam SVG estático. **Esses números são metas, não medições da entrega.**

## Transições compartilhadas — proposta

Perfil: avatar e nome preservam identidade visual, com transição de 180 ms quando View Transitions estiver disponível. Matrícula: card de plano mantém resumo até o contrato; a implementação atual troca a etapa sem animar. QR: expansão para modal já funciona, sem morph geométrico. Flutter futuro: Hero no QR e ficha, duração 220 ms, desativado com redução de movimento. Não há shared-element animation implementada nesta versão.

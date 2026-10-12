# 07 · Componentes e estados

## Primitivas implementadas

Arquivo principal: `src/components/ui.tsx`. A composição usa Radix Dialog e Slot, cva, clsx e tailwind-merge. Não há dependência de uma API de backend.

| Componente | Props | Variantes / comportamento |
| --- | --- | --- |
| Button | variant, size, asChild, disabled e atributos nativos | primary/secondary/ghost/danger; normal/small/icon; Slot permite Link sem botão aninhado |
| Badge | tone, children | success/warning/danger/info/neutral; texto e ponto, sem depender só da cor |
| Panel | title, description, action, className, children | Superfície com header opcional; altura guiada pelo conteúdo |
| Avatar | name, size | Iniciais decorativas; normal 35 px, large 80 px |
| Modal | open, onOpenChange, title, description, children | Portal, overlay, focus trap, Escape, botão fechar e retorno de foco |
| Empty | title, description, action | Ícone, explicação e ação opcional |
| PageHeading | eyebrow, title, description, actions | Cabeçalho responsivo com ações |
| Stat | label, value, detail, icon, tone, featured | Números tabulares, sparkline decorativa e variante destacada |
| DemoNote | children | Informação persistente sobre o caráter fictício |

## Matriz de estados

| Família | Padrão / hover / ativo | Foco / desabilitado | Carga / erro / vazio |
| --- | --- | --- | --- |
| Botão | Azul principal; hover mais claro e contrastado; escala .97 por ponteiro | Foco ciano 2 px com offset 4; disabled 60% e cursor explícito | Não há carga de rede em ações mock; disabled em treino incompleto e fechamento registrado |
| Input/select | Fundo azul-noite, borda mineral; select nativo escuro | Outline visível; autocomplete e tipos adequados | Validação nativa; matrícula também apresenta erro inline e foca o campo |
| Checkbox/radio | Label e controle formam área mínima de 44 px | Tab/Space e foco nativo visível | Aceite obrigatório, consentimento opcional e plano selecionado |
| Tabela/filtro | Cabeçalhos, hover de linha, links semânticos | Link do aluno acessível por teclado | Busca sem resultados e filtro sem dívida mostram Empty |
| Card de aula | Cor lateral e ocupação; ação como botão | Foco ciano, estado escolhido no modal | Vagas, espera, confirmação e cancelamento |
| Tabs de navegação | Links, seleção por aria-current e aparência | 44 px de altura, sem animação frequente | Filtro refletido na URL |
| Modal | Camada central; entrada só por opacidade | Focus trap, Escape e retorno ao acionador/main | Mensagem, confirmação ou formulário; overscroll contido |
| Toast | Ícone, texto e dispensar | Região aria-live polite; botão com nome | Permanece até dispensado; não desaparece antes de ser lido |
| Stepper | 5 etapas numeradas; concluída com check | aria-current na etapa atual | Voltar preserva dados; erros mantêm etapa |
| Calendário/grade | Cards semanais, horário, espaço e professor | Seleção por botão/Link | Não há arraste obrigatório |
| Gráficos | SVG com rótulo e valores próximos | Conteúdo descritivo para leitores de tela | Históricos explicitamente ilustrativos |
| Terminal | Estado de espera, permitido, negado ou offline | Ícone, texto, contraste e anúncio de estado | Motivo e próximo passo para erros; som/vibração opcionais |

## Comportamentos específicos

- Carrinho: adicionar, reduzir e finalizar; confirmação evita vendas acidentais. Os valores atualizam o financeiro local.
- Reserva: cancelar exige confirmação; Manter reserva oferece saída sem alteração.
- Consentimento: revogação oculta a evolução física; não inicia coleta de biometria.
- Matrícula: navegação e troca de academia protegem o preenchimento incompleto.
- Fotos: até 2 JPG/PNG/WebP de 5 MB, usadas só em memória; falha de formato informa como corrigir.
- Texto longo: perfis e cards quebram nomes; tabelas possuem rolagem interna.

## Propostas ainda não implementadas

Bottom sheets com física de mola, switches nativos Flutter, arraste de kanban, menus de seleção customizados, shared elements, virtualização de listas extensas e upload persistente. A versão atual prioriza controles nativos e diálogos acessíveis para que todos os fluxos tenham alternativa por teclado.

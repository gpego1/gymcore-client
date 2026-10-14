# 06 · Especificação das telas

## Layout implementado

Grid por CSS, sem medir layout no render. Gestão: sidebar de 230 px, topbar de 82 px, corpo com padding 36 px e largura máxima de 1520 px. Dashboard organiza o conteúdo em três seções: resumo essencial, análise de desempenho e rotina. Receita é o indicador de maior destaque; alunos e inadimplência têm cards próprios. Receita e frequência compartilham um gráfico com abas acessíveis; visitas, conversão e churn ficam em um painel separado. Bordas e elevação substituem sombras pesadas.

| Largura | Comportamento |
| --- | --- |
| Acima de 1500 px | Mais altura nos indicadores e gráficos |
| 961–1200 px | Sidebar 210 px; agenda e kanban em duas colunas; resumo lateral da matrícula oculto |
| 701–960 px | Sidebar substituída por botão e diálogo de navegação |
| Até 700 px | Conteúdo em coluna, padding 16 px; ações e filtros quebram linha; tabelas rolam internamente |
| Até 360 px | Ajustes de QR, séries e tipografia do aluno |

Prévia do aluno: aparelho de 430 px no desktop, com explicação lateral; ocupa a largura disponível até 480 px no mobile. Navegação inferior fixa em telas pequenas, com safe-area e reserva de espaço no conteúdo. Terminal: duas colunas no tablet largo/desktop; uma coluna até 700 px.

## Gestão

| Tela | Hierarquia / comportamento | Código |
| --- | --- | --- |
| Login | Marca expressiva; entrada por e-mail demonstrativo e perfil; não pede senha real | login.tsx |
| Dashboard | 6 indicadores em seções espaçadas; abas Receita/Frequência com teclado; período na URL; cards com atalhos; aulas e alertas; exportação CSV | dashboard.tsx |
| Alunos | Resumo, busca, status na URL, tabela, exportação; links por registro | students.tsx |
| Perfil | Avatar, plano, contatos, ficha fictícia, consentimento e linha do tempo; edição em modal | students.tsx |
| Matrícula | Stepper de 5 etapas; formulário; resumo lateral; confirmação final | enrollment.tsx |
| Inadimplência | Valor, alunos, contatos; faixas; tabela; confirmação da régua e baixa | operations.tsx |
| Aulas | Cards com dia, professor, horário e ocupação; detalhe e reserva mock | operations.tsx |
| Leads | 4 colunas de kanban; adicionar contato; avançar/retornar por botões acessíveis | operations.tsx |
| Comissões | 4 professores e totais ilustrativos; fechamento confirmado localmente | operations.tsx |
| Financeiro | Recebimentos por plano e PDV, despesas fictícias, gráfico e CSV | operations.tsx |
| PDV | Produtos ilustrados por ícones, carrinho com quantidades, forma de pagamento e recibo mock | operations.tsx |

Os nomes acima se referem a `src/components/`. Dados financeiros vêm de `src/lib/domain.ts`: matrícula não recebida não gera receita; baixa e pagamento do aluno registram recebimento. Históricos de gráfico são explicitamente ilustrativos.

## Aluno

Todas as telas ficam em `student-app.tsx`: onboarding de 3 quadros, home, QR com modal ampliado, treino com 12 séries editáveis, aulas/reservas/espera, evolução com gráfico de carga ou peso, comparação de até 2 imagens locais, mensalidades/Pix, mural e perfil. Os mocks correspondem ao primeiro aluno da academia selecionada. Revogar consentimento oculta a evolução. O botão de concluir treino permanece desabilitado até todas as séries serem registradas.

## Terminal

`reception.tsx`: CPF fictício, seleção de cenário QR/facial, consentimento específico da simulação facial, histórico de verificações e controles de offline/som. Permitido, negado e offline possuem textos, ícones e cores distintos. Nenhuma câmera é usada.

## Landing

`landing.tsx` e `plate.tsx`: hero, produto, experiência do aluno e planos comerciais propostos sem preço/contratação. Acesso direto à demo. Movimento decorativo pausável, fallback e versão estática com redução.

## Estados e conteúdo

Rotas possuem skeleton de carga, página não encontrada e erro recuperável. Busca sem resultados, kanban vazio, nenhuma reserva, carrinho vazio e nenhuma dívida apresentam explicação. Nomes longos quebram em perfis/cards; tabelas mantêm rolagem própria. Fixtures são pequenas; virtualização acima de 50 registros é uma necessidade de produção ainda não implementada.

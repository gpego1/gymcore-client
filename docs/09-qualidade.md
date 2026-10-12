# 09 · Revisão de acessibilidade e qualidade visual

## Evidência e alcance

Revisão do código pela skill web-design-guidelines, usando as [diretrizes recuperadas da fonte indicada](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). A revisão foi acompanhada de execução em Chromium local. Não se trata de uma certificação WCAG AA ou de teste de app nativo.

| Verificação | Resultado |
| --- | --- |
| TypeScript | `npm run typecheck`: sem erros |
| Lint | ESLint com `--max-warnings=0`: sem erros ou avisos |
| Domínio | 14 testes aprovados: tenants, reserva/espera/promoção, acesso, offline e consistência financeira |
| Contraste | 53 pares de tokens sólidos ≥ 4,5:1; [valores](contrast.json) |
| Produção | `npm run build`: compilação, tipos e rotas concluídos |
| Navegador | 88 verificações aprovadas; 22 telas em 1440, 768 e 390 px, mais jornadas críticas |
| Runtime/rede | Sem exceções de JavaScript; sem requisições das páginas a /api ou serviços externos |
| Capturas | [Gestão](screenshots/dashboard.png), [aluno](screenshots/aluno.png), [recepção](screenshots/recepcao.png) e [landing](screenshots/landing.png) |

O [relatório de navegador](browser-qa.json) registra resultados e data da execução. As 66 combinações de tela/largura foram verificadas quanto a renderização e ausência de overflow do documento; tabelas têm rolagem interna. Isso não equivale a inspeção manual exaustiva de cada detalhe visual em cada dispositivo.

## Correções da revisão web

- `src/components/ui.tsx:116` — fechamento de diálogo passou a devolver foco ao acionador, ou ao main se ele foi removido.
- `src/lib/store.tsx:124` — snapshot de hidratação por superfície evita divergência entre placeholder servido e mocks restaurados.
- `src/app/globals.css:5000` — contêiner de tabela posicionado impede rótulos sr-only de escaparem e ampliarem a página em tablet.
- `src/app/globals.css:3830` — azul de hover foi escurecido para preservar texto branco a pelo menos 4,5:1 nos tokens sólidos medidos.
- `src/app/globals.css:4998` — texto sobre fundo de acesso permitido foi clareado para corrigir contraste medido.
- `src/app/globals.css:5004` — links de marca e avatar receberam alvo mínimo de 44 px.
- `src/components/enrollment.tsx:121` — saída e troca de academia protegem o preenchimento em andamento.

O código usa links para navegação, botões para ações, labels em campos, nomes em ações de ícone, skip links, aria-live para resultados, foco visível, selects escuros e números via Intl. Imagens locais de comparação têm dimensões e texto alternativo. Modal contém o scroll e trata Escape. Movimento decorativo tem pausa e alternativa estática.

## Refinamento emil-design-eng

| Antes | Depois | Por quê |
| --- | --- | --- |
| Diálogo fechava sem foco útil | Retorno ao acionador/main | Mantém orientação ao usar teclado |
| Estado salvo podia antecipar hidratação de páginas | Placeholder e snapshot estável até cada superfície hidratar | Evita erro React e troca incoerente de dados |
| Azul de hover limítrofe para texto branco | #2768E6 | A ação permanece legível em hover |
| Texto secundário no verde de acesso tinha contraste baixo | #BDCCDE | Feedback crítico deve ser claro |
| Labels absolutos da tabela vazavam em tablet | Contenção no próprio scroll | Preserva a leitura sem arrastar o documento inteiro |
| Marca/avatar tinham área compacta | Alvo interativo ≥ 44 px | Facilita toque sem inflar o símbolo |
| Movimento operacional repetido poderia atrasar a recepção | Validação e navegação imediatas | Frequentemente usado: resposta tem prioridade |
| Entrada expressiva em todos os elementos | Press 120 ms e opacidade 160–180 ms; nenhum motion por teclado | Movimento com função e baixa distração |
| Anilha com loop contínuo | Controle de pausa e prefers-reduced-motion | Mantém o efeito opcional e acessível |

## Limites ainda não verificados ou propostos

- Leitor de tela real, Safari/Firefox, touch em aparelho físico, zoom de 200–400%, contraste sobre todos os gradientes e estados compostos ainda exigem avaliação específica.
- FPS, memória, Web Vitals e orçamento de assets não foram medidos; 60 fps é meta documentada.
- `src/components/students.tsx:11` — listas reais acima de 50 itens precisarão de paginação/virtualização; fixtures atuais são pequenas.
- `src/components/operations.tsx:199` — kanban usa botões acessíveis; drag-and-drop é proposta.
- `src/components/student-app.tsx:429` — fotos são locais e temporárias; armazenamento, retenção e permissões reais não existem.
- Diálogos e rascunhos não possuem deep-link completo; filtros principais têm estado na URL.
- Shared elements, gestos com mola, notificações automáticas e cenas WebGL estão documentados como propostas, não como funcionalidades entregues.

Não há avaliação WCAG de Flutter: nenhum app nativo foi criado. Os cenários de pagamento, assinatura, biometria, QR e mensagens são locais e fictícios. Não houve publicação ou alteração de serviços externos.

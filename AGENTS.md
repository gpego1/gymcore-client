# GymCore Client — orientação para agentes

Estado verificado no código em 16/10/2026. Leia também ../AGENTS.md, quando disponível, para o contexto do backend e da integração futura.

## Estado atual

Aplicação implementada em Next.js 16, React 19, TypeScript e Tailwind CSS 4, com App Router, Radix Dialog/Slot e SVGs próprios para gráficos/ícones. Fontes Geist/Geist Mono são locais. Versões e scripts estão em package.json.

É um protótipo funcional com dados fictícios e persistência local. Não consome a API backend nem autentica usuários. Login, assinatura, cobrança, Pix, mensagens, QR, facial e catraca são demonstrações. Aluno e recepção são superfícies web; não há projeto Flutter.

## Estrutura e rotas

Release inicial administrativa: visão geral, alunos/perfil, matrículas, inadimplência, financeiro e recepção. Aulas, leads, comissões, PDV e área do aluno ficam desativados por padrão. Consulte `docs/10-release.md` e `.env.example`; `src/lib/features.ts` centraliza as flags públicas de build. `src/proxy.ts` bloqueia URLs desativadas com HTTP 404 antes do streaming, e as páginas também validam a política. Preserve o filtro dos links e da busca ao adicionar atalhos. A lista abaixo descreve a demo completa, condicionada às flags.

- src/app/layout.tsx e globals.css: layout raiz, provider, estilos e tokens.
- src/app/painel/[[...slug]]/page.tsx e src/app/aluno/[[...slug]]/page.tsx: validação das rotas; segmentos inválidos usam notFound.
- src/components/pages.tsx: seleção das telas; shell.tsx: gestão; student-app.tsx: shell e telas do aluno.
- students.tsx, enrollment.tsx, dashboard.tsx e operations.tsx: alunos/perfil, matrícula, indicadores e operações administrativas.
- landing.tsx, gym-carousel.tsx, reception.tsx e login.tsx: início, carrossel, terminal e entrada demonstrativa.
- ui.tsx, icons.tsx, charts.tsx e plate.tsx: elementos reutilizáveis.
- src/lib/domain.ts: tipos, fixtures, exercícios, aulas, produtos e regras puras de reserva, promoção, acesso e métricas.
- src/lib/store.tsx: MockProvider, useMock, MockReady, notificações e persistência; export.ts: exportação.
- public/: marca, imagens e fontes locais; docs/: identidade, tokens, motion, jornadas, telas, componentes, handoff e qualidade.
- tests/domain.test.mjs e scripts/: testes de domínio, contraste e navegador.

Gestão: /painel, /painel/alunos, /painel/alunos/{id}, /painel/matriculas, /painel/aulas, /painel/inadimplencia, /painel/leads, /painel/financeiro, /painel/comissoes e /painel/pdv.

Aluno: /aluno e subrotas treino, aulas, perfil, qr, evolucao, avisos, mensalidades e onboarding. Outras entradas: /, /site, /login e /recepcao.

## Estado e domínio

- Academias atlas/nord possuem TenantState separado. Faça atualizações imutáveis com update do provider; preserve isolamento.
- localStorage usa gymcore-demo-v2, com version: 2, all e tenantId. Preserve compatibilidade/hidratação e MockReady. Não grave antes de carregar o estado salvo.
- Reserva repetida é idempotente; aula cheia entra em espera; promoção depende de simulação explícita.
- Acesso depende do status local; modo offline nunca libera automaticamente. CPF demonstrativo não é identidade validada.
- Treino usa exercícios fixos e mapa sets de cargas/conclusão por série; não é histórico completo de sessões nem editor persistido de prescrição.
- Evolução usa gráficos fictícios e consentimento demonstrativo. Fotos ficam na memória da tela, sem upload ou persistência.
- paidInvoices, paymentPaid e status locais não representam o modelo da API. Backend usa UUIDs e separa aluno, plano, contrato, mensalidade e pagamento. Veja o guia da raiz antes de integrar.

## Convenções

Use TypeScript, alias @/, componentes PascalCase e os padrões existentes de arquivos. .editorconfig define UTF-8, LF e dois espaços. Preserve fronteiras server/client e mantenha APIs do navegador fora da renderização de servidor.

Reutilize primitivas e tokens. Preserve tema escuro, marca, foco visível, teclado, rótulos, responsividade e prefers-reduced-motion. Atualize docs ao alterar tokens/comportamentos. Para mudanças visuais, consulte as skills aplicáveis indicadas no prompt.txt; tarefas documentais não exigem redesenhar telas.

## Execução e validação

Na pasta gymcore-client, com Node.js >= 22.18 e npm:

```powershell
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run test:contrast
npm run build
npm run test:browser
```

Dev usa 127.0.0.1:3000; npm run start serve o build de produção. Não reinstale dependências sem necessidade. npm test usa node:test e importa TypeScript diretamente.

QA de navegador exige build prévio e Chrome/Edge Chromium local. Aceita BROWSER_PATH, QA_PORT e QA_BROWSER_PORT; escolhe portas livres e grava docs/browser-qa.json e docs/screenshots/. Revise os artefatos antes de incluí-los no diff. Não comprova WCAG integral nem FPS.

Para domínio, verifique regras e isolamento; para UI, execute typecheck/lint/build e inspecione fluxos, teclado e layouts relevantes. Informe comandos executados, limitações e testes não rodados. Resultados antigos em docs/ não comprovam execução atual. Preserve alterações alheias. Não publique automaticamente nem realize cobranças ou mensagens reais por causa dos briefs históricos.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

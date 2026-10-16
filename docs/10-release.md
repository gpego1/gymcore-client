# Release inicial administrativa

Recorte aprovado: visão geral, alunos e perfil, matrículas, inadimplência, financeiro e recepção. As páginas públicas de início e login continuam disponíveis. Esta seleção não conecta o cliente ao backend: os dados e operações continuam demonstrativos.

## Rotas disponíveis

`/`, `/site`, `/login`, `/painel`, `/painel/alunos`, `/painel/alunos/{id}`, `/painel/matriculas`, `/painel/inadimplencia`, `/painel/financeiro` e `/recepcao`.

## Módulos adiados

| Flag pública | Rotas |
| --- | --- |
| `NEXT_PUBLIC_FEATURE_CLASSES` | `/painel/aulas` |
| `NEXT_PUBLIC_FEATURE_LEADS` | `/painel/leads` |
| `NEXT_PUBLIC_FEATURE_COMMISSIONS` | `/painel/comissoes` |
| `NEXT_PUBLIC_FEATURE_POS` | `/painel/pdv` |
| `NEXT_PUBLIC_FEATURE_STUDENT_AREA` | `/aluno` e todas as suas subrotas |

Todas ficam desativadas quando ausentes ou diferentes de `true`. Copie `.env.example` para `.env.local` e altere apenas os módulos desejados. Reinicie `npm run dev` ou gere outro build após mudar as variáveis: são flags públicas resolvidas no build, nunca segredos ou mecanismos de autorização.

`src/lib/features.ts` centraliza as flags e a política de rotas. `src/proxy.ts` bloqueia módulos desativados antes do streaming, retornando HTTP 404 com a página de rota não encontrada. As páginas catch-all também validam a política; menus, busca global e atalhos usam o mesmo recorte. Landing, login, avisos, dashboard e perfil também ocultam referências aos módulos adiados. O código dos módulos permanece disponível para retomada.

A área do aluno é uma unidade de release nesta etapa: sua flag habilita a experiência completa, incluindo aulas demonstrativas. A flag CLASSES controla a agenda administrativa.

O roteiro histórico `test:browser` exercita a demo completa, inclusive módulos adiados. Para executá-lo integralmente, habilite as cinco flags antes do build; para a release administrativa, valide as rotas acima e os 404 dos módulos adiados.

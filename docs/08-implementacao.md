# 08 · Handoff de implementação

## Web implementado

Next.js App Router + React + TypeScript; Tailwind v4 com tokens CSS; primitivas no padrão de composição shadcn/ui, com Dialog/Slot Radix. Fontes Geist/Geist Mono são locais. SVGs próprios desenham ícones e gráficos. Não foram instaladas bibliotecas WebGL ou de animação para tarefas operacionais.

`src/app/painel/[[...slug]]/page.tsx` e `aluno/[[...slug]]/page.tsx` validam rotas e escolhem superfícies; paths desconhecidos retornam not-found. `pages.tsx` despacha as views. Estado de UI relevante usa query params para busca, status, faixa, dia e reservas. Modais e formulários são transitórios, sem sincronização integral de seus estados na URL.

`MockProvider` hidrata armazenamento depois do primeiro render e usa um snapshot de hidratação estável por superfície (useSyncExternalStore) e salva por academia na chave `gymcore-demo-v2`. Caso localStorage não esteja disponível, o estado continua em memória. Novas matrículas, contatos, reservas, recebimentos, séries e check-ins atualizam as telas sem fetch. Esse isolamento de demo não representa autorização multi-tenant de produção.

### Configuração e dados

Não há variáveis de ambiente de backend, rotas /api, clientes HTTP, tokens de acesso ou cookies de autenticação. O e-mail de login não é persistido. Não usar dados reais no protótipo. CSV contém apenas registros mock e protege células que começam com caracteres interpretáveis como fórmulas.

O build usa worker threads e limita trabalhadores a 2 em `next.config.ts` para a execução disponível no Windows. Remover ou ajustar esse limite em ambientes de build maiores é uma decisão de infraestrutura. Next.js continua responsável por servir páginas e assets locais; isso é diferente de conectar uma API de negócio.

### Entregáveis operacionais

`npm run dev`, `build`, `start`, `typecheck`, `lint`, `test`, `test:contrast` e `test:browser`. Requer Node 22.18+. Testes de domínio usam o runner nativo Node e importam TypeScript sem JSX. Browser QA usa Chromium local e CDP, inicia seu próprio servidor de produção e encerra seus processos. Chrome pode exigir o modo sem sandbox no ambiente restrito de QA; esse modo é usado exclusivamente com a aplicação local de dados fictícios.

## Flutter — especificação, não aplicativo entregue

Não existe projeto Flutter neste diretório. As telas /aluno e /recepcao são protótipos web. A futura implementação nativa deve reutilizar a semântica dos [tokens JSON](design-tokens.json), mantendo widgets, acessibilidade e gestos próprios da plataforma.

| Camada | Especificação proposta |
| --- | --- |
| Tema | ThemeData com brightness dark; ColorScheme com primary #2262DC, surface #0E1827, onSurface #F0F4FC e error #FF9B9B |
| Fontes | Geist local em assets/fonts, declarada no pubspec; Geist Mono para métricas/horários |
| Grid | Base 4 logical pixels; padding 20–24 nas páginas; SafeArea em header e navegação |
| Controles | FilledButton/OutlinedButton, TextFormField e Form; alvos de 48 dp, acima do mínimo de 44 px da prévia |
| Navegação | NavigationBar com Home/Treino/Aulas/Evolução/Perfil; QR e mensalidades por rotas próprias |
| Estados | Skeleton na carga, erro com retry, offline visível; Semantics para resultados e status |
| QR | Credential temporária emitida pelo serviço futuro; nunca codificar CPF ou saúde; Hero apenas no visual do QR |
| Reservas | Lista com Dismissible, confirmação e alternativa de cancelar por botão; espera via eventos do backend futuro |
| Atualizar | RefreshIndicator com ação equivalente Atualizar; sem gesto exclusivo |
| Sheets | showModalBottomSheet, altura adaptada ao teclado e movimento interrompível; respeitar disableAnimations |
| Motion | Rive/Lottie para assets 2D de celebração; duração 220–350 ms; sem splash bloqueante ou loop operacional |
| Tablet | LayoutBuilder, duas colunas em largura suficiente; feedback visual imediato e modo offline sem bypass |

Exemplo de tradução de token (proposta):

```dart
final theme = ThemeData(
  brightness: Brightness.dark,
  scaffoldBackgroundColor: const Color(0xFF080E19),
  fontFamily: 'Geist',
  colorScheme: const ColorScheme.dark(
    primary: Color(0xFF2262DC),
    onPrimary: Color(0xFFFFFFFF),
    surface: Color(0xFF0E1827),
    onSurface: Color(0xFFF0F4FC),
    error: Color(0xFFFF9B9B),
  ),
);
```

### Performance proposta

Almejar 60 fps medidos no dispositivo-alvo. Assets 2D devem substituir renderização 3D em aparelhos simples. Carregar efeitos depois da UI operacional; limitar celebrações e remover movimento com preferência do sistema. Orçamentos de cena/texturas constam no catálogo de motion e não foram medidos para um app nativo inexistente.

## Integrações futuras

Autenticação/perfis, autorização por tenant, cobrança Pix/boleto/cartão, assinatura digital, WhatsApp/push, QR assinado, catraca, câmera/facial, Wellhub/TotalPass, upload/retensão de fotos e disponibilidade de vagas exigem backend e definição específica. A integração deve preservar consentimento separado para saúde e biometria, regra de expiração de credenciais, política offline e auditoria. Nenhum desses serviços foi conectado ou alterado.

## Referências consultadas

[Instalação Next.js](https://nextjs.org/docs/app/getting-started/installation), [Tailwind + Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs), [composição Button shadcn/ui](https://ui.shadcn.com/docs/components/button), [Dialog Radix](https://www.radix-ui.com/primitives/docs/components/dialog), [ThemeData Flutter](https://api.flutter.dev/flutter/material/ThemeData-class.html) e [Hero Flutter](https://docs.flutter.dev/ui/animations/hero-animations).

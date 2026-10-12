# 05 · Jornadas críticas

As quatro jornadas abaixo são navegáveis com mocks. Estados e dados pertencem à academia selecionada, persistidos localmente.

## A · Aluno faz check-in

1. **Home — /aluno:** saudação, treino do dia e card de acesso prioritário.
2. **QR — /aluno/qr:** nome, status de plano, QR ilustrativo e informação de que não é uma credencial real. A navegação é imediata.
3. **Ampliar:** tocar no QR abre modal centralizado; Tab permanece dentro dele e Escape fecha. A área ampliada mantém a mesma representação visual.
4. **Simular leitura:** o botão avalia o status do aluno com a regra pura de acesso. Nenhuma câmera ou scanner é ativado.
5. **Resultado:** ícone de check e texto “Acesso liberado” ou motivo de negação. O registro autorizado aparece no histórico compartilhado do terminal. Esta confirmação é local.

O terminal em /recepcao também explora os cenários negado e offline. Offline nunca libera acesso automaticamente; orienta procurar a recepção.

## B · Reserva, espera e promoção

1. **Aulas — /aluno/aulas:** cards mostram professor, horário, espaço e vagas.
2. **Aula com vaga:** Reservar grava status confirmed e anuncia confirmação.
3. **Cycling lotado:** Entrar na espera grava status waiting, mostra posição 1 e informa a espera por texto e badge.
4. **Simular vaga:** o usuário aciona a liberação fictícia e a reserva passa para confirmada. Em produção, uma vaga liberada no backend é que disparará esse evento.
5. **Minhas reservas:** o filtro na URL mostra só os itens reservados. Cancelamento pede confirmação e permite manter a reserva.

A atualização é imediata, sem atraso artificial. Swipe para cancelar e promoção automática por push são propostas nativas, não funcionalidades conectadas.

## C · Recepção matricula um novo aluno

1. **Cadastro — /painel/matriculas:** nome, e-mail, telefone fictício e consentimento demonstrativo opcional. Nome vazio, duplicidade de e-mail e assinatura incorreta são tratados.
2. **Plano:** Essencial ou Performance, com preço e benefícios. Radio e card formam uma mesma área interativa.
3. **Contrato:** resumo com academia, aluno, plano e valor; aceite obrigatório. Texto demonstrativo, sem validade jurídica.
4. **Assinatura:** repetir nome completo do cadastro. O erro mantém a etapa e foca o campo.
5. **Cobrança:** escolher Pix, boleto ou cartão recorrente fictício; concluir cria a matrícula ativa e a cobrança como demonstração, sem recibo de dinheiro recebido.
6. **Sucesso:** acessar perfil do novo aluno ou começar outra matrícula. A lista e o indicador de ativos refletem a inclusão; a receita não aumenta por uma cobrança ainda não recebida.

Voltar preserva os campos. Sair ou trocar de academia durante o preenchimento pede confirmação de descarte. Não existe assinatura digital nem processamento financeiro.

## D · Gestor identifica atraso e simula a régua

1. **Dashboard — /painel:** indicador de dívida e pontos de atenção encaminham para alunos ou inadimplência.
2. **Faixas — /painel/inadimplencia:** Todos, 1–7, 8–30 e 31+ dias. A URL mantém o filtro.
3. **Preparação da régua:** modal lista a quantidade elegível na faixa e canal demonstrativo. A mensagem usa tom acolhedor.
4. **Confirmar contatos:** apenas alunos visíveis ainda não contatados entram no registro local. Nenhuma mensagem sai do navegador.
5. **Simular baixa:** confirmação marca o aluno como ativo, zera dias de atraso e registra o recebimento pelo preço correto do plano. Dívida, receita e acesso mudam de forma coerente.

O fechamento do modal retorna ao acionador, ou ao conteúdo principal se o acionador deixou de existir.

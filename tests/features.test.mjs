import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const keys = ['CLASSES', 'LEADS', 'COMMISSIONS', 'POS', 'STUDENT_AREA'];
function evaluate(overrides = {}) {
  const env = { ...process.env };
  for (const key of keys) env['NEXT_PUBLIC_FEATURE_' + key] = 'false';
  Object.assign(env, overrides);
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import { isRouteEnabled } from './src/lib/features.ts';
    console.log(JSON.stringify(${JSON.stringify([
      '/painel', '/painel/alunos/atlas-s0', '/painel/matriculas',
      '/painel/inadimplencia', '/painel/financeiro', '/recepcao',
      '/painel/aulas', '/painel/leads', '/painel/comissoes', '/painel/pdv',
      '/aluno', '/aluno/treino', '/aluno/aulas',
    ])}.map(isRouteEnabled)));
  `], { env, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('administrative release keeps core routes and blocks postponed modules', () => {
  assert.deepEqual(evaluate(), [...Array(6).fill(true), ...Array(7).fill(false)]);
});

test('each module can be enabled independently', () => {
  for (const [index, key] of keys.entries()) {
    const expected = [...Array(6).fill(true), ...Array(7).fill(false)];
    expected[6 + index] = true;
    if (key === 'STUDENT_AREA') expected.fill(true, 10);
    assert.deepEqual(evaluate({ ['NEXT_PUBLIC_FEATURE_' + key]: 'true' }), expected);
  }
});

test('values other than literal true do not enable a module', () => {
  assert.equal(evaluate({ NEXT_PUBLIC_FEATURE_LEADS: '1' })[7], false);
});

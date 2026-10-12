import test from 'node:test';
import assert from 'node:assert/strict';
import { access, classes, createTenant, metrics, monthlyFee, promote, reserve } from '../src/lib/domain.ts';
test('Tenant fixtures have distinct identities and independent state', () => {
  const a = createTenant('atlas');
  const b = createTenant('nord');
  assert.notEqual(a.students[1].name, b.students[1].name);
  assert.notEqual(a.students[0].id, b.students[0].id);
  a.bookings.push({
    classId: 'c1',
    status: 'confirmed'
  });
  assert.equal(b.bookings.length, 0);
});
test('Available class confirms reservation', () => assert.equal(reserve([], classes[0])[0].status, 'confirmed'));
test('Full class enters waiting list', () => assert.equal(reserve([], classes[1])[0].status, 'waiting'));
test('A repeated reservation is idempotent', () => {
  const bookings = reserve([], classes[0]);
  assert.equal(reserve(bookings, classes[0]), bookings);
  assert.equal(bookings.length, 1);
});
test('Simulating a vacancy promotes only the matching booking', () => {
  const result = promote([{
    classId: 'c1',
    status: 'confirmed'
  }, {
    classId: 'c2',
    status: 'waiting'
  }], 'c2');
  assert.equal(result[1].status, 'confirmed');
  assert.equal(result[0].classId, 'c1');
});
test('Active student gets permitted access', () => assert.equal(access(createTenant('atlas').students[0], false).allowed, true));
test('Overdue student is denied with a concrete reason', () => {
  const result = access(createTenant('atlas').students[1], false);
  assert.equal(result.allowed, false);
  assert.match(result.reason, /atraso/);
});
test('Inactive enrollment denies access', () => assert.equal(access({
  ...createTenant('atlas').students[0],
  status: 'Inativo'
}, false).allowed, false));
test('Offline mode never automatically permits access', () => {
  const result = access(createTenant('atlas').students[0], true);
  assert.equal(result.allowed, false);
  assert.match(result.reason, /offline/);
});
test('Unknown identifier gets recoverable error', () => assert.match(access(undefined, false).reason, /Confira/));
test('Collections settlement changes debt, receipts and access coherently', () => {
  const state = createTenant('atlas');
  const before = metrics(state);
  const student = state.students[1];
  state.students[1] = {
    ...student,
    status: 'Ativo',
    daysLate: 0
  };
  state.paidInvoices.push(student.id);
  const after = metrics(state);
  assert.equal(after.overdue, before.overdue - 1);
  assert.ok(Math.abs(after.debt - (before.debt - monthlyFee(student))) < .001);
  assert.ok(Math.abs(after.revenue - (before.revenue + monthlyFee(student))) < .001);
  assert.equal(access(state.students[1], false).allowed, true);
});
test('Receipts include actual mock plan prices and POS sales', () => {
  const state = createTenant('atlas');
  const before = metrics(state).revenue;
  state.sales = 42;
  assert.equal(metrics(state).revenue, before + 42);
  state.paidInvoices.push(state.students[0].id);
  assert.ok(Math.abs(metrics(state).revenue - (before + 42 + 249.9)) < .001);
});
test('New unpaid enrollment does not fabricate a receipt', () => {
  const state = createTenant('atlas');
  const before = metrics(state);
  state.students.push({
    ...state.students[0],
    id: 'new-demo',
    since: '2026-10-12'
  });
  assert.equal(metrics(state).active, before.active + 1);
  assert.equal(metrics(state).revenue, before.revenue);
});
test('Empty lead pipeline has finite conversion', () => {
  const state = createTenant('atlas');
  state.leads = [];
  assert.equal(metrics(state).conversion, 0);
});

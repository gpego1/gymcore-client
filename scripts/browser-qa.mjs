import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { access as fileAccess, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function availablePort() {
  const socket = createServer();
  await new Promise((resolve, reject) => {
    socket.once('error', reject);
    socket.listen(0, '127.0.0.1', resolve);
  });
  const chosen = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  return chosen;
}
const port = process.env.QA_PORT ? Number(process.env.QA_PORT) : await availablePort();
const debugPort = process.env.QA_BROWSER_PORT ? Number(process.env.QA_BROWSER_PORT) : await availablePort();
const origin = 'http://127.0.0.1:' + port;
const candidates = [process.env.BROWSER_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/chromium', '/usr/bin/google-chrome'].filter(Boolean);
let executable;
for (const candidate of candidates) {
  try {
    await fileAccess(candidate);
    executable = candidate;
    break;
  } catch {}
}
if (!executable) throw new Error('Chrome/Edge not found. Set BROWSER_PATH to a local Chromium executable.');
await mkdir(path.join(root, '.browser-qa'), {
  recursive: true
});
const profile = await mkdtemp(path.join(root, '.browser-qa', 'run-'));
const next = process.env.QA_ATTACH ? null : spawn(process.execPath, ['node_modules/next/dist/bin/next', process.env.QA_DEV ? 'dev' : 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  cwd: root,
  windowsHide: true,
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1'
  }
});
let serverLog = '';
next?.stdout.on('data', d => serverLog += d);
next?.stderr.on('data', d => serverLog += d);
let browser;
let ws;
const pending = new Map();
let id = 0;
const runtimeErrors = [];
const consoleErrors = [];
const requests = [];
const results = [];
const pause = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const value = await fn();
      if (value) return value;
    } catch {}
    await pause(70);
  }
  throw new Error('QA timeout after ' + timeout + ' ms');
}
function record(name, value = true) {
  assert.ok(value, name);
  results.push({
    name,
    pass: true
  });
  console.log('PASS ' + name);
}
async function call(method, params = {}) {
  const requestId = ++id;
  const message = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(requestId);
      reject(new Error('CDP timeout: ' + method));
    }, 15000);
    pending.set(requestId, data => {
      clearTimeout(timer);
      resolve(data);
    });
    ws.send(JSON.stringify({
      id: requestId,
      method,
      params
    }));
  });
  if (message.error) throw new Error(JSON.stringify(message.error));
  return message.result;
}
async function evaluate(expression) {
  const r = await call('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
}
async function navigate(route) {
  await call('Page.navigate', {
    url: origin + route
  });
  await until(() => evaluate('location.pathname===' + JSON.stringify(route.split('?')[0]) + "&&document.readyState==='complete'&&!!document.querySelector('main h1')"));
  await pause(180);
  await evaluate('document.fonts.ready.then(()=>true)');
}
async function click(text) {
  await evaluate('(()=>{const buttons=Array.from(document.querySelectorAll("button")).filter(b=>b.textContent.trim()===' + JSON.stringify(text) + ');const b=buttons.at(-1);if(!b)throw new Error("Missing button");b.focus();b.click();})()');
  await pause(50);
}
async function fill(selector, text) {
  await evaluate('(()=>{const e=document.querySelector(' + JSON.stringify(selector) + ');if(!e)throw new Error("Missing field");e.focus();e.select();})()');
  await call('Input.insertText', {
    text
  });
}
async function select(selector, value) {
  await evaluate('(()=>{const e=document.querySelector(' + JSON.stringify(selector) + ');e.value=' + JSON.stringify(value) + ';e.dispatchEvent(new Event("change",{bubbles:true}));})()');
  await pause(80);
}
async function stored() {
  return evaluate('JSON.parse(localStorage.getItem("gymcore-demo-v2")).all.atlas');
}
try {
  await until(async () => {
    const r = await fetch(origin + '/login');
    return r.ok;
  });
  browser = spawn(executable, ['--headless=new', '--no-sandbox', '--disable-gpu', '--in-process-gpu', '--disable-software-rasterizer', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-sync', '--remote-debugging-port=' + debugPort, '--remote-debugging-address=127.0.0.1', '--user-data-dir=' + profile, 'about:blank'], {
    cwd: root,
    windowsHide: true,
    stdio: 'ignore'
  });
  const tabs = await until(() => fetch('http://127.0.0.1:' + debugPort + '/json/list').then(r => r.json()));
  ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  ws.addEventListener('message', event => {
    const message = JSON.parse(String(event.data));
    if (message.id) {
      pending.get(message.id)?.(message);
      pending.delete(message.id);
    } else if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails);else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') consoleErrors.push(message.params.args.map(a => a.value ?? a.description).join('\n'));else if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url);
  });
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, {
      once: true
    });
    ws.addEventListener('error', reject, {
      once: true
    });
  });
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Network.enable');
  await navigate('/painel');
  await evaluate('localStorage.removeItem("gymcore-demo-v2")');
  await navigate('/painel');
  const routes = ['/painel', '/painel/alunos', '/painel/alunos/atlas-s0', '/painel/matriculas', '/painel/aulas', '/painel/leads', '/painel/inadimplencia', '/painel/financeiro', '/painel/comissoes', '/painel/pdv', '/aluno', '/aluno/onboarding', '/aluno/qr', '/aluno/treino', '/aluno/aulas', '/aluno/evolucao', '/aluno/mensalidades', '/aluno/avisos', '/aluno/perfil', '/recepcao', '/login', '/site'];
  for (const width of process.env.QA_SKIP_LAYOUT ? [] : [1440, 768, 390]) {
    await call('Emulation.setDeviceMetricsOverride', {
      width,
      height: width === 390 ? 844 : 1000,
      deviceScaleFactor: 1,
      mobile: width === 390
    });
    for (const route of routes) {
      await navigate(route);
      record(width + 'px ' + route + ' renders without document overflow', await evaluate('!!document.querySelector("main h1")&&document.documentElement.scrollWidth<=innerWidth'));
    }
  }
  await call('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });
  await navigate('/painel');
  await evaluate('document.activeElement.blur()');
  await call('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Tab',
    code: 'Tab',
    windowsVirtualKeyCode: 9
  });
  await call('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Tab',
    code: 'Tab',
    windowsVirtualKeyCode: 9
  });
  record('Keyboard reaches skip link', await evaluate('document.activeElement.classList.contains("skip-link")'));
  await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.getAttribute("aria-label")==="Buscar alunos e telas").focus();document.activeElement.click()');
  await pause(100);
  record('Search dialog opens', await evaluate('!!document.querySelector("[role=dialog]")'));
  await call('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27
  });
  await call('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27
  });
  await pause(100);
  record('Escape closes dialog and restores trigger focus', await evaluate('!document.querySelector("[role=dialog]")&&document.activeElement.getAttribute("aria-label")===' + JSON.stringify('Buscar alunos e telas')));
  await select('#tenant', 'nord');
  record('Tenant switch replaces dataset', await evaluate('document.body.innerText.includes("Unidade Pinheiros")'));
  await select('#tenant', 'atlas');
  await navigate('/painel/matriculas');
  await fill('[name=name]', 'Teste Evolução');
  await fill('[name=email]', 'qa@example.com');
  await fill('[name=phone]', '11900009999');
  await click('Continuar para plano');
  await click('Continuar para contrato');
  await evaluate('document.querySelector("input[type=checkbox]").click()');
  await click('Continuar para assinatura');
  await fill('[name=signature]', 'Nome incorreto');
  await click('Continuar para cobrança');
  record('Signature mismatch reports an inline error', await evaluate('!!document.querySelector("[role=alert]")'));
  await fill('[name=signature]', 'Teste Evolução');
  await click('Continuar para cobrança');
  await click('Concluir matrícula demonstrativa');
  record('Enrollment creates an active student', (await stored()).students.some(s => s.email === 'qa@example.com' && s.status === 'Ativo'));
  await navigate('/aluno/aulas');
  await click('Entrar na espera');
  record('Full class enters waiting list', (await stored()).bookings[0].status === 'waiting');
  await click('Simular vaga e promoção');
  record('Mock vacancy confirms reservation', (await stored()).bookings[0].status === 'confirmed');
  await click('Cancelar reserva');
  await click('Manter reserva');
  record('Keeping reservation preserves booking', (await stored()).bookings.length === 1);
  await click('Cancelar reserva');
  await click('Cancelar reserva');
  record('Confirmed cancellation removes booking', (await stored()).bookings.length === 0);
  await navigate('/recepcao');
  await fill('[name=cpf-demo]', '11111111111');
  await click('Simular validação');
  record('Active CPF scenario permits access', await evaluate('document.querySelector(".access-result").classList.contains("allowed")'));
  await click('Próximo check-in');
  await fill('[name=cpf-demo]', '22222222222');
  await click('Simular validação');
  record('Overdue CPF scenario denies access', await evaluate('document.querySelector(".access-result").classList.contains("denied")'));
  await evaluate('Array.from(document.querySelectorAll("label")).find(l=>l.textContent.includes("Simular modo offline")).querySelector("input").click()');
  await click('Simular validação');
  record('Offline never bypasses validation', await evaluate('document.querySelector(".access-result").classList.contains("offline")'));
  await navigate('/painel/inadimplencia?faixa=' + encodeURIComponent('1–7 dias'));
  await click('Simular régua de cobrança');
  await click('Registrar 1 contato(s) simulado(s)');
  record('Collection targets selected overdue bucket', (await stored()).collections.length === 1);
  await click('Simular baixa');
  await click('Confirmar baixa demonstrativa');
  record('Simulated settlement restores active access', (await stored()).students[1].status === 'Ativo');
  await navigate('/painel/pdv');
  await evaluate('document.querySelector(".product-card").click()');
  await pause(60);
  await click('Finalizar venda · mock');
  await click('Confirmar venda · mock');
  record('POS sale updates financial state', (await stored()).sales === 12);
  await navigate('/aluno/mensalidades');
  await click('Ver Pix demonstrativo');
  await click('Simular confirmação de pagamento');
  record('Pix confirmation updates receipt without banking API', (await stored()).paymentPaid === true);
  await navigate('/aluno/treino');
  await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.getAttribute("aria-label")?.startsWith("Concluir série")).click()');
  await pause(60);
  record('Workout stores completed set', Object.values((await stored()).sets).some(s => s.done));
  await navigate('/aluno/perfil');
  await evaluate('document.querySelector(".checkbox-field input").click()');
  await pause(60);
  await navigate('/aluno/evolucao');
  record('Revoked consent hides physical evolution', await evaluate('document.body.innerText.includes("Sua evolução está protegida")'));
  await navigate('/site');
  await until(() => evaluate('!!document.querySelector(".weight-plate")'));
  await call('Emulation.setEmulatedMedia', {
    features: [{
      name: 'prefers-reduced-motion',
      value: 'reduce'
    }]
  });
  await pause(100);
  record('Reduced motion disables decorative plate animation', await evaluate('getComputedStyle(document.querySelector(".weight-plate")).animationName==="none"'));
  await call('Emulation.setEmulatedMedia', {
    features: []
  });
  if (runtimeErrors.length || consoleErrors.length) console.error(JSON.stringify({
    runtimeErrors,
    consoleErrors
  }, null, 2));
  record('No browser runtime exceptions', runtimeErrors.length === 0);
  record('No page requests to backend APIs or external services', !requests.some(url => url.startsWith('http') && (!url.startsWith(origin) || new URL(url).pathname.startsWith('/api/'))));
  await navigate('/painel');
  await evaluate('localStorage.removeItem("gymcore-demo-v2")');
  await mkdir(path.join(root, 'docs/screenshots'), {
    recursive: true
  });
  for (const [route, name, width, height] of [['/painel', 'dashboard', 1440, 1080], ['/site', 'landing', 1440, 1000], ['/aluno', 'aluno', 390, 844], ['/recepcao', 'recepcao', 1280, 1000]]) {
    await call('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width === 390
    });
    await navigate(route);
    if (route === '/site') await until(() => evaluate('!!document.querySelector(".weight-plate")'));
    await pause(100);
    const screenshot = await call('Page.captureScreenshot', {
      format: 'png'
    });
    await writeFile(path.join(root, 'docs/screenshots', name + '.png'), Buffer.from(screenshot.data, 'base64'));
  }
  await writeFile(path.join(root, 'docs/browser-qa.json'), JSON.stringify({
    checkedAt: new Date().toISOString(),
    routes: routes.length,
    viewports: process.env.QA_SKIP_LAYOUT ? [] : [1440, 768, 390],
    serverMode: process.env.QA_ATTACH ? 'attached' : process.env.QA_DEV ? 'development' : 'production',
    results,
    runtimeErrors,
    externalRequests: requests.filter(url => url.startsWith('http') && !url.startsWith(origin))
  }, null, 2) + '\n');
  console.log('Browser QA complete: ' + results.length + ' checks passed.');
} finally {
  try {
    if (ws?.readyState === 1) await call('Browser.close');
  } catch {}
  ws?.close();
  browser?.kill();
  next?.kill();
  if (!results.length) console.log(serverLog);
}

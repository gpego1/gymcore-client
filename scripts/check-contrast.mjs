import { writeFile, mkdir } from 'node:fs/promises';
const colors = {
  background: '#080E19',
  sidebar: '#0A101C',
  surface: '#0E1827',
  raised: '#132035',
  overlay: '#172740',
  text: '#F0F4FC',
  muted: '#A1B0C6',
  disabled: '#7D8EA8',
  primary: '#2262DC',
  primaryHover: '#2768E6',
  accent: '#78D7F0',
  success: '#6ED6AB',
  warning: '#F5CB78',
  danger: '#FF9B9B',
  info: '#8DB8FF'
};
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
const luminance = hex => {
  const [r, g, b] = rgb(hex);
  return .2126 * r + .7152 * g + .0722 * b;
};
const contrast = (fg, bg) => {
  const a = luminance(fg),
    b = luminance(bg);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
};
const pairs = [];
for (const background of ['background', 'sidebar', 'surface', 'raised', 'overlay']) for (const foreground of ['text', 'muted', 'disabled', 'accent', 'success', 'warning', 'danger', 'info']) pairs.push({
  foreground: colors[foreground],
  background: colors[background],
  usage: foreground + ' on ' + background
});
for (const [foreground, background, usage] of [['#FFFFFF', colors.primary, 'Primary button'], ['#FFFFFF', colors.primaryHover, 'Primary hover'], [colors.success, '#17352B', 'Success badge'], [colors.warning, '#342C1E', 'Warning badge'], [colors.danger, '#35202B', 'Danger badge'], [colors.info, '#162947', 'Info badge'], ['#FFFFFF', '#762F3D', 'Danger button'], ['#FFFFFF', '#914051', 'Danger hover'], ['#AFCAEC', '#1C4071', 'Check-in secondary text'], ['#A1B0C6', '#1C3656', 'Reception background'], ['#BDCCDE', '#204F42', 'Allowed background'], ['#A1B0C6', '#4B2634', 'Denied background'], ['#A1B0C6', '#483D27', 'Offline background']]) pairs.push({
  foreground,
  background,
  usage
});
const results = pairs.map(p => ({
  ...p,
  ratio: Number(contrast(p.foreground, p.background).toFixed(2)),
  passesNormalText: contrast(p.foreground, p.background) >= 4.5
}));
await mkdir('docs', {
  recursive: true
});
await writeFile('docs/contrast.json', JSON.stringify({
  method: 'WCAG relative luminance, solid sRGB token pairs; not a full UI audit',
  results
}, null, 2) + '\n');
const failed = results.filter(p => !p.passesNormalText);
for (const item of failed) console.error(item.usage + ': ' + item.ratio + ':1');
console.log(results.length + ' token pairs checked; ' + failed.length + ' failed.');
if (failed.length) process.exitCode = 1;

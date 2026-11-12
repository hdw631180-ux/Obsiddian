// Agent de nuit du Coffre.
// Lit les notes .md du dépôt, demande à une IA un rapport et quelques nouvelles notes,
// puis les écrit dans <NOTES_DIR>/Agent/. Ne modifie et ne supprime JAMAIS une note existante.
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join, basename } from 'node:path';

const E = process.env;
const PROVIDER = (E.AI_PROVIDER || 'gemini').toLowerCase();
const KEY = E.AI_KEY || '';
const NOTES_DIR = (E.NOTES_DIR || '').replace(/^\/+|\/+$/g, '');
const MAX_NEW = Math.max(0, Math.min(+E.MAX_NEW_NOTES || 4, 10));
const ROLE = E.AGENT_ROLE || '';
const MAX_CHARS = 70000;
const OUT = join(NOTES_DIR, 'Agent');

const P = {
  anthropic: { t: 'a', m: 'claude-sonnet-5-5' },
  openai: { t: 'o', u: 'https://api.openai.com/v1', m: 'gpt-4o-mini', mt: 'max_completion_tokens' },
  gemini: { t: 'g', m: 'gemini-2.5-flash' },
  groq: { t: 'o', u: 'https://api.groq.com/openai/v1', m: 'llama-3.3-70b-versatile' },
  openrouter: { t: 'o', u: 'https://openrouter.ai/api/v1', m: 'meta-llama/llama-3.3-70b-instruct:free' },
  mistral: { t: 'o', u: 'https://api.mistral.ai/v1', m: 'mistral-small-latest' },
  custom: { t: 'o', u: '', m: '' },
};
const prov = P[PROVIDER];
if (!prov) fail(`AI_PROVIDER inconnu : « ${PROVIDER} ». Choix : ${Object.keys(P).join(', ')}.`);
if (!KEY) fail('Secret AI_KEY manquant. Ajoute-le dans Settings > Secrets and variables > Actions.');
const MODEL = E.AI_MODEL || prov.m;
if (!MODEL) fail('AI_MODEL est obligatoire avec le fournisseur « custom ».');

function fail(msg) { console.error('Erreur : ' + msg); process.exit(1); }
const exists = p => access(p).then(() => true, () => false);

/* ---------- Lecture des notes ---------- */
async function walk(dir, out = []) {
  let items;
  try { items = await readdir(dir || '.', { withFileTypes: true }); } catch { return out; }
  for (const it of items) {
    if (it.name.startsWith('.') || it.name === 'node_modules' || it.name === 'agent') continue;
    const p = join(dir, it.name);
    if (it.isDirectory()) await walk(p, out);
    else if (/\.md$/i.test(it.name) && !/^readme\.md$/i.test(it.name)) out.push(p);
  }
  return out;
}
const stripFm = t => t.replace(/\r/g, '').replace(/^---\n[\s\S]*?\n---\n?/, '').trim();

const files = await walk(NOTES_DIR);
const notes = [];
for (const f of files) notes.push({ path: f, title: basename(f).replace(/\.md$/i, ''), body: stripFm(await readFile(f, 'utf8')) });
if (!notes.length) { console.log('Aucune note .md trouvée : rien à faire.'); process.exit(0); }

const titles = notes.map(n => n.title);
const ctx = notes.map(n => `## ${n.title} (${n.path.split(/[\\/]/).slice(0, -1).join('/') || 'racine'})\n${n.body.slice(0, 1200)}`).join('\n\n').slice(0, MAX_CHARS);

/* ---------- Appel de l'IA ---------- */
const SYSTEM = `Tu es l'agent de nuit d'un coffre de notes (style Obsidian). Réponds en français.${ROLE ? '\nConsigne de l\'utilisateur : ' + ROLE : ''}
Tu produis UNIQUEMENT des blocs, chacun commençant par une ligne « === Titre | tag1, tag2 » puis son contenu en Markdown.
1) Premier bloc, titre exactement « Rapport » : liens manquants entre notes (« [[a]] → [[b]] : raison courte »), notes floues à reformuler, affirmations à vérifier. Maximum 12 lignes.
2) Ensuite, au maximum ${MAX_NEW} nouveaux blocs : des notes utiles qui manquent au coffre, 3 à 8 lignes chacune.
Règles : relie avec [[Titre exact]] uniquement vers des notes de cette liste : ${titles.join(' ; ')}. N'invente aucun fait, signale ce qui est incertain. Ne répète pas un titre existant. Aucun texte hors des blocs.`;

async function http(url, init) {
  for (let i = 0; i < 3; i++) {
    let r;
    try { r = await fetch(url, { ...init, signal: AbortSignal.timeout(120000) }); }
    catch (e) { if (i == 2) throw e; await new Promise(s => setTimeout(s, 8000 * (i + 1))); continue; }
    if (r.status == 429 || r.status >= 500) { if (i == 2) return r; await new Promise(s => setTimeout(s, 15000 * (i + 1))); continue; }
    return r;
  }
}
async function ask(user) {
  let r, d;
  if (prov.t == 'a') {
    r = await http('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: MODEL, max_tokens: 3000, system: SYSTEM, messages: [{ role: 'user', content: user }] }) });
    d = await r.json().catch(() => null);
    if (!r.ok) fail(`${PROVIDER} : ${(d && d.error && d.error.message) || r.status}`);
    return (d.content || []).map(b => b.text || '').join('');
  }
  if (prov.t == 'g') {
    r = await http(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL.replace(/^models\//, ''))}:generateContent`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY }, body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents: [{ role: 'user', parts: [{ text: user }] }], generationConfig: { maxOutputTokens: 8192 } }) });
    d = await r.json().catch(() => null);
    if (!r.ok) fail(`${PROVIDER} : ${(d && d.error && d.error.message) || r.status}`);
    const c = d && d.candidates && d.candidates[0];
    return ((c && c.content && c.content.parts) || []).map(p => p.text || '').join('');
  }
  const base = (E.AI_BASE_URL || prov.u || '').replace(/\/+$/, '');
  if (!base) fail('AI_BASE_URL est obligatoire avec le fournisseur « custom ».');
  r = await http(base + '/chat/completions', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + KEY }, body: JSON.stringify({ model: MODEL, [prov.mt || 'max_tokens']: 3000, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }] }) });
  d = await r.json().catch(() => null);
  if (!r.ok) fail(`${PROVIDER} : ${(d && d.error && (d.error.message || d.error)) || r.status}`);
  const c = d && d.choices && d.choices[0];
  return (c && c.message && c.message.content) || '';
}

const answer = await ask('Voici les notes du coffre. Fais ton travail de nuit.\n\nNOTES :\n' + ctx);

/* ---------- Écriture (sans jamais écraser) ---------- */
const blocks = answer.split(/^=== /m).slice(1).map(b => {
  const k = b.indexOf('\n'), head = (k < 0 ? b : b.slice(0, k)).split('|');
  return { title: head[0].trim(), tags: (head[1] || '').split(',').map(s => s.trim().replace(/^#/, '')).filter(Boolean), body: (k < 0 ? '' : b.slice(k + 1)).trim() };
}).filter(b => b.title && b.body);
if (!blocks.length) fail('Réponse inattendue de l\'IA (aucun bloc « === Titre »). Rien n\'a été écrit.');

const clean = t => t.replace(/[\\/:*?"<>|#^\[\]]/g, ' ').replace(/\s+/g, ' ').replace(/^[.\s]+/, '').trim().slice(0, 80);
const date = new Date().toISOString().slice(0, 10);
const taken = new Set(titles.map(t => t.toLowerCase()));
await mkdir(OUT, { recursive: true });

async function save(title, type, tags, body) {
  let name = clean(title) || 'Note', n = 1;
  if (type == 'zettel' && taken.has(name.toLowerCase())) { console.log('Ignorée (titre déjà utilisé) : ' + name); return false; }
  let file = join(OUT, name + '.md');
  while (await exists(file)) file = join(OUT, `${name} ${++n}.md`);
  const fm = `---\ntype: ${type}\nstatus: a-relire\ndate: ${date}\ntags: ${[...new Set([...tags, 'agent'])].join(', ')}\n---\n`;
  await writeFile(file, fm + body + '\n', 'utf8');
  taken.add(name.toLowerCase());
  console.log('Écrit : ' + file);
  return true;
}

let wrote = 0, newNotes = 0;
for (const b of blocks) {
  if (/^rapport/i.test(b.title)) { if (await save('Rapport ' + date, 'rapport', ['rapport'], b.body)) wrote++; }
  else if (newNotes < MAX_NEW) { if (await save(b.title, 'zettel', b.tags, b.body)) { wrote++; newNotes++; } }
}
console.log(`Terminé : ${wrote} fichier(s) écrit(s) dans ${OUT}.`);

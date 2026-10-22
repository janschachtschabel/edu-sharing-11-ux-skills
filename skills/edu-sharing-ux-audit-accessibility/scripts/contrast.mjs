#!/usr/bin/env node
// WCAG-2.x-Kontrast zwischen zwei Farben.
// Aufruf: node contrast.mjs <vordergrund> <hintergrund> [...weitere Paare] [Optionen]
//   Farben als #rgb / #rrggbb oder als Token-Name aus variables.scss (z. B. textMediumLight).
// Optionen:
//   --vars <pfad/zu/variables.scss>  Tokens aus :root (und mit --dark zusätzlich body.isDarkTheme) lesen.
//                                    Aufgelöst werden Hex-Werte, var(--x) und color-mix(in srgb, A N%, B).
//   --dark                           Dark-Mode-Werte verwenden.
//   --set name=#hex                  Token setzen/überschreiben, z. B. Branding oder Palettenwerte:
//                                    --set primary=#003b7c --set palette-primary-300=#91a9bb
//                                    (Palettenwerte berechnet angular-material-css-vars erst im Browser;
//                                    ohne --set bleiben Tokens wie --primaryBackground300 im Light-Modus offen.)
// Beispiele:
//   node contrast.mjs textMediumLight backgroundColor --vars projects/edu-sharing-ui/assets/scss/variables.scss
//   node contrast.mjs focusColor roundedContainerBackground --vars …/variables.scss --dark --set primary=#96cdf8
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const colors = [];
const sets = {};
let varsPath = null;
let dark = false;
for (let i = 0; i < args.length; i++) {
    if (args[i] === '--vars') {
        varsPath = args[++i];
    } else if (args[i] === '--dark') {
        dark = true;
    } else if (args[i] === '--set') {
        const [k, v] = args[++i].split('=');
        sets[k.replace(/^--/, '')] = v;
    } else {
        colors.push(args[i]);
    }
}

let raw = {};
if (varsPath) {
    const src = readFileSync(varsPath, 'utf8');
    const block = (sel) => {
        const start = src.indexOf(sel);
        return start < 0 ? '' : src.slice(start, src.indexOf('\n}', start));
    };
    // Werte können mehrzeilig sein (color-mix über mehrere Zeilen) → bis zum Semikolon lesen
    const parse = (text) =>
        Object.fromEntries(
            [...text.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].replace(/\s+/g, ' ').trim()]),
        );
    raw = { ...parse(block(':root {')), ...(dark ? parse(block('body.isDarkTheme {')) : {}) };
}
// Defaults, die erst zur Laufzeit gesetzt werden (ThemeService.applyDefaultColors)
const runtimeDefaults = dark
    ? { 'palette-primary-500': '#96cdf8', 'palette-accent-500': '#96cdf8', 'palette-warn-500': '#ff6b9d' }
    : { 'palette-primary-500': '#48708e', 'palette-accent-500': '#48708e', 'palette-warn-500': '#cd2457' };
const values = { ...runtimeDefaults, ...raw, ...sets };
if (sets.primary) {
    values['palette-primary-500'] = sets.primary;
}

const hexToRgb = (v) => {
    const h = v.slice(1).length === 3 ? [...v.slice(1)].map((c) => c + c).join('') : v.slice(1, 7);
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const named = { white: '#ffffff', black: '#000000' };

function resolve(expr, depth = 0) {
    if (depth > 20) {
        throw new Error(`Zirkulärer Verweis bei ${expr}`);
    }
    expr = expr.trim();
    if (named[expr]) {
        return hexToRgb(named[expr]);
    }
    if (/^#[0-9a-fA-F]{3,6}$/.test(expr)) {
        return hexToRgb(expr);
    }
    let m = expr.match(/^var\(--([\w-]+)\)$/);
    if (m) {
        return resolveToken(m[1], depth + 1);
    }
    m = expr.match(/^color-mix\(\s*in srgb,\s*(.+?)\s*\)$/);
    if (m) {
        // zwei Argumente auf oberster Ebene trennen
        let level = 0;
        let cut = -1;
        for (let i = 0; i < m[1].length; i++) {
            const c = m[1][i];
            if (c === '(') level++;
            if (c === ')') level--;
            if (c === ',' && level === 0) {
                cut = i;
                break;
            }
        }
        const parts = [m[1].slice(0, cut), m[1].slice(cut + 1)].map((p) => {
            const pm = p.trim().match(/^(.*?)\s+(\d+(?:\.\d+)?)%$/);
            return pm ? { c: pm[1], p: Number(pm[2]) } : { c: p.trim(), p: null };
        });
        let [a, b] = parts;
        if (a.p == null && b.p == null) {
            a.p = 50;
            b.p = 50;
        } else if (a.p == null) {
            a.p = 100 - b.p;
        } else if (b.p == null) {
            b.p = 100 - a.p;
        }
        const ca = resolve(a.c, depth + 1);
        const cb = resolve(b.c, depth + 1);
        return ca.map((v, i) => Math.round((v * a.p + cb[i] * b.p) / (a.p + b.p)));
    }
    if (!expr.startsWith('#') && !expr.includes('(')) {
        return resolveToken(expr, depth + 1);
    }
    throw new Error(`Nicht auswertbar: ${expr} (rgba(), Palettenwerte ohne --set u. ä. im Browser messen)`);
}
function resolveToken(name, depth) {
    const key = name.replace(/^--/, '');
    if (!(key in values)) {
        throw new Error(`Unbekannter Token: --${key}${key.startsWith('palette-') ? ' (Palettenwert: mit --set angeben)' : ''}`);
    }
    return resolve(values[key], depth);
}

const lum = (rgb) =>
    rgb
        .map((c) => c / 255)
        .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
        .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
const toHex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');

let failed = false;
for (let i = 0; i + 1 < colors.length; i += 2) {
    try {
        const fg = resolve(colors[i]);
        const bg = resolve(colors[i + 1]);
        const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
        const ratio = (a + 0.05) / (b + 0.05);
        const verdict =
            ratio >= 4.5 ? 'AA Text ok' : ratio >= 3 ? 'nur große Schrift / Icons / Ränder (>= 3:1)' : 'NICHT ok';
        if (ratio < 4.5) {
            failed = true;
        }
        console.log(
            `${ratio.toFixed(2)}:1  ${colors[i]} (${toHex(fg)}) auf ${colors[i + 1]} (${toHex(bg)})${dark ? ' (dark)' : ''}  → ${verdict}`,
        );
    } catch (e) {
        failed = true;
        console.log(`?      ${colors[i]} auf ${colors[i + 1]}  → ${e.message}`);
    }
}
process.exit(failed ? 1 : 0);

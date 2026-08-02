/* ==========================================================================
   Regex Tester + Explainer
   Live matching + token-by-token plain-English explanation
   100% client-side, zero network calls
   ========================================================================== */
(() => {
  'use strict';

  // ====================================================================
  // DOM refs
  // ====================================================================
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const patternInput = $('#patternInput');
  const patternFlags = $('#patternFlags');
  const testInput = $('#testInput');
  const testHighlight = $('#testHighlight');
  const patternStatus = $('#patternStatus');
  const matchCount = $('#matchCount');
  const matchStats = $('#matchStats');
  const explainer = $('#explainer');
  const groups = $('#groups');
  const replaceInput = $('#replaceInput');
  const replaceOutput = $('#replaceOutput');
  const flagToggles = $$('.flag-toggle input');
  const modeTabs = $$('.mode-tab');
  const modePanels = $$('.mode-panel');

  // ====================================================================
  // State
  // ====================================================================
  const state = {
    pattern: '',
    flags: { g: true, i: false, m: false, s: false, u: true, y: false },
    mode: 'match', // match | replace
  };

  // ====================================================================
  // Render
  // ====================================================================
  function render() {
    // Sync flag display
    const flagStr = Object.keys(state.flags).filter((f) => state.flags[f]).join('');
    patternFlags.textContent = flagStr;

    // Build regex
    let regex;
    try {
      regex = new RegExp(state.pattern, flagStr);
    } catch (e) {
      setStatus(patternStatus, 'Invalid: ' + e.message, 'err');
      matchStats.hidden = true;
      testHighlight.innerHTML = '';
      explainer.innerHTML = `<p class="empty-state">Fix the pattern to see what it does.</p>`;
      groups.innerHTML = `<p class="empty-state">No matches.</p>`;
      return;
    }

    setStatus(patternStatus, 'Valid pattern', 'ok');
    const text = testInput.value;

    // Find all matches
    const matches = findMatches(regex, text, state.flags.g);
    matchCount.textContent = matches.length;
    matchStats.hidden = false;

    // Highlight in overlay
    renderHighlight(matches, text);

    // Show capture groups
    renderGroups(matches);

    // Explain pattern
    renderExplainer(state.pattern);

    // If in replace mode, compute result
    if (state.mode === 'replace') {
      renderReplace(regex, text);
    }
  }

  function findMatches(regex, text, global) {
    const matches = [];
    if (!text) return matches;

    if (global) {
      // Use matchAll for proper global iteration
      const re = new RegExp(regex.source, regex.flags);
      let m;
      while ((m = re.exec(text)) !== null) {
        matches.push(m);
        if (m.index === re.lastIndex) re.lastIndex++; // avoid infinite loop on zero-width
      }
    } else {
      const m = regex.exec(text);
      if (m) matches.push(m);
    }
    return matches;
  }

  function renderHighlight(matches, text) {
    if (matches.length === 0) {
      testHighlight.textContent = text;
      return;
    }
    let html = '';
    let cursor = 0;
    for (const m of matches) {
      const start = m.index;
      const end = start + m[0].length;
      // Append text before match
      html += escapeHTML(text.slice(cursor, start));
      // Open match span
      html += `<span class="match">`;
      // Render match content with group overlays
      // For simplicity, just show the full match as one span (group coloring is shown in the groups panel)
      html += escapeHTML(text.slice(start, end));
      html += `</span>`;
      cursor = end;
    }
    html += escapeHTML(text.slice(cursor));
    testHighlight.innerHTML = html;
  }

  function renderGroups(matches) {
    if (matches.length === 0) {
      groups.innerHTML = `<p class="empty-state">No matches yet.</p>`;
      return;
    }
    // Show first match's groups
    const m = matches[0];
    const out = [];
    out.push(`<div class="group-match"><span class="group-label">Full match</span><span class="group-value">${escapeHTML(m[0]) || '<em>(empty)</em>'}</span></div>`);
    for (let i = 1; i < m.length; i++) {
      const val = m[i];
      const namedKey = m.groups ? Object.keys(m.groups).find((k) => m.groups[k] === val) : null;
      const label = namedKey || `Group ${i}`;
      out.push(`<div class="group-match"><span class="group-label">${escapeHTML(label)}</span><span class="group-value ${val === undefined ? 'is-undefined' : ''}">${val === undefined ? 'undefined' : escapeHTML(val)}</span></div>`);
    }
    groups.innerHTML = out.join('');
  }

  function renderReplace(regex, text) {
    if (!text) {
      replaceOutput.value = '';
      return;
    }
    try {
      // Use replace with the global flag
      const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
      const result = text.replace(re, replaceInput.value);
      replaceOutput.value = result;
    } catch (e) {
      replaceOutput.value = '[Error: ' + e.message + ']';
    }
  }

  function setStatus(el, msg, kind) {
    const icon = el.querySelector('.status-icon');
    const text = el.querySelector('.status-text');
    text.textContent = msg;
    el.classList.remove('status-ok', 'status-err');
    if (kind === 'ok') el.classList.add('status-ok');
    else if (kind === 'err') el.classList.add('status-err');
    icon.textContent = kind === 'ok' ? '✓' : kind === 'err' ? '!' : '·';
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  // ====================================================================
  // Explainer
  // Tokenizes a regex pattern into a list of { token, desc } pairs.
  // Each pair is a chunk of the pattern + a plain-English description.
  // ====================================================================
  function renderExplainer(pattern) {
    if (!pattern) {
      explainer.innerHTML = `<p class="empty-state">Enter a pattern to see what each part does.</p>`;
      return;
    }
    const tokens = explainRegex(pattern);
    const out = tokens.map((t) => `
      <div class="explain-row">
        <span class="explain-token">${escapeHTML(t.token)}</span>
        <span class="explain-desc">${t.desc}</span>
      </div>
    `).join('');
    explainer.innerHTML = out;
  }

  function explainRegex(pattern) {
    const tokens = [];
    let i = 0;
    while (i < pattern.length) {
      const c = pattern[i];

      // Escape sequence
      if (c === '\\' && i + 1 < pattern.length) {
        const next = pattern[i + 1];
        const desc = ESCAPE_DESCRIPTIONS[next] || `literal "${next}"`;
        tokens.push({ token: '\\' + next, desc });
        i += 2;
        continue;
      }

      // Character class [...]
      if (c === '[') {
        const end = findClosingBracket(pattern, i);
        const classStr = pattern.slice(i, end + 1);
        const desc = describeCharClass(classStr);
        tokens.push({ token: classStr, desc });
        i = end + 1;
        continue;
      }

      // Group (...)
      if (c === '(') {
        const groupInfo = parseGroup(pattern, i);
        const groupStr = pattern.slice(i, groupInfo.end + 1);
        const quantifier = readQuantifier(pattern, groupInfo.end + 1);
        const desc = describeGroup(groupInfo, pattern);
        tokens.push({ token: groupStr + quantifier, desc });
        i = groupInfo.end + 1 + quantifier.length;
        continue;
      }

      // Anchors
      if (c === '^' || c === '$') {
        tokens.push({ token: c, desc: c === '^' ? 'start of input (or line, with /m flag)' : 'end of input (or line, with /m flag)' });
        i++;
        continue;
      }
      if (c === '\\' && (pattern[i + 1] === 'b' || pattern[i + 1] === 'B')) {
        const isBoundary = pattern[i + 1] === 'b';
        tokens.push({ token: '\\' + pattern[i + 1], desc: isBoundary ? 'word boundary' : 'non-word-boundary' });
        i += 2;
        continue;
      }

      // Alternation
      if (c === '|') {
        tokens.push({ token: '|', desc: 'OR — match the pattern on the left OR the right' });
        i++;
        continue;
      }

      // Quantifier (read on next char, or the existing one)
      const q = readQuantifier(pattern, i);
      if (q) {
        const target = tokens.length > 0 ? tokens[tokens.length - 1].token : '';
        // Attach to previous token
        if (tokens.length > 0) {
          tokens[tokens.length - 1].token += q;
          tokens[tokens.length - 1].desc += ' ' + describeQuantifier(q);
        } else {
          tokens.push({ token: q, desc: 'quantifier with nothing to apply to' });
        }
        i += q.length;
        continue;
      }

      // Any other metacharacter
      if (META_DESCRIPTIONS[c]) {
        tokens.push({ token: c, desc: META_DESCRIPTIONS[c] });
        i++;
        continue;
      }

      // Plain literal
      tokens.push({ token: c, desc: `literal "${c}"` });
      i++;
    }
    return tokens;
  }

  function findClosingBracket(pattern, start) {
    // Find matching ] for [, accounting for [\...] and escapes
    let i = start + 1;
    let negate = false;
    if (pattern[i] === '^') { negate = true; i++; }
    while (i < pattern.length) {
      if (pattern[i] === '\\') { i += 2; continue; }
      if (pattern[i] === ']') return i;
      i++;
    }
    return pattern.length - 1;
  }

  function parseGroup(pattern, start) {
    // Returns { name, flags, end }
    let i = start + 1;
    let name = null;
    let flags = null;
    if (pattern[i] === '?') {
      i++;
      if (pattern[i] === ':') {
        i++;
      } else if (pattern[i] === '=' || pattern[i] === '!') {
        i++; // lookahead
      } else if (pattern[i] === '<') {
        if (pattern[i + 1] === '=' || pattern[i + 1] === '!') {
          i += 2; // lookbehind
        } else {
          // named group
          i++; // skip <
          const nameEnd = pattern.indexOf('>', i);
          name = pattern.slice(i, nameEnd);
          i = nameEnd + 1;
        }
      } else {
        // group flags like (?i)
        const flagEnd = pattern.indexOf(')', i);
        flags = pattern.slice(i, flagEnd);
        i = flagEnd + 1;
      }
    }
    // Find matching )
    let depth = 1;
    while (i < pattern.length && depth > 0) {
      if (pattern[i] === '\\') { i += 2; continue; }
      if (pattern[i] === '(') depth++;
      if (pattern[i] === ')') depth--;
      if (depth === 0) break;
      i++;
    }
    return { name, flags, end: i };
  }

  function readQuantifier(pattern, i) {
    const c = pattern[i];
    if (c === '*' || c === '+' || c === '?') {
      // Check for lazy or possessive
      let q = c;
      if (pattern[i + 1] === '?' || pattern[i + 1] === '+') q += pattern[i + 1];
      return q;
    }
    if (c === '{') {
      const end = pattern.indexOf('}', i);
      if (end !== -1) {
        let q = pattern.slice(i, end + 1);
        if (pattern[end + 1] === '?' || pattern[end + 1] === '+') q += pattern[end + 1];
        return q;
      }
    }
    return '';
  }

  function describeQuantifier(q) {
    const greedy = !q.endsWith('?') || q === '?';
    const base = q[0];
    const map = {
      '*': '0 or more times',
      '+': '1 or more times',
      '?': 'optionally (0 or 1 time)',
    };
    if (map[base]) {
      const suffix = q.endsWith('?') && q !== '?' ? ' (lazy, shortest match)' : '';
      return map[base] + suffix;
    }
    if (base === '{') {
      // {n}, {n,}, {n,m}
      const inner = q.replace(/[{}?+]/g, '');
      const suffix = q.endsWith('?') ? ' (lazy)' : '';
      if (inner.includes(',')) {
        const [lo, hi] = inner.split(',');
        if (!hi) return `${lo} or more times${suffix}`;
        return `between ${lo} and ${hi} times${suffix}`;
      }
      return `exactly ${inner} times${suffix}`;
    }
    return `quantifier ${q}`;
  }

  function describeCharClass(str) {
    const negate = str.startsWith('[^') || str.startsWith('[\\^');
    const inner = str.slice(1, -1).replace(/^\^/, '');
    const special = [];
    if (/\\d/.test(inner)) special.push('digit');
    if (/\\D/.test(inner)) special.push('non-digit');
    if (/\\w/.test(inner)) special.push('word char');
    if (/\\W/.test(inner)) special.push('non-word');
    if (/\\s/.test(inner)) special.push('whitespace');
    if (/\\S/.test(inner)) special.push('non-whitespace');
    if (special.length > 0) {
      return (negate ? 'NOT one of: ' : 'one of: ') + special.join(', ');
    }
    if (negate) return `any character NOT in "${inner}"`;
    return `any character in "${inner}"`;
  }

  function describeGroup(info, pattern) {
    if (info.name) return `named capture group "${info.name}"`;
    if (info.flags) return `group with flags "${info.flags}"`;
    // Detect group type by looking at the opener (right after the opening paren).
    // info.end is the position of the closing ')', so opener is at info.start + 1 or + 2.
    const opener1 = pattern[info.start + 1];
    const opener2 = pattern[info.start + 2];
    if (opener1 === '?') {
      if (opener2 === '<') {
        // Either lookbehind or named group (named is caught above via info.name)
        if (pattern[info.start + 3] === '=') return 'positive lookbehind (checks behind, does not consume)';
        if (pattern[info.start + 3] === '!') return 'negative lookbehind (checks behind, fails if matches)';
      } else if (opener2 === '=') return 'positive lookahead (checks ahead, does not consume)';
      else if (opener2 === '!') return 'negative lookahead (checks ahead, fails if matches)';
      else if (opener2 === ':') return 'non-capturing group';
      else return `group with flags "${opener2}"`;
    }
    return 'capture group';
  }

  const ESCAPE_DESCRIPTIONS = {
    'd': 'any digit (0-9)',
    'D': 'any non-digit',
    'w': 'any word character (a-z, A-Z, 0-9, _)',
    'W': 'any non-word character',
    's': 'any whitespace (space, tab, newline)',
    'S': 'any non-whitespace',
    'b': 'word boundary',
    'B': 'non-word-boundary',
    'n': 'newline',
    't': 'tab',
    'r': 'carriage return',
    '0': 'null character',
    'v': 'vertical tab',
    'f': 'form feed',
  };

  const META_DESCRIPTIONS = {
    '.': 'any character (except newline unless /s flag)',
  };

  // ====================================================================
  // UI wiring
  // ====================================================================
  patternInput.addEventListener('input', () => {
    state.pattern = patternInput.value;
    render();
  });
  testInput.addEventListener('input', render);
  replaceInput.addEventListener('input', render);

  flagToggles.forEach((cb) => {
    cb.addEventListener('change', () => {
      state.flags[cb.dataset.flag] = cb.checked;
      render();
    });
  });

  modeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      modeTabs.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      state.mode = tab.dataset.mode;
      modePanels.forEach((p) => p.hidden = p.dataset.panel !== state.mode);
      render();
    });
  });

  $('#sampleBtn').addEventListener('click', () => {
    patternInput.value = SAMPLE.pattern;
    testInput.value = SAMPLE.text;
    // Sync flag checkboxes
    flagToggles.forEach((cb) => { cb.checked = !!SAMPLE.flags[cb.dataset.flag]; state.flags[cb.dataset.flag] = cb.checked; });
    state.pattern = SAMPLE.pattern;
    render();
  });

  $('#clearBtn').addEventListener('click', () => {
    patternInput.value = '';
    testInput.value = '';
    state.pattern = '';
    render();
    patternInput.focus();
  });

  // Cheatsheet: click to insert at cursor
  $$('.cheat').forEach((btn) => {
    btn.addEventListener('click', () => {
      const insert = btn.dataset.insert;
      const start = patternInput.selectionStart || 0;
      const end = patternInput.selectionEnd || 0;
      const before = patternInput.value.slice(0, start);
      const after = patternInput.value.slice(end);
      patternInput.value = before + insert + after;
      const cursor = start + insert.length;
      patternInput.setSelectionRange(cursor, cursor);
      patternInput.focus();
      state.pattern = patternInput.value;
      render();
    });
  });

  // ====================================================================
  // Sample
  // ====================================================================
  const SAMPLE = {
    pattern: '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})',
    text: 'Today is 2026-08-02. My birthday was 1998-12-15. Project deadline: 2026-12-31.',
    flags: { g: true, i: false, m: false, s: false, u: true, y: false },
  };

  // ====================================================================
  // Init
  // ====================================================================
  function init() {
    state.pattern = SAMPLE.pattern;
    patternInput.value = SAMPLE.pattern;
    testInput.value = SAMPLE.text;
    render();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

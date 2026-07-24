/* ==========================================================================
   LinkedIn Post Previewer
   Real-time preview engine, Unicode formatter, templates
   ========================================================================== */
(() => {
  'use strict';

  // ------------------------------------------------------------------
  // Config
  // ------------------------------------------------------------------
  const FOLD_LIMITS = { mobile: 140, desktop: 210 };
  const MAX_CHARS = 3000;
  const SWEET_LOW = 1200;
  const SWEET_HIGH = 1800;

  // ------------------------------------------------------------------
  // DOM refs
  // ------------------------------------------------------------------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const postInput = $('#postInput');
  const liTextVisible = $('#liTextVisible');
  const liSeeMore = $('#liSeeMore');
  const liCard = $('#liCard');
  const deviceLabel = $('#deviceLabel');
  const charCountEl = $('#charCount');
  const charCountNum = charCountEl.querySelector('.count-num');
  const foldWarnings = $('#foldWarnings');
  const visibleCharsEl = $('#visibleChars');
  const truncatedCharsEl = $('#truncatedChars');
  const copyBtn = $('#copyBtn');
  const clearBtn = $('#clearBtn');
  const templateSelect = $('#templateSelect');
  const deviceBtns = $$('.device-btn');

  // ------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------
  const state = {
    device: 'mobile',
    fold: FOLD_LIMITS.mobile,
  };

  // ------------------------------------------------------------------
  // Unicode Mathematical Alphanumeric Symbol maps
  // Maps standard A-Z/a-z/0-9 to styled Unicode equivalents.
  // Reference: https://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols
  // ------------------------------------------------------------------
  const UNICODE_MAPS = {
    bold: {
      upper: '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',
      lower: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇',
      digit: '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵',
    },
    italic: {
      upper: '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',
      lower: '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻',
      digit: null,
    },
    boldItalic: {
      upper: '𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕',
      lower: '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯',
      digit: null,
    },
    mono: {
      upper: '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
      lower: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣',
      digit: '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿',
    },
  };

  /**
   * Convert ASCII text to a Unicode styled variant.
   * @param {string} text - Source text (any case, any chars)
   * @param {'bold'|'italic'|'boldItalic'|'mono'} style
   * @returns {string}
   */
  function toUnicode(text, style) {
    const map = UNICODE_MAPS[style];
    if (!map) return text;
    let out = '';
    for (const ch of text) {
      const code = ch.codePointAt(0);
      // Uppercase A-Z
      if (code >= 0x41 && code <= 0x5a && map.upper) {
        out += map.upper[code - 0x41];
      }
      // Lowercase a-z
      else if (code >= 0x61 && code <= 0x7a && map.lower) {
        out += map.lower[code - 0x61];
      }
      // Digits 0-9
      else if (code >= 0x30 && code <= 0x39 && map.digit) {
        out += map.digit[code - 0x30];
      } else {
        out += ch; // Pass through punctuation, spaces, emoji, CJK, etc.
      }
    }
    return out;
  }

  // ------------------------------------------------------------------
  // Truncation logic
  // LinkedIn truncates at the fold with "…see more". The character count
  // is approximate (LinkedIn measures by rendered line, not chars), but
  // 140 / 210 are the well-documented community thresholds for mobile /
  // desktop respectively.
  // ------------------------------------------------------------------
  function applyTruncation(text) {
    const fold = state.fold;
    if (text.length <= fold) {
      return { visible: text, hidden: '', truncated: false };
    }
    // Find a clean break: prefer last space within the visible window
    let cutAt = fold;
    const window = text.slice(0, fold);
    const lastSpace = window.lastIndexOf(' ');
    const lastNewline = window.lastIndexOf('\n');
    const bestBreak = Math.max(lastSpace, lastNewline);
    // Only use the break if it's reasonably close to the fold (not at the very start)
    if (bestBreak > fold * 0.6) {
      cutAt = bestBreak;
    }
    return {
      visible: text.slice(0, cutAt).trimEnd(),
      hidden: text.slice(cutAt).trimStart(),
      truncated: true,
    };
  }

  // ------------------------------------------------------------------
  // Render: write the visible text into the LinkedIn card
  // ------------------------------------------------------------------
  function render() {
    const raw = postInput.value;
    const total = raw.length;

    // 1. Char counter + sweet-spot feedback
    charCountNum.textContent = total.toLocaleString();
    charCountEl.classList.toggle('is-warn', total > MAX_CHARS * 0.9);
    charCountEl.classList.toggle('is-good', total >= SWEET_LOW && total <= SWEET_HIGH);

    // 2. Apply truncation
    const { visible, hidden, truncated } = applyTruncation(raw);

    // 3. Render visible text (textContent preserves line breaks via white-space: pre-wrap)
    liTextVisible.textContent = visible;

    // 4. Toggle the "…see more" button
    if (truncated) {
      liSeeMore.hidden = false;
      liSeeMore.textContent = '…see more';
    } else {
      liSeeMore.hidden = true;
    }

    // 5. Stats
    visibleCharsEl.textContent = visible.length.toLocaleString();
    truncatedCharsEl.textContent = hidden.length.toLocaleString();

    // 6. Fold warnings
    if (total > MAX_CHARS) {
      foldWarnings.textContent = `⚠ Over the ${MAX_CHARS.toLocaleString()}-character limit — LinkedIn will reject this.`;
      foldWarnings.style.color = 'var(--warn)';
    } else if (total >= SWEET_HIGH) {
      foldWarnings.textContent = '💡 Long-form territory. Make sure the hook earns the read.';
      foldWarnings.style.color = 'var(--text-2)';
    } else if (total > 0 && total < SWEET_LOW) {
      foldWarnings.textContent = 'Tip: posts 1,200–1,800 chars tend to perform best.';
      foldWarnings.style.color = 'var(--text-3)';
    } else {
      foldWarnings.textContent = '';
    }
  }

  // ------------------------------------------------------------------
  // Device toggle
  // ------------------------------------------------------------------
  function setDevice(device) {
    state.device = device;
    state.fold = FOLD_LIMITS[device];
    liCard.dataset.device = device;
    deviceLabel.textContent = `— ${device.charAt(0).toUpperCase() + device.slice(1)}`;
    deviceBtns.forEach((btn) => {
      const active = btn.dataset.device === device;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    render();
  }

  deviceBtns.forEach((btn) => {
    btn.addEventListener('click', () => setDevice(btn.dataset.device));
  });

  // ------------------------------------------------------------------
  // Format toolbar (Unicode conversion on selection)
  // ------------------------------------------------------------------
  function applyFormat(style) {
    const start = postInput.selectionStart;
    const end = postInput.selectionEnd;
    if (start === end) {
      flashHint(copyBtn, 'Select text first');
      return;
    }
    const before = postInput.value.slice(0, start);
    const selected = postInput.value.slice(start, end);
    const after = postInput.value.slice(end);

    const converted = toUnicode(selected, style);
    postInput.value = before + converted + after;

    // Re-select the converted text so the user can keep editing
    const newEnd = start + converted.length;
    postInput.setSelectionRange(start, newEnd);
    postInput.focus();
    render();
  }

  function insertAtCursor(text) {
    const start = postInput.selectionStart;
    const end = postInput.selectionEnd;
    const before = postInput.value.slice(0, start);
    const after = postInput.value.slice(end);
    // Ensure leading newline for list items
    const needsLeadingNl = before.length > 0 && !before.endsWith('\n');
    const insert = (needsLeadingNl ? '\n' : '') + text;
    postInput.value = before + insert + after;
    const cursor = start + insert.length;
    postInput.setSelectionRange(cursor, cursor);
    postInput.focus();
    render();
  }

  $$('.format-btn').forEach((btn) => {
    const format = btn.dataset.format;
    if (format === 'bold' || format === 'italic' || format === 'mono') {
      btn.addEventListener('click', () => applyFormat(format));
    } else if (format === 'bullet') {
      btn.addEventListener('click', () => insertAtCursor('• Point one\n• Point two\n• Point three\n'));
    } else if (format === 'num') {
      btn.addEventListener('click', () => insertAtCursor('1. First step\n2. Second step\n3. Third step\n'));
    }
  });

  // ------------------------------------------------------------------
  // Copy / Clear
  // ------------------------------------------------------------------
  copyBtn.addEventListener('click', async () => {
    const text = postInput.value;
    if (!text) {
      flashHint(copyBtn, 'Nothing to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      flashHint(copyBtn, '✓ Copied!', 'is-success');
    } catch (e) {
      // Fallback for older browsers / non-secure contexts
      postInput.select();
      document.execCommand('copy');
      flashHint(copyBtn, '✓ Copied!', 'is-success');
    }
  });

  clearBtn.addEventListener('click', () => {
    if (postInput.value && !confirm('Clear your draft?')) return;
    postInput.value = '';
    render();
    postInput.focus();
  });

  function flashHint(btn, message, extraClass = '') {
    const original = btn.textContent;
    btn.textContent = message;
    btn.classList.add(...extraClass.split(' ').filter(Boolean));
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('is-success');
    }, 1400);
  }

  // ------------------------------------------------------------------
  // Templates
  // ------------------------------------------------------------------
  const TEMPLATES = {
    story: `I almost quit my job last Tuesday.

Not because of the work. The work was fine. It was the meeting about the meeting that broke me.

Three hours of calendar time. Zero decisions made. Forty people in a Zoom waiting for someone — anyone — to say "we'll follow up next week."

Sound familiar?

Here's what I did differently the next day:

→ Declined every "sync" that didn't have a written agenda
→ Set my Slack status to "Deep work until 2pm"
→ Blocked two hours of maker time, defended it like a hawk

Within a week, my output doubled. Not because I worked more hours — I worked fewer.

The lesson? Your calendar is a vote for who you become. Every "yes" to a meeting is a "no" to the work that actually matters.

Audit your last 5 days. How many hours went to actual work vs. coordination theater?

What's one meeting you can kill this week?`,

    listicle: `10 things I wish I knew at 25 (that nobody tells you):

1. Your first job doesn't define your career
2. Saving 20% beats earning 20% more
3. Friendships require maintenance, not just history
4. Reading 30 min/day compounds harder than any course
5. Saying "I don't know" is a superpower
6. Sleep is the highest-leverage performance drug
7. Pick the boring, proven path over the sexy one
8. Your network is built by giving, not asking
9. Discomfort is a signal you're growing
10. Nobody has it figured out — including the loud people

Which one hit hardest?`,

    contrarian: `Unpopular opinion: most productivity advice is a coping mechanism for people who don't know what they actually want.

"Time-block your day!" Cool. But block it for what?
"Use the 2-minute rule!" Great. Now you have 200 two-minute tasks.
"Just wake up at 5am!" For what? To be tired and pretentious?

The hard truth: most of us are optimizing the wrong thing.

We obsess over systems and ignore the question that actually matters: what am I building, and why?

Before you add another Notion template to your life, try this:

→ Write down the one project that, if you finished it, would make everything else easier
→ Block 90 minutes tomorrow for it. Only that.
→ Defend it like your career depends on it. Because it does.

The real unlock isn't productivity. It's clarity. Then the productivity is easy.

What's the project you've been avoiding?`,

    lesson: `3 lessons from shipping my last project:

1. Ship the ugly version.
I waited 6 months to "get it right." Competitor shipped in 3 weeks. We never caught up.

2. Charge from day one.
Free users taught me almost nothing. The first paying customer taught me everything about positioning, pricing, and value.

3. Talk to users like a friend, not a founder.
The moment I dropped the "let me show you our roadmap" energy and just asked "what's broken in your week right now?" — the answers got 10x more honest.

None of this is original. All of it is easy to forget.

What lesson do you keep relearning?`,
  };

  templateSelect.addEventListener('change', (e) => {
    const key = e.target.value;
    if (!key || !TEMPLATES[key]) return;
    postInput.value = TEMPLATES[key];
    render();
    postInput.focus();
    postInput.setSelectionRange(0, 0);
    // Scroll the editor into view on mobile
    postInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // ------------------------------------------------------------------
  // Input event (with rAF throttle for very long pastes)
  // ------------------------------------------------------------------
  let renderPending = false;
  postInput.addEventListener('input', () => {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
      render();
      renderPending = false;
    });
  });

  // ------------------------------------------------------------------
  // See-more click: just visual in preview, but expand the card so users
  // can see the full post without the truncation illusion
  // ------------------------------------------------------------------
  liSeeMore.addEventListener('click', () => {
    // Toggle: show the hidden text inline for inspection
    const raw = postInput.value;
    const { visible, truncated } = applyTruncation(raw);
    if (!truncated) {
      // Already showing everything
      liTextVisible.textContent = raw;
      liSeeMore.hidden = true;
      truncatedCharsEl.textContent = '0';
      return;
    }
    // Otherwise: show the full text temporarily
    liTextVisible.textContent = raw;
    liSeeMore.textContent = 'show less';
    liSeeMore.hidden = false;
    liSeeMore.onclick = () => {
      render();
      liSeeMore.onclick = null;
    };
  });

  // ------------------------------------------------------------------
  // Init: load a default story template so the preview is never empty
  // (kills bounce rate, sends strong relevance signal to search engines)
  // ------------------------------------------------------------------
  function init() {
    postInput.value = TEMPLATES.story;
    setDevice('mobile');
    render();
  }

  // Defer to next frame so fonts/layout are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

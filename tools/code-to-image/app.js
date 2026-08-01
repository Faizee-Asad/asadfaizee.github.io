/* ==========================================================================
   Code to Image Generator
   Syntax highlighter, themes, canvas renderer, markdown, export, embed
   ========================================================================== */
(() => {
  'use strict';

  // ====================================================================
  // THEMES
  // ====================================================================
  const THEMES = {
    midnight: {
      name: 'Midnight',
      bg: '#0a0a0a',
      chrome: '#1a1a1a',
      chromeText: '#999',
      lineNumber: '#444',
      text: '#e6e6e6',
      tokens: {
        comment: '#6b7280',
        keyword: '#c084fc',
        string: '#86efac',
        number: '#fbbf24',
        boolean: '#fbbf24',
        null: '#fbbf24',
        function: '#60a5fa',
        type: '#22d3ee',
        operator: '#f472b6',
        punctuation: '#9ca3af',
        tag: '#f87171',
        attribute: '#fbbf24',
        builtin: '#a78bfa',
        variable: '#e6e6e6',
      },
    },
    'github-dark': {
      name: 'GitHub Dark',
      bg: '#0d1117',
      chrome: '#161b22',
      chromeText: '#8b949e',
      lineNumber: '#484f58',
      text: '#e6edf3',
      tokens: {
        comment: '#8b949e',
        keyword: '#ff7b72',
        string: '#a5d6ff',
        number: '#79c0ff',
        boolean: '#79c0ff',
        null: '#79c0ff',
        function: '#d2a8ff',
        type: '#ffa657',
        operator: '#ff7b72',
        punctuation: '#c9d1d9',
        tag: '#7ee787',
        attribute: '#79c0ff',
        builtin: '#ffa657',
        variable: '#e6edf3',
      },
    },
    'github-light': {
      name: 'GitHub Light',
      bg: '#ffffff',
      chrome: '#f6f8fa',
      chromeText: '#656d76',
      lineNumber: '#8c959f',
      text: '#1f2328',
      tokens: {
        comment: '#6e7781',
        keyword: '#cf222e',
        string: '#0a3069',
        number: '#0550ae',
        boolean: '#0550ae',
        null: '#0550ae',
        function: '#8250df',
        type: '#953800',
        operator: '#cf222e',
        punctuation: '#1f2328',
        tag: '#116329',
        attribute: '#0550ae',
        builtin: '#953800',
        variable: '#1f2328',
      },
    },
    dracula: {
      name: 'Dracula',
      bg: '#282a36',
      chrome: '#21222c',
      chromeText: '#6272a4',
      lineNumber: '#44475a',
      text: '#f8f8f2',
      tokens: {
        comment: '#6272a4',
        keyword: '#ff79c6',
        string: '#f1fa8c',
        number: '#bd93f9',
        boolean: '#bd93f9',
        null: '#bd93f9',
        function: '#50fa7b',
        type: '#8be9fd',
        operator: '#ff79c6',
        punctuation: '#f8f8f2',
        tag: '#ff79c6',
        attribute: '#50fa7b',
        builtin: '#8be9fd',
        variable: '#f8f8f2',
      },
    },
    monokai: {
      name: 'Monokai',
      bg: '#272822',
      chrome: '#1e1f1c',
      chromeText: '#75715e',
      lineNumber: '#75715e',
      text: '#f8f8f2',
      tokens: {
        comment: '#75715e',
        keyword: '#f92672',
        string: '#e6db74',
        number: '#ae81ff',
        boolean: '#ae81ff',
        null: '#ae81ff',
        function: '#a6e22e',
        type: '#66d9ef',
        operator: '#f92672',
        punctuation: '#f8f8f2',
        tag: '#f92672',
        attribute: '#a6e22e',
        builtin: '#66d9ef',
        variable: '#f8f8f2',
      },
    },
    solarized: {
      name: 'Solarized',
      bg: '#fdf6e3',
      chrome: '#eee8d5',
      chromeText: '#586e75',
      lineNumber: '#93a1a1',
      text: '#586e75',
      tokens: {
        comment: '#93a1a1',
        keyword: '#859900',
        string: '#2aa198',
        number: '#d33682',
        boolean: '#d33682',
        null: '#d33682',
        function: '#268bd2',
        type: '#b58900',
        operator: '#cb4b16',
        punctuation: '#586e75',
        tag: '#268bd2',
        attribute: '#b58900',
        builtin: '#cb4b16',
        variable: '#586e75',
      },
    },
    nord: {
      name: 'Nord',
      bg: '#2e3440',
      chrome: '#3b4252',
      chromeText: '#81a1c1',
      lineNumber: '#4c566a',
      text: '#d8dee9',
      tokens: {
        comment: '#616e88',
        keyword: '#81a1c1',
        string: '#a3be8c',
        number: '#b48ead',
        boolean: '#b48ead',
        null: '#b48ead',
        function: '#88c0d0',
        type: '#8fbcbb',
        operator: '#81a1c1',
        punctuation: '#eceff4',
        tag: '#81a1c1',
        attribute: '#8fbcbb',
        builtin: '#5e81ac',
        variable: '#d8dee9',
      },
    },
    'one-light': {
      name: 'One Light',
      bg: '#fafafa',
      chrome: '#f0f0f0',
      chromeText: '#a0a1a7',
      lineNumber: '#c8c8c8',
      text: '#383a42',
      tokens: {
        comment: '#a0a1a7',
        keyword: '#a626a4',
        string: '#50a14f',
        number: '#986801',
        boolean: '#986801',
        null: '#986801',
        function: '#4078f2',
        type: '#c18401',
        operator: '#0184bc',
        punctuation: '#383a42',
        tag: '#e45649',
        attribute: '#986801',
        builtin: '#c18401',
        variable: '#383a42',
      },
    },
  };

  const BACKGROUNDS = {
    'solid-dark': { type: 'solid', color: '#18181b' },
    'solid-light': { type: 'solid', color: '#f4f4f5' },
    'gradient-sunset': { type: 'gradient', stops: ['#ff6b6b', '#ee5a6f', '#c44569', '#6c5ce7'] },
    'gradient-ocean': { type: 'gradient', stops: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'] },
    'gradient-forest': { type: 'gradient', stops: ['#134e5e', '#71b280'] },
    'gradient-aurora': { type: 'gradient', stops: ['#00c9ff', '#92fe9d', '#fc466b', '#3f5efb'] },
    'gradient-midnight': { type: 'gradient', stops: ['#0f0c29', '#302b63', '#24243e'] },
    'transparent': { type: 'solid', color: 'transparent', checker: true },
  };

  // ====================================================================
  // LANGUAGE DEFINITIONS
  // Pattern-based tokenizer. Each language defines a set of token rules.
  // Rules run in order; first match wins.
  // ====================================================================
  const LANGS = {
    typescript: {
      keywords: /\b(?:abstract|as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|keyof|let|new|null|of|private|protected|public|readonly|return|set|static|super|switch|this|throw|try|type|typeof|undefined|var|void|while|with|yield|true|false)\b/,
      types: /\b(?:string|number|boolean|any|unknown|never|object|Array|Promise|Record|Partial|Required|Pick|Omit|Readonly|Map|Set|Date|RegExp|Error)\b/,
      string: /(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/,
      comment: /\/\/[^\n]*|\/\*[\s\S]*?\*\//,
      number: /\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,
      function: /\b[a-zA-Z_$][\w$]*(?=\s*\()/,
      operator: /[+\-*/%=<>!&|^~?:]+/,
    },
    javascript: {
      keywords: /\b(?:abstract|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|let|new|null|of|private|protected|public|return|set|static|super|switch|this|throw|true|false|try|typeof|undefined|var|void|while|with|yield)\b/,
      types: /\b(?:string|number|boolean|any|object|Array|Promise|Map|Set|Date|RegExp|Error)\b/,
      string: /(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/,
      comment: /\/\/[^\n]*|\/\*[\s\S]*?\*\//,
      number: /\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,
      function: /\b[a-zA-Z_$][\w$]*(?=\s*\()/,
      operator: /[+\-*/%=<>!&|^~?:]+/,
    },
    python: {
      keywords: /\b(?:False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/,
      types: /\b(?:int|float|str|bool|list|dict|tuple|set|frozenset|bytes|bytearray|object|type|None)\b/,
      string: /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
      comment: /#[^\n]*/,
      number: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?j?\b/,
      function: /\b[a-zA-Z_][\w]*(?=\s*\()/,
      operator: /[+\-*/%=<>!&|^~]+/,
    },
    rust: {
      keywords: /\b(?:as|async|await|break|const|continue|crate|dyn|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|Self|self|static|struct|super|trait|true|type|unsafe|use|where|while)\b/,
      types: /\b(?:i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Vec|Option|Result|Box|Rc|Arc|HashMap)\b/,
      string: /b?"(?:[^"\\]|\\.)*"|b?r#*"[\s\S]*?"#*/,
      comment: /\/\/[^\n]*|\/\*[\s\S]*?\*\//,
      number: /\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(?:u8|u16|u32|u64|u128|i8|i16|i32|i64|isize|usize|f32|f64)?\b/,
      function: /\b[a-zA-Z_][\w]*(?=\s*[!(])/,
      operator: /[+\-*/%=<>!&|^~?:]+/,
    },
    go: {
      keywords: /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go|goto|if|import|interface|map|package|range|return|select|struct|switch|type|var|nil|true|false)\b/,
      types: /\b(?:bool|byte|complex64|complex128|error|float32|float64|int|int8|int16|int32|int64|rune|string|uint|uint8|uint16|uint32|uint64|uintptr)\b/,
      string: /"(?:[^"\\]|\\.)*"|`[^`]*`/,
      comment: /\/\/[^\n]*|\/\*[\s\S]*?\*\//,
      number: /\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,
      function: /\b[a-zA-Z_][\w]*(?=\s*\()/,
      operator: /[+\-*/%=<>!&|^~.:]+/,
    },
    java: {
      keywords: /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|true|false|try|void|volatile|while|yield|var|record|sealed)\b/,
      types: /\b(?:String|Integer|Boolean|Long|Double|Float|List|Map|Set|ArrayList|HashMap|HashSet|Optional|Stream|Object)\b/,
      string: /"(?:[^"\\]|\\.)*"/,
      comment: /\/\/[^\n]*|\/\*[\s\S]*?\*\//,
      number: /\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?[fLdD]?\b/,
      function: /\b[a-zA-Z_$][\w$]*(?=\s*\()/,
      operator: /[+\-*/%=<>!&|^~?:]+/,
    },
    cpp: {
      keywords: /\b(?:alignas|alignof|and|auto|bool|break|case|catch|char|char16_t|char32_t|class|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|not|nullptr|operator|or|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while|xor)\b/,
      types: /\b(?:string|wstring|vector|map|unordered_map|set|unordered_set|array|deque|list|pair|tuple|shared_ptr|unique_ptr|weak_ptr|optional|variant|function)\b/,
      string: /"(?:[^"\\]|\\.)*"|R"\([^)]*\)[^"]*"/,
      comment: /\/\/[^\n]*|\/\*[\s\S]*?\*\//,
      number: /\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fLuU]*\b/,
      function: /\b[a-zA-Z_][\w]*(?=\s*\()/,
      operator: /[+\-*/%=<>!&|^~?:]+/,
    },
    csharp: {
      keywords: /\b(?:abstract|as|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|var|virtual|void|volatile|while|yield|async|await|record|init)\b/,
      types: /\b(?:String|Int32|Int64|Boolean|Double|Decimal|List|Dictionary|HashSet|IEnumerable|Task|Action|Func|Nullable|Guid|DateTime)\b/,
      string: /@?"(?:[^"\\]|\\.)*"|\$"(?:[^"\\]|\\.)*"/,
      comment: /\/\/[^\n]*|\/\*[\s\S]*?\*\//,
      number: /\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?[fLdDMm]?\b/,
      function: /\b[a-zA-Z_][\w]*(?=\s*\()/,
      operator: /[+\-*/%=<>!&|^~?:]+/,
    },
    ruby: {
      keywords: /\b(?:BEGIN|END|alias|and|begin|break|case|class|def|defined\?|do|else|elsif|end|ensure|false|for|if|in|module|next|nil|not|or|redo|rescue|retry|return|self|super|then|true|undef|unless|until|when|while|yield|__FILE__|__LINE__|__dir__)\b/,
      types: /\b(?:String|Integer|Float|Array|Hash|Symbol|Object|NilClass|TrueClass|FalseClass|Numeric|Comparable|Enumerable)\b/,
      string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|%[wqQ].*?\\?[a-z]/,
      comment: /#[^\n]*/,
      number: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,
      function: /\b[a-zA-Z_][\w]*(?=\s*[(\s])/,
      operator: /[+\-*/%=<>!&|^~?:]+/,
    },
    php: {
      keywords: /\b(?:abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|false|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|null|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|true|try|unset|use|var|while|xor|yield)\b/,
      types: /\b(?:int|integer|float|double|string|bool|boolean|array|object|mixed|void|never|self|static|parent)\b/,
      string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
      comment: /\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\//,
      number: /\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?\b/,
      function: /\b[a-zA-Z_][\w]*(?=\s*\()/,
      operator: /\.|[+\-*/%=<>!&|^~?:]+/,
    },
    sql: {
      keywords: /\b(?:SELECT|FROM|WHERE|GROUP|ORDER|BY|HAVING|LIMIT|OFFSET|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|ON|AS|AND|OR|NOT|NULL|IS|IN|BETWEEN|LIKE|EXISTS|CREATE|TABLE|INDEX|VIEW|DROP|ALTER|ADD|INSERT|INTO|VALUES|UPDATE|SET|DELETE|TRUNCATE|DISTINCT|UNION|ALL|CASE|WHEN|THEN|ELSE|END|WITH|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|DEFAULT|TRUE|FALSE|INT|INTEGER|VARCHAR|TEXT|DATE|TIMESTAMP|BOOLEAN)\b/i,
      types: /\b(?:int|integer|bigint|smallint|tinyint|decimal|numeric|float|real|double|varchar|char|text|date|time|datetime|timestamp|boolean|bool|json|jsonb|uuid)\b/i,
      string: /'(?:[^'\\]|\\.)*'/,
      comment: /--[^\n]*|\/\*[\s\S]*?\*\//,
      number: /\b\d+(?:\.\d+)?\b/,
      function: /\b[a-zA-Z_][\w]*(?=\s*\()/,
      operator: /[+\-*/%=<>!|<>=]+/,
    },
    bash: {
      keywords: /\b(?:if|then|else|elif|fi|case|esac|for|while|until|do|done|in|function|select|return|break|continue|exit|export|alias|source|local|readonly|declare|set|unset|shift|true|false)\b/,
      types: null,
      string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
      comment: /#[^\n]*/,
      number: /\b\d+\b/,
      function: /\b[a-zA-Z_][\w-]*(?=\s*\(\))/,
      operator: /[|&;<>=]+/,
    },
    json: {
      keywords: null,
      types: null,
      string: /"(?:[^"\\]|\\.)*"/,
      comment: null,
      number: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,
      function: null,
      operator: /[:,]/,
    },
    html: {
      keywords: /<!DOCTYPE/i,
      types: null,
      string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
      comment: /<!--[\s\S]*?-->/,
      number: null,
      function: null,
      operator: /[=<>]/,
      tag: /<\/?[a-zA-Z][\w-]*(?:\s|>|\/)/,
      attribute: /\b[a-zA-Z_-][\w-]*(?==)/,
    },
    css: {
      keywords: /\b(?:important|inherit|initial|unset|none|auto|block|inline|flex|grid|absolute|relative|fixed|static|sticky|hidden|visible|transparent|currentColor)\b/,
      types: null,
      string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
      comment: /\/\*[\s\S]*?\*\//,
      number: /-?\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|pt|ch|ex)?\b/,
      function: /\b[a-zA-Z-][\w-]*(?=\s*\()/,
      operator: /[{}:;,>~+]/,
    },
  };

  // ====================================================================
  // TOKENIZER
  // Splits source into [{ type, text }, ...] for the canvas to draw.
  // ====================================================================
  function tokenize(source, lang) {
    if (!lang || lang === 'auto' || !LANGS[lang]) {
      lang = autodetect(source);
    }
    const rules = LANGS[lang] || LANGS.javascript;
    const tokens = [];
    let pos = 0;
    const len = source.length;

    while (pos < len) {
      let matched = false;

      // Whitespace (kept as text token so the canvas can render it)
      const ws = source.slice(pos).match(/^\s+/);
      if (ws) {
        tokens.push({ type: 'text', text: ws[0] });
        pos += ws[0].length;
        continue;
      }

      // Try each rule in priority order
      if (rules.comment) {
        const m = source.slice(pos).match(/^/.source) && new RegExp('^(?:' + rules.comment.source + ')').exec(source.slice(pos));
        if (m) {
          tokens.push({ type: 'comment', text: m[0] });
          pos += m[0].length;
          continue;
        }
      }
      if (rules.string) {
        const m = new RegExp('^(?:' + rules.string.source + ')').exec(source.slice(pos));
        if (m) {
          tokens.push({ type: 'string', text: m[0] });
          pos += m[0].length;
          continue;
        }
      }
      if (lang === 'html' && rules.tag) {
        const m = new RegExp('^(?:' + rules.tag.source + ')').exec(source.slice(pos));
        if (m) { tokens.push({ type: 'tag', text: m[0] }); pos += m[0].length; continue; }
      }
      if (lang === 'html' && rules.attribute) {
        const m = new RegExp('^(?:' + rules.attribute.source + ')').exec(source.slice(pos));
        if (m) { tokens.push({ type: 'attribute', text: m[0] }); pos += m[0].length; continue; }
      }
      if (rules.number) {
        const m = new RegExp('^(?:' + rules.number.source + ')').exec(source.slice(pos));
        if (m) { tokens.push({ type: 'number', text: m[0] }); pos += m[0].length; continue; }
      }
      if (rules.keywords) {
        const m = new RegExp('^(?:' + rules.keywords.source + ')').exec(source.slice(pos));
        if (m) {
          const t = /^(?:true|false|null|undefined|None|nil|TRUE|FALSE)$/i.test(m[0]) ? 'boolean' : 'keyword';
          if (/^(?:true|false)$/i.test(m[0])) tokens.push({ type: 'boolean', text: m[0] });
          else if (/^(?:null|undefined|None|nil)$/i.test(m[0])) tokens.push({ type: 'null', text: m[0] });
          else tokens.push({ type: 'keyword', text: m[0] });
          pos += m[0].length;
          continue;
        }
      }
      if (rules.types) {
        const m = new RegExp('^(?:' + rules.types.source + ')').exec(source.slice(pos));
        if (m) { tokens.push({ type: 'type', text: m[0] }); pos += m[0].length; continue; }
      }
      if (rules.function) {
        const m = new RegExp('^(?:' + rules.function.source + ')').exec(source.slice(pos));
        if (m) { tokens.push({ type: 'function', text: m[0] }); pos += m[0].length; continue; }
      }
      if (rules.operator) {
        const m = new RegExp('^(?:[' + rules.operator.source.replace(/[[\]]/g, '') + '])+').exec(source.slice(pos));
        if (m) { tokens.push({ type: 'operator', text: m[0] }); pos += m[0].length; continue; }
      }

      // Fallback: single char
      tokens.push({ type: 'text', text: source[pos] });
      pos++;
    }
    return tokens;
  }

  function autodetect(source) {
    if (/^\s*[<\?]xml|^\s*<(!DOCTYPE|html|head|body)/i.test(source)) return 'html';
    if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP)\b/im.test(source)) return 'sql';
    if (/^\s*[{[]/.test(source) && /"\s*:\s*/.test(source)) return 'json';
    if (/\bdef\s+\w+\s*\(/.test(source) || /\bimport\s+\w+/.test(source)) return 'python';
    if (/\b(fn|let|mut|impl|pub)\b/.test(source)) return 'rust';
    if (/\b(func|package|import)\b/.test(source)) return 'go';
    if (/\b(interface|extends|implements)\b/.test(source) || /:\s*(string|number|boolean)\b/.test(source)) return 'typescript';
    if (/<\/?[a-z][\w-]*>/.test(source) && /=/.test(source)) return 'html';
    if (/\b(function|const|let|var|=>)\b/.test(source)) return 'javascript';
    if (/^#!\s*\/bin\/(ba)?sh/.test(source) || /\$\{?\w+\}?/.test(source)) return 'bash';
    return 'javascript';
  }

  // ====================================================================
  // MARKDOWN RENDERER (lightweight)
  // ====================================================================
  function renderMarkdown(source) {
    const lines = source.split('\n');
    const out = [];
    let inCodeBlock = false;
    let codeLang = '';
    let codeBuffer = [];
    let inList = false;

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          out.push({ type: 'codeblock', text: codeBuffer.join('\n'), lang: codeLang });
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLang = line.slice(3).trim();
        }
        continue;
      }
      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }
      if (/^#{1,6}\s+/.test(line)) {
        const m = line.match(/^(#{1,6})\s+(.*)$/);
        out.push({ type: 'heading', level: m[1].length, text: m[2] });
        inList = false;
        continue;
      }
      if (/^[-*+]\s+/.test(line)) {
        out.push({ type: 'listitem', text: line.replace(/^[-*+]\s+/, ''), bullet: line[0] });
        inList = true;
        continue;
      }
      if (/^\d+\.\s+/.test(line)) {
        out.push({ type: 'ordered', text: line.replace(/^\d+\.\s+/, '') });
        inList = true;
        continue;
      }
      if (/^\|.*\|$/.test(line)) {
        out.push({ type: 'tablerow', text: line });
        inList = false;
        continue;
      }
      if (/^[-:|\s]+$/.test(line) && out.length && out[out.length - 1].type === 'tablerow') {
        out.push({ type: 'tablesep' });
        inList = false;
        continue;
      }
      if (line.trim() === '') {
        out.push({ type: 'blank' });
        inList = false;
        continue;
      }
      out.push({ type: 'paragraph', text: line });
      inList = false;
    }
    return out;
  }

  // ====================================================================
  // CANVAS RENDERER
  // ====================================================================
  let renderPending = false;
  const state = {
    mode: 'code',
    lang: 'typescript',
    theme: 'midnight',
    window: 'mac',
    background: 'gradient-midnight',
    padding: 48,
    radius: 12,
    fontSize: 14,
  };

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  function render() {
    const source = document.getElementById('codeInput').value;
    if (!source.trim()) return;

    const theme = THEMES[state.theme];
    const bg = BACKGROUNDS[state.background];
    const fontSize = state.fontSize;
    const lineHeight = Math.round(fontSize * 1.55);
    const padding = state.padding;
    const radius = state.radius;
    const chromeHeight = state.window === 'none' ? 0 : 32;
    const fontFamily = '"JetBrains Mono", "Fira Code", monospace';

    // Measure content width to size the canvas
    ctx.font = `${fontSize}px ${fontFamily}`;
    const maxLineLen = Math.max(...source.split('\n').map((l) => l.length));
    const charWidth = ctx.measureText('M').width;
    const lineNumberWidth = String(source.split('\n').length).length * charWidth + 24;
    const contentWidth = Math.min(1200, Math.max(400, maxLineLen * charWidth + lineNumberWidth + 48));
    const lineCount = source.split('\n').length;
    const contentHeight = lineCount * lineHeight + 32; // padding inside card

    const cardWidth = contentWidth + padding * 2;
    const cardHeight = contentHeight + padding * 2 + chromeHeight;

    const exportScale = 2;
    canvas.width = cardWidth * exportScale;
    canvas.height = cardHeight * exportScale;
    canvas.style.width = cardWidth + 'px';
    canvas.style.height = cardHeight + 'px';
    ctx.scale(exportScale, exportScale);

    document.getElementById('dimWidth').textContent = canvas.width;
    document.getElementById('dimHeight').textContent = canvas.height;

    // 1. Outer background (with gradient/solid + optional checker for transparent)
    drawBackground(ctx, cardWidth, cardHeight, bg, radius);

    // 2. Card (the code window)
    const cardX = 0, cardY = 0;
    drawCard(ctx, cardX, cardY, cardWidth, cardHeight, theme, radius, state.window, chromeHeight);

    // 3. Code content
    ctx.save();
    ctx.beginPath();
    if (radius > 0) {
      roundedRect(ctx, cardX, cardY, cardWidth, cardHeight, radius);
      ctx.clip();
    }

    if (state.mode === 'code') {
      const tokens = tokenize(source, state.lang);
      drawCode(ctx, tokens, theme, {
        x: cardX + padding,
        y: cardY + padding + chromeHeight,
        fontSize,
        lineHeight,
        lineNumberWidth,
        charWidth,
        lineCount,
      });
    } else {
      const blocks = renderMarkdown(source);
      drawMarkdown(ctx, blocks, theme, {
        x: cardX + padding,
        y: cardY + padding + chromeHeight,
        fontSize,
        lineHeight,
        cardWidth: cardWidth - padding * 2,
      });
    }
    ctx.restore();
  }

  function drawBackground(ctx, w, h, bg, radius) {
    if (bg.type === 'solid') {
      if (bg.checker) {
        // Transparent: draw checker pattern
        const tile = 16;
        for (let y = 0; y < h; y += tile) {
          for (let x = 0; x < w; x += tile) {
            ctx.fillStyle = ((x / tile + y / tile) % 2 === 0) ? '#e4e4e7' : '#f4f4f5';
            ctx.fillRect(x, y, tile, tile);
          }
        }
      } else {
        ctx.fillStyle = bg.color;
        ctx.fillRect(0, 0, w, h);
      }
    } else if (bg.type === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      const step = 1 / (bg.stops.length - 1);
      bg.stops.forEach((c, i) => grad.addColorStop(i * step, c));
      ctx.fillStyle = grad;
      roundRectFill(ctx, 0, 0, w, h, radius);
    }
  }

  function drawCard(ctx, x, y, w, h, theme, radius, windowStyle, chromeHeight) {
    // Card background
    ctx.fillStyle = theme.bg;
    roundRectFill(ctx, x, y, w, h, radius);

    // Chrome bar
    if (chromeHeight > 0) {
      ctx.fillStyle = theme.chrome;
      if (windowStyle === 'mac') {
        // Rounded top
        ctx.save();
        ctx.beginPath();
        roundedRect(ctx, x, y, w, h, radius);
        ctx.clip();
        ctx.fillRect(x, y, w, chromeHeight);
        ctx.restore();
        // Traffic lights
        const cy = y + chromeHeight / 2;
        const cx = x + 16;
        drawCircle(ctx, cx, cy, 6, '#ff5f57');
        drawCircle(ctx, cx + 16, cy, 6, '#febc2e');
        drawCircle(ctx, cx + 32, cy, 6, '#28c840');
      } else if (windowStyle === 'win') {
        ctx.fillRect(x, y, w, chromeHeight);
        // Windows controls
        const cy = y + chromeHeight / 2;
        const cx = x + w - 16;
        ctx.strokeStyle = theme.chromeText;
        ctx.lineWidth = 1.2;
        // Minimize
        ctx.beginPath(); ctx.moveTo(cx - 36, cy); ctx.lineTo(cx - 28, cy); ctx.stroke();
        // Maximize
        ctx.strokeRect(cx - 24, cy - 4, 8, 8);
        // Close
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy - 4); ctx.lineTo(cx - 2, cy + 4);
        ctx.moveTo(cx - 10, cy + 4); ctx.lineTo(cx - 2, cy - 4);
        ctx.stroke();
      }
    }
  }

  function drawCode(ctx, tokens, theme, opts) {
    const { x, y, fontSize, lineHeight, lineNumberWidth, charWidth, lineCount } = opts;
    const fontFamily = '"JetBrains Mono", "Fira Code", monospace';

    // Line numbers
    ctx.fillStyle = theme.lineNumber;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'right';
    for (let i = 0; i < lineCount; i++) {
      const ly = y + 16 + i * lineHeight;
      ctx.fillText(String(i + 1), x + lineNumberWidth - 8, ly);
    }

    // Code
    ctx.textAlign = 'left';
    let cursorX = x + lineNumberWidth;
    let cursorY = y + 16;
    let currentLine = 0;

    function newLine() {
      cursorX = x + lineNumberWidth;
      cursorY += lineHeight;
      currentLine++;
    }

    for (const token of tokens) {
      if (token.text === '\n') {
        newLine();
        continue;
      }
      const colorKey = token.type === 'text' ? 'text' : token.type;
      ctx.fillStyle = theme.tokens[colorKey] || theme.text;
      // Draw token, handle line wrapping manually
      const parts = token.text.split('\n');
      for (let i = 0; i < parts.length; i++) {
        if (i > 0) newLine();
        if (parts[i]) {
          ctx.fillText(parts[i], cursorX, cursorY);
          cursorX += ctx.measureText(parts[i]).width;
        }
      }
    }
  }

  function drawMarkdown(ctx, blocks, theme, opts) {
    const { x, y, fontSize, lineHeight, cardWidth } = opts;
    const fontFamily = '"JetBrains Mono", "Fira Code", monospace';
    const sansFamily = 'Inter, sans-serif';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    let cy = y + 16;
    let inTable = false;
    let tableRows = [];

    function flushTable() {
      if (tableRows.length === 0) return;
      const colCount = tableRows[0].length;
      const colWidth = (cardWidth - 32) / colCount;
      ctx.font = `${fontSize}px ${sansFamily}`;
      for (let r = 0; r < tableRows.length; r++) {
        const row = tableRows[r];
        ctx.fillStyle = r === 0 ? theme.tokens.keyword : theme.text;
        for (let c = 0; c < row.length; c++) {
          ctx.fillText(row[c], x + c * colWidth + 8, cy);
        }
        cy += lineHeight;
        if (r === 0) {
          ctx.strokeStyle = theme.tokens.comment;
          ctx.beginPath();
          ctx.moveTo(x, cy - 4);
          ctx.lineTo(x + cardWidth - 32, cy - 4);
          ctx.stroke();
        }
      }
      tableRows = [];
      inTable = false;
      cy += 8;
    }

    for (const block of blocks) {
      if (block.type === 'tablerow') {
        const cells = block.text.split('|').slice(1, -1).map((c) => c.trim());
        tableRows.push(cells);
        inTable = true;
        continue;
      }
      if (block.type === 'tablesep') continue;
      if (inTable) flushTable();

      if (block.type === 'heading') {
        const size = Math.max(fontSize, fontSize + (7 - block.level) * 3);
        ctx.font = `700 ${size}px ${sansFamily}`;
        ctx.fillStyle = theme.tokens.keyword;
        ctx.fillText(block.text, x, cy);
        cy += size * 1.3 + 4;
      } else if (block.type === 'listitem' || block.type === 'ordered') {
        ctx.font = `${fontSize}px ${sansFamily}`;
        ctx.fillStyle = theme.tokens.comment;
        const bullet = block.type === 'ordered' ? '•' : block.bullet;
        ctx.fillText(bullet, x, cy);
        ctx.fillStyle = theme.text;
        ctx.fillText(block.text, x + 20, cy);
        cy += lineHeight;
      } else if (block.type === 'codeblock') {
        ctx.font = `${fontSize}px ${fontFamily}`;
        const tokens = tokenize(block.text, block.lang || 'javascript');
        const startY = cy;
        let cx = x + 16;
        let ln = 0;
        const lnWidth = String(block.text.split('\n').length).length * (fontSize * 0.6) + 16;
        for (const t of tokens) {
          if (t.text === '\n') { cx = x + 16 + lnWidth; cy += lineHeight; ln++; continue; }
          ctx.fillStyle = theme.tokens[t.type] || theme.text;
          ctx.fillText(t.text, cx, cy);
          cx += ctx.measureText(t.text).width;
        }
        cy = startY + (block.text.split('\n').length) * lineHeight + 8;
      } else if (block.type === 'paragraph') {
        ctx.font = `${fontSize}px ${sansFamily}`;
        const lines = wrapText(ctx, block.text, cardWidth - 32);
        for (const l of lines) {
          ctx.fillStyle = theme.text;
          ctx.fillText(l, x, cy);
          cy += lineHeight;
        }
        cy += 4;
      } else if (block.type === 'blank') {
        cy += lineHeight / 2;
      }
    }
    flushTable();
  }

  function wrapText(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let current = '';
    for (const w of words) {
      const test = current ? current + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = w;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  // ====================================================================
  // DRAW HELPERS
  // ====================================================================
  function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
  function roundRectFill(ctx, x, y, w, h, r) {
    if (r > 0) {
      roundedRect(ctx, x, y, w, h, r);
      ctx.fill();
    } else {
      ctx.fillRect(x, y, w, h);
    }
  }
  function drawCircle(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // ====================================================================
  // EXPORT
  // ====================================================================
  function exportPNG() {
    const link = document.createElement('a');
    link.download = 'code-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function exportSVG() {
    // For SVG, embed the PNG as a base64 image inside an <svg> element.
    // True vector export would require re-implementing the renderer in SVG;
    // for the social-share use case, the raster-as-SVG approach is fine and
    // still scales without pixelation.
    const dataUrl = canvas.toDataURL('image/png');
    const w = canvas.width, h = canvas.height;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <image href="${dataUrl}" width="${w}" height="${h}"/>
</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'code-image.svg';
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ====================================================================
  // EMBED CODE GENERATOR
  // ====================================================================
  function showEmbed() {
    const dataUrl = canvas.toDataURL('image/png');
    const w = canvas.width, h = canvas.height;
    const embed = `<!-- Generated with asadfaizee/code-to-image -->
<a href="https://asadfaizee.is-a.dev/tools/code-to-image" target="_blank" rel="noopener">
  <img src="${dataUrl}" alt="Code snippet" width="${w / 2}" height="${h / 2}" style="max-width:100%;height:auto;border-radius:8px;" />
</a>`;
    document.getElementById('embedCode').value = embed;
    document.getElementById('embedModal').hidden = false;
  }

  function closeEmbed() {
    document.getElementById('embedModal').hidden = true;
  }

  async function copyEmbed() {
    const code = document.getElementById('embedCode').value;
    try {
      await navigator.clipboard.writeText(code);
      const btn = document.getElementById('copyEmbedBtn');
      flashHint(btn, '✓ Copied', 'is-success');
    } catch (e) {
      flashHint(document.getElementById('copyEmbedBtn'), 'Copy failed');
    }
  }

  // ====================================================================
  // UI WIRING
  // ====================================================================
  function flashHint(btn, msg, extraClass = '') {
    const original = btn.textContent;
    btn.textContent = msg;
    btn.classList.add(...extraClass.split(' ').filter(Boolean));
    setTimeout(() => { btn.textContent = original; btn.classList.remove('is-success'); }, 1400);
  }

  function scheduleRender() {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
      render();
      renderPending = false;
    });
  }

  // Tabs
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      state.mode = btn.dataset.mode;
      scheduleRender();
    });
  });

  // Window style
  document.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seg-btn').forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-checked', String(b === btn));
      });
      state.window = btn.dataset.window;
      scheduleRender();
    });
  });

  // Controls
  document.getElementById('langSelect').addEventListener('change', (e) => {
    state.lang = e.target.value;
    scheduleRender();
  });
  document.getElementById('themeSelect').addEventListener('change', (e) => {
    state.theme = e.target.value;
    scheduleRender();
  });
  document.getElementById('bgSelect').addEventListener('change', (e) => {
    state.background = e.target.value;
    scheduleRender();
  });
  document.getElementById('paddingRange').addEventListener('input', (e) => {
    state.padding = parseInt(e.target.value, 10);
    document.getElementById('paddingValue').textContent = state.padding + 'px';
    scheduleRender();
  });
  document.getElementById('radiusRange').addEventListener('input', (e) => {
    state.radius = parseInt(e.target.value, 10);
    document.getElementById('radiusValue').textContent = state.radius + 'px';
    scheduleRender();
  });
  document.getElementById('fontSizeRange').addEventListener('input', (e) => {
    state.fontSize = parseInt(e.target.value, 10);
    document.getElementById('fontSizeValue').textContent = state.fontSize + 'px';
    scheduleRender();
  });

  // Editor input
  document.getElementById('codeInput').addEventListener('input', scheduleRender);

  // Sample + clear
  document.getElementById('sampleBtn').addEventListener('click', () => {
    document.getElementById('codeInput').value = state.mode === 'markdown' ? SAMPLE_MD : SAMPLE_CODE;
    scheduleRender();
  });
  document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('codeInput').value = '';
    scheduleRender();
  });

  // Export buttons
  document.getElementById('exportPngBtn').addEventListener('click', exportPNG);
  document.getElementById('exportSvgBtn').addEventListener('click', exportSVG);
  document.getElementById('embedBtn').addEventListener('click', showEmbed);

  // Modal
  document.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeEmbed));
  document.getElementById('copyEmbedBtn').addEventListener('click', copyEmbed);

  // ====================================================================
  // SAMPLE DATA
  // ====================================================================
  const SAMPLE_CODE = `// The 2x retina trick
function exportRetina(canvas, scale = 2) {
  const w = canvas.width * scale;
  const h = canvas.height * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  return canvas.toDataURL('image/png');
}

const result = exportRetina(myCanvas);
console.log('Exported at', 2, 'x retina');`;

  const SAMPLE_MD = `# The async/await pattern

Most JavaScript code reads top-to-bottom. **Async code** doesn't.

## Three rules to remember

1. Always handle the error path
2. Never trust external data
3. Keep the happy path shallow

> Async is contagious. Once one function returns a Promise, every caller has to think about timing.

\`\`\`typescript
async function fetchUser(id: string): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}
\`\`\``;

  // ====================================================================
  // INIT
  // ====================================================================
  function init() {
    document.getElementById('codeInput').value = SAMPLE_CODE;
    render();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

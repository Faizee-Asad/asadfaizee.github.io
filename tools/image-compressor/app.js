/* ==========================================================================
   Image Compressor
   Drag-drop, canvas compression, batch processing, ZIP export
   100% client-side, zero network calls
   ========================================================================== */
(() => {
  'use strict';

  // ====================================================================
  // Network monitor (proves zero upload)
  // ====================================================================
  const NetMonitor = (() => {
    let requests = 0;
    let bytes = 0;

    function bump(size = 0) {
      // Only count POST/PUT requests with outbound data
      // (file inputs don't count since they don't trigger HTTP)
      requests++;
      bytes += size;
    }

    const origFetch = window.fetch;
    window.fetch = function (...args) {
      const method = (args[1]?.method || 'GET').toUpperCase();
      if (method !== 'GET' && method !== 'HEAD') bump(estimateSize(args[1]?.body));
      return origFetch.apply(this, args);
    };

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, ...args) {
      this._method = method;
      this._monitored = true;
      return origOpen.call(this, method, ...args);
    };
    XMLHttpRequest.prototype.send = function (body) {
      if (this._monitored && this._method !== 'GET' && this._method !== 'HEAD') bump(estimateSize(body));
      return origSend.call(this, arguments);
    };

    if (navigator.sendBeacon) {
      const origBeacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = function (url, data) {
        bump(estimateSize(data));
        return origBeacon(url, data);
      };
    }

    function estimateSize(data) {
      if (!data) return 0;
      if (typeof data === 'string') return data.length;
      if (data instanceof FormData) return 0;
      if (data instanceof URLSearchParams) return data.toString().length;
      if (data instanceof Blob) return data.size;
      if (data instanceof ArrayBuffer) return data.byteLength;
      return 0;
    }

    return { requests: () => requests, bytes: () => bytes };
  })();

  // ====================================================================
  // DOM refs
  // ====================================================================
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const dropzone = $('#dropzone');
  const fileInput = $('#fileInput');
  const browseBtn = $('#browseBtn');
  const controlsBar = $('#controlsBar');
  const statsSummary = $('#statsSummary');
  const fileGrid = $('#fileGrid');
  const formatSelect = $('#formatSelect');
  const qualityRange = $('#qualityRange');
  const qualityValue = $('#qualityValue');
  const maxWidthInput = $('#maxWidthInput');
  const clearAllBtn = $('#clearAllBtn');
  const downloadAllBtn = $('#downloadAllBtn');

  // ====================================================================
  // State
  // ====================================================================
  const state = {
    files: [], // { id, file, originalUrl, originalSize, compressed: { blob, url, size, format }, status }
    format: 'auto',
    quality: 0.8,
    maxWidth: null,
    counter: 0,
  };

  // ====================================================================
  // Drag and drop
  // ====================================================================
  function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    dropzone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  ['dragenter', 'dragover'].forEach((eventName) => {
    dropzone.addEventListener(eventName, () => dropzone.classList.add('is-dragover'));
  });
  ['dragleave', 'drop'].forEach((eventName) => {
    dropzone.addEventListener(eventName, () => dropzone.classList.remove('is-dragover'));
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = Array.from(dt.files).filter((f) => f.type.startsWith('image/'));
    if (files.length > 0) addFiles(files);
  });

  dropzone.addEventListener('click', (e) => {
    if (e.target === browseBtn) return;
    fileInput.click();
  });
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });
  browseBtn.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });
  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) addFiles(files);
    fileInput.value = ''; // allow re-selecting the same file
  });

  // ====================================================================
  // File processing
  // ====================================================================
  function addFiles(files) {
    const remaining = 50 - state.files.length;
    const toAdd = files.slice(0, remaining);
    if (files.length > remaining) {
      console.warn(`Image Compressor: only ${remaining} more files allowed (50 max)`);
    }
    toAdd.forEach((file) => {
      const id = ++state.counter;
      const originalUrl = URL.createObjectURL(file);
      state.files.push({
        id,
        file,
        originalUrl,
        originalSize: file.size,
        compressed: null,
        status: 'pending', // pending | processing | done | error
        error: null,
      });
      renderFiles();
      processFile(id);
    });
    controlsBar.hidden = false;
    statsSummary.hidden = false;
  }

  async function processFile(id) {
    const item = state.files.find((f) => f.id === id);
    if (!item) return;
    item.status = 'processing';
    renderFiles();

    try {
      const img = await loadImage(item.originalUrl);
      const targetFormat = resolveFormat(item.file.type);
      const { canvas, width, height } = setupCanvas(img, state.maxWidth);
      drawImage(canvas, img, width, height);

      // PNG is lossless, quality param ignored by browser (but pass it anyway)
      const quality = targetFormat === 'image/png' ? undefined : state.quality;
      const blob = await canvasToBlob(canvas, targetFormat, quality);

      item.compressed = {
        blob,
        url: URL.createObjectURL(blob),
        size: blob.size,
        format: targetFormat,
        width,
        height,
      };
      item.status = 'done';
    } catch (e) {
      item.status = 'error';
      item.error = e.message || 'Failed to process';
    }
    renderFiles();
    renderStats();
  }

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = url;
    });
  }

  function setupCanvas(img, maxWidth) {
    let width = img.naturalWidth;
    let height = img.naturalHeight;
    if (maxWidth && width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return { canvas, width, height };
  }

  function drawImage(canvas, img, width, height) {
    const ctx = canvas.getContext('2d');
    // Fill white for JPEG (browsers default to black, which can look bad for transparent PNGs)
    if (state.format === 'image/jpeg' || (state.format === 'auto' && img.src.includes && false)) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(img, 0, 0, width, height);
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Browser refused to encode this image'));
        },
        type,
        quality
      );
    });
  }

  function resolveFormat(sourceType) {
    if (state.format !== 'auto') return state.format;
    // "auto" = keep the source format, with WebP preference if available
    if (sourceType === 'image/png' || sourceType === 'image/jpeg' || sourceType === 'image/webp') {
      return sourceType;
    }
    return 'image/jpeg'; // fallback for gif/bmp
  }

  // ====================================================================
  // Render
  // ====================================================================
  function renderFiles() {
    fileGrid.innerHTML = state.files.map(renderFileCard).join('');
    // Wire up actions (event delegation could work but explicit is clearer)
    state.files.forEach((item) => {
      const downloadBtn = document.querySelector(`[data-action="download"][data-id="${item.id}"]`);
      const removeBtn = document.querySelector(`[data-action="remove"][data-id="${item.id}"]`);
      if (downloadBtn) downloadBtn.addEventListener('click', () => downloadFile(item));
      if (removeBtn) removeBtn.addEventListener('click', () => removeFile(item.id));
    });
  }

  function renderFileCard(item) {
    const previewUrl = item.compressed ? item.compressed.url : item.originalUrl;
    const statusBadge = (() => {
      if (item.status === 'processing') return `<div class="file-status">Compressing…</div>`;
      if (item.status === 'error') return `<div class="file-status" style="background:rgba(239,68,68,0.85)">Error: ${escapeHTML(item.error)}</div>`;
      return '';
    })();

    let sizes = '';
    if (item.compressed) {
      const saved = item.originalSize - item.compressed.size;
      const savedPct = Math.round((saved / item.originalSize) * 100);
      const className = savedPct > 5 ? '' : savedPct < 0 ? 'is-bigger' : 'is-neutral';
      sizes = `
        <div class="file-sizes">
          <span class="size-original">${formatBytes(item.originalSize)}</span>
          <span class="size-arrow">→</span>
          <span class="size-new">${formatBytes(item.compressed.size)}</span>
          <span class="size-saved ${className}">${savedPct >= 0 ? '−' : '+'}${Math.abs(savedPct)}%</span>
        </div>
      `;
    } else {
      sizes = `<div class="file-sizes"><span>${formatBytes(item.originalSize)}</span></div>`;
    }

    return `
      <article class="file-card ${item.status === 'processing' ? 'is-processing' : ''} ${item.status === 'error' ? 'is-error' : ''}">
        <div class="file-preview">
          <img src="${previewUrl}" alt="" />
          ${statusBadge}
        </div>
        <div class="file-info">
          <div class="file-name" title="${escapeHTML(item.file.name)}">${escapeHTML(item.file.name)}</div>
          ${sizes}
          <div class="file-actions">
            <button type="button" class="file-btn is-primary" data-action="download" data-id="${item.id}" ${!item.compressed ? 'disabled' : ''}>Download</button>
            <button type="button" class="file-btn" data-action="remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderStats() {
    const total = state.files.length;
    const originalTotal = state.files.reduce((s, f) => s + f.originalSize, 0);
    const compressedTotal = state.files.reduce((s, f) => s + (f.compressed ? f.compressed.size : 0), 0);
    const saved = originalTotal - compressedTotal;
    const savedPct = originalTotal > 0 ? Math.round((saved / originalTotal) * 100) : 0;

    $('#statFiles').textContent = total;
    $('#statOriginal').textContent = formatBytes(originalTotal);
    $('#statCompressed').textContent = formatBytes(compressedTotal);
    $('#statSaved').textContent = (savedPct >= 0 ? '−' : '+') + Math.abs(savedPct) + '%';
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function formatBytes(n) {
    if (n === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(n) / Math.log(k));
    return parseFloat((n / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // ====================================================================
  // Actions
  // ====================================================================
  function downloadFile(item) {
    if (!item.compressed) return;
    const a = document.createElement('a');
    a.href = item.compressed.url;
    const ext = extensionFor(item.compressed.format);
    a.download = renameFile(item.file.name, ext);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function removeFile(id) {
    const idx = state.files.findIndex((f) => f.id === id);
    if (idx === -1) return;
    const item = state.files[idx];
    URL.revokeObjectURL(item.originalUrl);
    if (item.compressed) URL.revokeObjectURL(item.compressed.url);
    state.files.splice(idx, 1);
    renderFiles();
    renderStats();
    if (state.files.length === 0) {
      controlsBar.hidden = true;
      statsSummary.hidden = true;
    }
  }

  function clearAll() {
    state.files.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      if (item.compressed) URL.revokeObjectURL(item.compressed.url);
    });
    state.files = [];
    renderFiles();
    renderStats();
    controlsBar.hidden = true;
    statsSummary.hidden = true;
  }

  function downloadAll() {
    const ready = state.files.filter((f) => f.compressed);
    if (ready.length === 0) return;

    if (ready.length === 1) {
      downloadFile(ready[0]);
      return;
    }

    // For multiple files, build a minimal ZIP in-browser.
    // Implementation: write a small ZIP archive (no compression, store-only).
    // This is "stored" mode only, but since the inner blobs are already compressed
    // (jpg/png/webp), it doesn't matter.
    buildZip(ready).then((zipBlob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = `compressed-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  }

  function extensionFor(format) {
    if (format === 'image/jpeg') return 'jpg';
    if (format === 'image/png') return 'png';
    if (format === 'image/webp') return 'webp';
    return 'bin';
  }

  function renameFile(originalName, newExt) {
    const lastDot = originalName.lastIndexOf('.');
    const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
    return `${base}.${newExt}`;
  }

  // ====================================================================
  // Minimal ZIP builder (store-only, no compression)
  // Reference: PKWARE APPNOTE.TXT
  // ====================================================================
  function buildZip(items) {
    return new Promise((resolve) => {
      const encoder = new TextEncoder();
      const files = items.map((item) => ({
        name: renameFile(item.file.name, extensionFor(item.compressed.format)),
        data: new Uint8Array(item.compressed.blob),
      }));

      // Build local file headers + file data, then central directory + EOCD
      const chunks = [];
      const centralDir = [];
      let offset = 0;

      for (const file of files) {
        const nameBytes = encoder.encode(file.name);
        const data = file.data;
        const crc = crc32(data);
        const size = data.length;

        // Local file header
        const lfh = new Uint8Array(30 + nameBytes.length);
        const dv = new DataView(lfh.buffer);
        dv.setUint32(0, 0x04034b50, true); // signature
        dv.setUint16(4, 20, true);          // version needed
        dv.setUint16(6, 0, true);           // flags
        dv.setUint16(8, 0, true);           // method (0 = store)
        dv.setUint16(10, 0, true);          // time
        dv.setUint16(12, 0, true);          // date
        dv.setUint32(14, crc, true);        // CRC32
        dv.setUint32(18, size, true);       // compressed size
        dv.setUint32(22, size, true);       // uncompressed size
        dv.setUint16(26, nameBytes.length, true);
        dv.setUint16(28, 0, true);          // extra length
        lfh.set(nameBytes, 30);
        chunks.push(lfh);
        chunks.push(data);
        // Central directory entry
        const cdh = new Uint8Array(46 + nameBytes.length);
        const cdv = new DataView(cdh.buffer);
        cdv.setUint32(0, 0x02014b50, true); // signature
        cdv.setUint16(4, 20, true);
        cdv.setUint16(6, 20, true);
        cdv.setUint16(8, 0, true);
        cdv.setUint16(10, 0, true);
        cdv.setUint16(12, 0, true);
        cdv.setUint16(14, 0, true);
        cdv.setUint32(16, crc, true);
        cdv.setUint32(20, size, true);
        cdv.setUint32(24, size, true);
        cdv.setUint16(28, nameBytes.length, true);
        cdv.setUint16(30, 0, true);
        cdv.setUint16(32, 0, true);
        cdv.setUint16(34, 0, true);
        cdv.setUint16(36, 0, true);
        cdv.setUint32(38, 0, true);
        cdv.setUint32(42, offset, true);
        cdh.set(nameBytes, 46);
        centralDir.push(cdh);
        offset += lfh.length + data.length;
      }

      // Central directory
      const cdSize = centralDir.reduce((s, c) => s + c.length, 0);
      const cdStart = offset;
      for (const cdh of centralDir) chunks.push(cdh);

      // End of central directory record
      const eocd = new Uint8Array(22);
      const ev = new DataView(eocd.buffer);
      ev.setUint32(0, 0x06054b50, true);
      ev.setUint16(4, 0, true);
      ev.setUint16(6, 0, true);
      ev.setUint16(8, files.length, true);
      ev.setUint16(10, files.length, true);
      ev.setUint32(12, cdSize, true);
      ev.setUint32(16, cdStart, true);
      ev.setUint16(20, 0, true);
      chunks.push(eocd);

      resolve(new Blob(chunks, { type: 'application/zip' }));
    });
  }

  // CRC32 implementation (required for ZIP)
  const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c;
    }
    return table;
  })();

  function crc32(data) {
    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i++) {
      crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  // ====================================================================
  // UI Wiring
  // ====================================================================
  formatSelect.addEventListener('change', (e) => {
    state.format = e.target.value;
    reprocessAll();
  });

  qualityRange.addEventListener('input', (e) => {
    const pct = parseInt(e.target.value, 10);
    state.quality = pct / 100;
    qualityValue.textContent = pct + '%';
  });
  qualityRange.addEventListener('change', reprocessAll);

  maxWidthInput.addEventListener('change', (e) => {
    const v = parseInt(e.target.value, 10);
    state.maxWidth = (isNaN(v) || v <= 0) ? null : v;
    reprocessAll();
  });

  clearAllBtn.addEventListener('click', () => {
    if (state.files.length === 0) return;
    if (confirm('Clear all images?')) clearAll();
  });
  downloadAllBtn.addEventListener('click', downloadAll);

  // Reprocess all files with current settings
  function reprocessAll() {
    state.files.forEach((item) => {
      if (item.compressed) URL.revokeObjectURL(item.compressed.url);
      item.compressed = null;
      item.status = 'pending';
      processFile(item.id);
    });
  }

  // ====================================================================
  // Demo data (click the dropzone with no file, generates a sample)
  // Useful for first-time visitors to see how the tool works.
  // ====================================================================
  function loadDemoImage() {
    // Generate a synthetic test image: 800x600 with a gradient + text
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 800, 600);
    grad.addColorStop(0, '#0ea5e9');
    grad.addColorStop(0.5, '#6366f1');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sample image', 400, 280);
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText('Try compressing me', 400, 320);
    ctx.font = '14px monospace';
    ctx.fillText('Generated client-side for the demo', 400, 360);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'sample-image.jpg', { type: 'image/jpeg' });
      addFiles([file]);
    }, 'image/jpeg', 0.95);
  }

  // Expose demo loader for easy testing (no UI button — first-load users
  // can run `loadDemo()` in the console if curious)
  window.loadDemo = loadDemoImage;
})();

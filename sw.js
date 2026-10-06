/* Service worker exclusivo do Planeta Mangá.
 * Adaptado da arquitetura PWA da base Planeta HQ; o arquivo original não é alterado.
 * Cacheia somente a casca e as dependências estáticas do leitor. Não guarda códigos,
 * respostas do proxy, biblioteca, mangás ou capas. Para atualizações, incremente a versão.
 */
const CACHE_PREFIX = 'planeta-manga-shell-';
const CACHE_VERSION = 'v8';
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const API_ORIGIN = 'https://proxy1.planetahq01.workers.dev';
const INDEX_URL = new URL('./index.html', self.registration.scope).href;
const PDF_CMAP_FILES = [
  "78-EUC-H.bcmap",
  "78-EUC-V.bcmap",
  "78-H.bcmap",
  "78-RKSJ-H.bcmap",
  "78-RKSJ-V.bcmap",
  "78-V.bcmap",
  "78ms-RKSJ-H.bcmap",
  "78ms-RKSJ-V.bcmap",
  "83pv-RKSJ-H.bcmap",
  "90ms-RKSJ-H.bcmap",
  "90ms-RKSJ-V.bcmap",
  "90msp-RKSJ-H.bcmap",
  "90msp-RKSJ-V.bcmap",
  "90pv-RKSJ-H.bcmap",
  "90pv-RKSJ-V.bcmap",
  "Add-H.bcmap",
  "Add-RKSJ-H.bcmap",
  "Add-RKSJ-V.bcmap",
  "Add-V.bcmap",
  "Adobe-CNS1-0.bcmap",
  "Adobe-CNS1-1.bcmap",
  "Adobe-CNS1-2.bcmap",
  "Adobe-CNS1-3.bcmap",
  "Adobe-CNS1-4.bcmap",
  "Adobe-CNS1-5.bcmap",
  "Adobe-CNS1-6.bcmap",
  "Adobe-CNS1-UCS2.bcmap",
  "Adobe-GB1-0.bcmap",
  "Adobe-GB1-1.bcmap",
  "Adobe-GB1-2.bcmap",
  "Adobe-GB1-3.bcmap",
  "Adobe-GB1-4.bcmap",
  "Adobe-GB1-5.bcmap",
  "Adobe-GB1-UCS2.bcmap",
  "Adobe-Japan1-0.bcmap",
  "Adobe-Japan1-1.bcmap",
  "Adobe-Japan1-2.bcmap",
  "Adobe-Japan1-3.bcmap",
  "Adobe-Japan1-4.bcmap",
  "Adobe-Japan1-5.bcmap",
  "Adobe-Japan1-6.bcmap",
  "Adobe-Japan1-UCS2.bcmap",
  "Adobe-Korea1-0.bcmap",
  "Adobe-Korea1-1.bcmap",
  "Adobe-Korea1-2.bcmap",
  "Adobe-Korea1-UCS2.bcmap",
  "B5-H.bcmap",
  "B5-V.bcmap",
  "B5pc-H.bcmap",
  "B5pc-V.bcmap",
  "CNS-EUC-H.bcmap",
  "CNS-EUC-V.bcmap",
  "CNS1-H.bcmap",
  "CNS1-V.bcmap",
  "CNS2-H.bcmap",
  "CNS2-V.bcmap",
  "ETHK-B5-H.bcmap",
  "ETHK-B5-V.bcmap",
  "ETen-B5-H.bcmap",
  "ETen-B5-V.bcmap",
  "ETenms-B5-H.bcmap",
  "ETenms-B5-V.bcmap",
  "EUC-H.bcmap",
  "EUC-V.bcmap",
  "Ext-H.bcmap",
  "Ext-RKSJ-H.bcmap",
  "Ext-RKSJ-V.bcmap",
  "Ext-V.bcmap",
  "GB-EUC-H.bcmap",
  "GB-EUC-V.bcmap",
  "GB-H.bcmap",
  "GB-V.bcmap",
  "GBK-EUC-H.bcmap",
  "GBK-EUC-V.bcmap",
  "GBK2K-H.bcmap",
  "GBK2K-V.bcmap",
  "GBKp-EUC-H.bcmap",
  "GBKp-EUC-V.bcmap",
  "GBT-EUC-H.bcmap",
  "GBT-EUC-V.bcmap",
  "GBT-H.bcmap",
  "GBT-V.bcmap",
  "GBTpc-EUC-H.bcmap",
  "GBTpc-EUC-V.bcmap",
  "GBpc-EUC-H.bcmap",
  "GBpc-EUC-V.bcmap",
  "H.bcmap",
  "HKdla-B5-H.bcmap",
  "HKdla-B5-V.bcmap",
  "HKdlb-B5-H.bcmap",
  "HKdlb-B5-V.bcmap",
  "HKgccs-B5-H.bcmap",
  "HKgccs-B5-V.bcmap",
  "HKm314-B5-H.bcmap",
  "HKm314-B5-V.bcmap",
  "HKm471-B5-H.bcmap",
  "HKm471-B5-V.bcmap",
  "HKscs-B5-H.bcmap",
  "HKscs-B5-V.bcmap",
  "Hankaku.bcmap",
  "Hiragana.bcmap",
  "KSC-EUC-H.bcmap",
  "KSC-EUC-V.bcmap",
  "KSC-H.bcmap",
  "KSC-Johab-H.bcmap",
  "KSC-Johab-V.bcmap",
  "KSC-V.bcmap",
  "KSCms-UHC-H.bcmap",
  "KSCms-UHC-HW-H.bcmap",
  "KSCms-UHC-HW-V.bcmap",
  "KSCms-UHC-V.bcmap",
  "KSCpc-EUC-H.bcmap",
  "KSCpc-EUC-V.bcmap",
  "Katakana.bcmap",
  "NWP-H.bcmap",
  "NWP-V.bcmap",
  "RKSJ-H.bcmap",
  "RKSJ-V.bcmap",
  "Roman.bcmap",
  "UniCNS-UCS2-H.bcmap",
  "UniCNS-UCS2-V.bcmap",
  "UniCNS-UTF16-H.bcmap",
  "UniCNS-UTF16-V.bcmap",
  "UniCNS-UTF32-H.bcmap",
  "UniCNS-UTF32-V.bcmap",
  "UniCNS-UTF8-H.bcmap",
  "UniCNS-UTF8-V.bcmap",
  "UniGB-UCS2-H.bcmap",
  "UniGB-UCS2-V.bcmap",
  "UniGB-UTF16-H.bcmap",
  "UniGB-UTF16-V.bcmap",
  "UniGB-UTF32-H.bcmap",
  "UniGB-UTF32-V.bcmap",
  "UniGB-UTF8-H.bcmap",
  "UniGB-UTF8-V.bcmap",
  "UniJIS-UCS2-H.bcmap",
  "UniJIS-UCS2-HW-H.bcmap",
  "UniJIS-UCS2-HW-V.bcmap",
  "UniJIS-UCS2-V.bcmap",
  "UniJIS-UTF16-H.bcmap",
  "UniJIS-UTF16-V.bcmap",
  "UniJIS-UTF32-H.bcmap",
  "UniJIS-UTF32-V.bcmap",
  "UniJIS-UTF8-H.bcmap",
  "UniJIS-UTF8-V.bcmap",
  "UniJIS2004-UTF16-H.bcmap",
  "UniJIS2004-UTF16-V.bcmap",
  "UniJIS2004-UTF32-H.bcmap",
  "UniJIS2004-UTF32-V.bcmap",
  "UniJIS2004-UTF8-H.bcmap",
  "UniJIS2004-UTF8-V.bcmap",
  "UniJISPro-UCS2-HW-V.bcmap",
  "UniJISPro-UCS2-V.bcmap",
  "UniJISPro-UTF8-V.bcmap",
  "UniJISX0213-UTF32-H.bcmap",
  "UniJISX0213-UTF32-V.bcmap",
  "UniJISX02132004-UTF32-H.bcmap",
  "UniJISX02132004-UTF32-V.bcmap",
  "UniKS-UCS2-H.bcmap",
  "UniKS-UCS2-V.bcmap",
  "UniKS-UTF16-H.bcmap",
  "UniKS-UTF16-V.bcmap",
  "UniKS-UTF32-H.bcmap",
  "UniKS-UTF32-V.bcmap",
  "UniKS-UTF8-H.bcmap",
  "UniKS-UTF8-V.bcmap",
  "V.bcmap",
  "WP-Symbol.bcmap"
];
const APP_SHELL = [
  "./index.html",
  "./manifest.json",
  "./favicon-32.png",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-192-maskable.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./vendor/node-unrar-js.bundle.js",
  "./vendor/unrar.wasm",
  "./vendor/pdfjs/cmaps/78-EUC-H.bcmap",
  "./vendor/pdfjs/cmaps/78-EUC-V.bcmap",
  "./vendor/pdfjs/cmaps/78-H.bcmap",
  "./vendor/pdfjs/cmaps/78-RKSJ-H.bcmap",
  "./vendor/pdfjs/cmaps/78-RKSJ-V.bcmap",
  "./vendor/pdfjs/cmaps/78-V.bcmap",
  "./vendor/pdfjs/cmaps/78ms-RKSJ-H.bcmap",
  "./vendor/pdfjs/cmaps/78ms-RKSJ-V.bcmap",
  "./vendor/pdfjs/cmaps/83pv-RKSJ-H.bcmap",
  "./vendor/pdfjs/cmaps/90ms-RKSJ-H.bcmap",
  "./vendor/pdfjs/cmaps/90ms-RKSJ-V.bcmap",
  "./vendor/pdfjs/cmaps/90msp-RKSJ-H.bcmap",
  "./vendor/pdfjs/cmaps/90msp-RKSJ-V.bcmap",
  "./vendor/pdfjs/cmaps/90pv-RKSJ-H.bcmap",
  "./vendor/pdfjs/cmaps/90pv-RKSJ-V.bcmap",
  "./vendor/pdfjs/cmaps/Add-H.bcmap",
  "./vendor/pdfjs/cmaps/Add-RKSJ-H.bcmap",
  "./vendor/pdfjs/cmaps/Add-RKSJ-V.bcmap",
  "./vendor/pdfjs/cmaps/Add-V.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-CNS1-0.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-CNS1-1.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-CNS1-2.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-CNS1-3.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-CNS1-4.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-CNS1-5.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-CNS1-6.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-CNS1-UCS2.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-GB1-0.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-GB1-1.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-GB1-2.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-GB1-3.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-GB1-4.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-GB1-5.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-GB1-UCS2.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Japan1-0.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Japan1-1.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Japan1-2.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Japan1-3.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Japan1-4.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Japan1-5.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Japan1-6.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Japan1-UCS2.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Korea1-0.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Korea1-1.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Korea1-2.bcmap",
  "./vendor/pdfjs/cmaps/Adobe-Korea1-UCS2.bcmap",
  "./vendor/pdfjs/cmaps/B5-H.bcmap",
  "./vendor/pdfjs/cmaps/B5-V.bcmap",
  "./vendor/pdfjs/cmaps/B5pc-H.bcmap",
  "./vendor/pdfjs/cmaps/B5pc-V.bcmap",
  "./vendor/pdfjs/cmaps/CNS-EUC-H.bcmap",
  "./vendor/pdfjs/cmaps/CNS-EUC-V.bcmap",
  "./vendor/pdfjs/cmaps/CNS1-H.bcmap",
  "./vendor/pdfjs/cmaps/CNS1-V.bcmap",
  "./vendor/pdfjs/cmaps/CNS2-H.bcmap",
  "./vendor/pdfjs/cmaps/CNS2-V.bcmap",
  "./vendor/pdfjs/cmaps/ETHK-B5-H.bcmap",
  "./vendor/pdfjs/cmaps/ETHK-B5-V.bcmap",
  "./vendor/pdfjs/cmaps/ETen-B5-H.bcmap",
  "./vendor/pdfjs/cmaps/ETen-B5-V.bcmap",
  "./vendor/pdfjs/cmaps/ETenms-B5-H.bcmap",
  "./vendor/pdfjs/cmaps/ETenms-B5-V.bcmap",
  "./vendor/pdfjs/cmaps/EUC-H.bcmap",
  "./vendor/pdfjs/cmaps/EUC-V.bcmap",
  "./vendor/pdfjs/cmaps/Ext-H.bcmap",
  "./vendor/pdfjs/cmaps/Ext-RKSJ-H.bcmap",
  "./vendor/pdfjs/cmaps/Ext-RKSJ-V.bcmap",
  "./vendor/pdfjs/cmaps/Ext-V.bcmap",
  "./vendor/pdfjs/cmaps/GB-EUC-H.bcmap",
  "./vendor/pdfjs/cmaps/GB-EUC-V.bcmap",
  "./vendor/pdfjs/cmaps/GB-H.bcmap",
  "./vendor/pdfjs/cmaps/GB-V.bcmap",
  "./vendor/pdfjs/cmaps/GBK-EUC-H.bcmap",
  "./vendor/pdfjs/cmaps/GBK-EUC-V.bcmap",
  "./vendor/pdfjs/cmaps/GBK2K-H.bcmap",
  "./vendor/pdfjs/cmaps/GBK2K-V.bcmap",
  "./vendor/pdfjs/cmaps/GBKp-EUC-H.bcmap",
  "./vendor/pdfjs/cmaps/GBKp-EUC-V.bcmap",
  "./vendor/pdfjs/cmaps/GBT-EUC-H.bcmap",
  "./vendor/pdfjs/cmaps/GBT-EUC-V.bcmap",
  "./vendor/pdfjs/cmaps/GBT-H.bcmap",
  "./vendor/pdfjs/cmaps/GBT-V.bcmap",
  "./vendor/pdfjs/cmaps/GBTpc-EUC-H.bcmap",
  "./vendor/pdfjs/cmaps/GBTpc-EUC-V.bcmap",
  "./vendor/pdfjs/cmaps/GBpc-EUC-H.bcmap",
  "./vendor/pdfjs/cmaps/GBpc-EUC-V.bcmap",
  "./vendor/pdfjs/cmaps/H.bcmap",
  "./vendor/pdfjs/cmaps/HKdla-B5-H.bcmap",
  "./vendor/pdfjs/cmaps/HKdla-B5-V.bcmap",
  "./vendor/pdfjs/cmaps/HKdlb-B5-H.bcmap",
  "./vendor/pdfjs/cmaps/HKdlb-B5-V.bcmap",
  "./vendor/pdfjs/cmaps/HKgccs-B5-H.bcmap",
  "./vendor/pdfjs/cmaps/HKgccs-B5-V.bcmap",
  "./vendor/pdfjs/cmaps/HKm314-B5-H.bcmap",
  "./vendor/pdfjs/cmaps/HKm314-B5-V.bcmap",
  "./vendor/pdfjs/cmaps/HKm471-B5-H.bcmap",
  "./vendor/pdfjs/cmaps/HKm471-B5-V.bcmap",
  "./vendor/pdfjs/cmaps/HKscs-B5-H.bcmap",
  "./vendor/pdfjs/cmaps/HKscs-B5-V.bcmap",
  "./vendor/pdfjs/cmaps/Hankaku.bcmap",
  "./vendor/pdfjs/cmaps/Hiragana.bcmap",
  "./vendor/pdfjs/cmaps/KSC-EUC-H.bcmap",
  "./vendor/pdfjs/cmaps/KSC-EUC-V.bcmap",
  "./vendor/pdfjs/cmaps/KSC-H.bcmap",
  "./vendor/pdfjs/cmaps/KSC-Johab-H.bcmap",
  "./vendor/pdfjs/cmaps/KSC-Johab-V.bcmap",
  "./vendor/pdfjs/cmaps/KSC-V.bcmap",
  "./vendor/pdfjs/cmaps/KSCms-UHC-H.bcmap",
  "./vendor/pdfjs/cmaps/KSCms-UHC-HW-H.bcmap",
  "./vendor/pdfjs/cmaps/KSCms-UHC-HW-V.bcmap",
  "./vendor/pdfjs/cmaps/KSCms-UHC-V.bcmap",
  "./vendor/pdfjs/cmaps/KSCpc-EUC-H.bcmap",
  "./vendor/pdfjs/cmaps/KSCpc-EUC-V.bcmap",
  "./vendor/pdfjs/cmaps/Katakana.bcmap",
  "./vendor/pdfjs/cmaps/NWP-H.bcmap",
  "./vendor/pdfjs/cmaps/NWP-V.bcmap",
  "./vendor/pdfjs/cmaps/RKSJ-H.bcmap",
  "./vendor/pdfjs/cmaps/RKSJ-V.bcmap",
  "./vendor/pdfjs/cmaps/Roman.bcmap",
  "./vendor/pdfjs/cmaps/UniCNS-UCS2-H.bcmap",
  "./vendor/pdfjs/cmaps/UniCNS-UCS2-V.bcmap",
  "./vendor/pdfjs/cmaps/UniCNS-UTF16-H.bcmap",
  "./vendor/pdfjs/cmaps/UniCNS-UTF16-V.bcmap",
  "./vendor/pdfjs/cmaps/UniCNS-UTF32-H.bcmap",
  "./vendor/pdfjs/cmaps/UniCNS-UTF32-V.bcmap",
  "./vendor/pdfjs/cmaps/UniCNS-UTF8-H.bcmap",
  "./vendor/pdfjs/cmaps/UniCNS-UTF8-V.bcmap",
  "./vendor/pdfjs/cmaps/UniGB-UCS2-H.bcmap",
  "./vendor/pdfjs/cmaps/UniGB-UCS2-V.bcmap",
  "./vendor/pdfjs/cmaps/UniGB-UTF16-H.bcmap",
  "./vendor/pdfjs/cmaps/UniGB-UTF16-V.bcmap",
  "./vendor/pdfjs/cmaps/UniGB-UTF32-H.bcmap",
  "./vendor/pdfjs/cmaps/UniGB-UTF32-V.bcmap",
  "./vendor/pdfjs/cmaps/UniGB-UTF8-H.bcmap",
  "./vendor/pdfjs/cmaps/UniGB-UTF8-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS-UCS2-H.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS-UCS2-HW-H.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS-UCS2-HW-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS-UCS2-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS-UTF16-H.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS-UTF16-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS-UTF32-H.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS-UTF32-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS-UTF8-H.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS-UTF8-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS2004-UTF16-H.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS2004-UTF16-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS2004-UTF32-H.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS2004-UTF32-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS2004-UTF8-H.bcmap",
  "./vendor/pdfjs/cmaps/UniJIS2004-UTF8-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJISPro-UCS2-HW-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJISPro-UCS2-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJISPro-UTF8-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJISX0213-UTF32-H.bcmap",
  "./vendor/pdfjs/cmaps/UniJISX0213-UTF32-V.bcmap",
  "./vendor/pdfjs/cmaps/UniJISX02132004-UTF32-H.bcmap",
  "./vendor/pdfjs/cmaps/UniJISX02132004-UTF32-V.bcmap",
  "./vendor/pdfjs/cmaps/UniKS-UCS2-H.bcmap",
  "./vendor/pdfjs/cmaps/UniKS-UCS2-V.bcmap",
  "./vendor/pdfjs/cmaps/UniKS-UTF16-H.bcmap",
  "./vendor/pdfjs/cmaps/UniKS-UTF16-V.bcmap",
  "./vendor/pdfjs/cmaps/UniKS-UTF32-H.bcmap",
  "./vendor/pdfjs/cmaps/UniKS-UTF32-V.bcmap",
  "./vendor/pdfjs/cmaps/UniKS-UTF8-H.bcmap",
  "./vendor/pdfjs/cmaps/UniKS-UTF8-V.bcmap",
  "./vendor/pdfjs/cmaps/V.bcmap",
  "./vendor/pdfjs/cmaps/WP-Symbol.bcmap",
  "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
  "https://fonts.googleapis.com/css2?family=Anton&family=Bangers&family=Inter:wght@400;500;600;700;800&display=swap"
];
const APP_SHELL_URLS = new Set(APP_SHELL.map((url) => new URL(url, self.location.href).href));
const REQUIRED_LOCAL_ASSETS = new Set(
  APP_SHELL.filter((url) => url.startsWith('./')).map((url) => new URL(url, self.location.href).href)
);

async function precacheAppShell(cache) {
  const batchSize = 8;
  for (let i = 0; i < APP_SHELL.length; i += batchSize) {
    const batch = APP_SHELL.slice(i, i + batchSize);
    await Promise.all(batch.map(async (url) => {
      const absolute = new URL(url, self.location.href).href;
      const required = REQUIRED_LOCAL_ASSETS.has(absolute);
      try {
        const local = new URL(url, self.location.href).origin === self.location.origin;
        const response = await fetch(url, {
          mode: local ? 'same-origin' : 'no-cors',
          cache: 'no-store'
        });
        if (required && !response.ok) {
          throw new Error(`Asset local obrigatório indisponível: ${url} (${response.status})`);
        }
        await cache.put(absolute, response);
      } catch (error) {
        if (required) throw error;
        // Fontes e CDN são opcionais no momento da instalação; serão tentadas novamente ao abrir.
      }
    }));
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await precacheAppShell(cache);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request, { cache: 'no-store' });
        const type = response.headers.get('content-type') || '';
        if (response.ok && type.includes('text/html')) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(INDEX_URL, response.clone());
        }
        return response;
      } catch (_) {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(INDEX_URL)) || new Response(
          'Planeta Mangá está indisponível offline. Abra o app novamente quando houver conexão.',
          { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
        );
      }
    })());
    return;
  }

  // Os pedidos ao serviço de autenticação/conteúdo nunca entram no cache do SW.
  if (new URL(request.url).origin === API_ORIGIN) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  // Igualdade exata evita classificar acidentalmente HQs, capas ou chamadas de API como shell.
  if (APP_SHELL_URLS.has(request.url)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request, { cache: 'no-store' });
      if (response.ok || response.type === 'opaque') {
        await cache.put(request, response.clone());
      }
      return response;
    })());
    return;
  }

  // Conteúdo e recursos fora da lista explícita do shell: somente rede, sem persistência pelo SW.
  event.respondWith(fetch(request, { cache: 'no-store' }));
});

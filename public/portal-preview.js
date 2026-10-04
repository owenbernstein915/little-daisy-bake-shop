(function () {
  if (window.parent === window || new URLSearchParams(window.location.search).get('portalEditor') !== '1') return;

  var siteId = 'little-daisy';
  var parentOrigin = null;
  var observer = null;

  function isPortalOrigin(origin) {
    try {
      var url = new URL(origin);
      return url.protocol === 'https:' && !url.port && (
        url.hostname === 'owenbclientdashboard.netlify.app' ||
        /^(?:deploy-preview-\d+|[a-z0-9-]+)--owenbclientdashboard\.netlify\.app$/.test(url.hostname)
      );
    } catch (_) { return false; }
  }

  function addStyles() {
    if (document.getElementById('owen-portal-preview-style')) return;
    var style = document.createElement('style');
    style.id = 'owen-portal-preview-style';
    style.textContent = [
      '.owen-portal-editable{position:relative!important}',
      '.portal-edit-pencil{position:absolute!important;z-index:2147483000!important;top:12px!important;right:12px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;min-width:44px!important;min-height:44px!important;padding:0 12px!important;border:1px solid #175fd0!important;border-radius:999px!important;background:#fff!important;color:#10293b!important;box-shadow:0 3px 12px #10293b30!important;font:600 12px/1 system-ui,sans-serif!important;letter-spacing:0!important;text-transform:none!important;cursor:pointer!important}',
      '.portal-edit-pencil svg{width:17px!important;height:17px!important;display:block!important}',
      '.portal-edit-pencil:hover,.portal-edit-pencil:focus-visible{background:#e9f2ff!important;outline:3px solid #71aaff!important;outline-offset:2px!important}',
      '.site-header>.portal-edit-pencil{top:50%!important;right:150px!important;transform:translateY(-50%)!important}',
      '@media(max-width:700px){.portal-edit-pencil{top:8px!important;right:8px!important;min-width:44px!important;min-height:44px!important}.site-header>.portal-edit-pencil{top:auto!important;right:9px!important;bottom:-48px!important;transform:none!important}}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function pencilFor(section) {
    var button = document.createElement('button');
    var label = section.getAttribute('data-portal-edit-label') || 'this section';
    button.type = 'button';
    button.className = 'portal-edit-pencil';
    button.setAttribute('data-portal-edit-button', '');
    button.setAttribute('aria-label', 'Edit ' + label);
    button.title = 'Edit ' + label;
    button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg><span>Edit</span>';
    button.addEventListener('click', function (event) {
      event.preventDefault(); event.stopPropagation();
      if (!parentOrigin) return;
      try {
        window.parent.postMessage({ type: 'owen-portal:edit', siteId: siteId, path: JSON.parse(section.getAttribute('data-portal-edit-path')) }, parentOrigin);
      } catch (_) { /* Ignore malformed edit markers. */ }
    });
    return button;
  }

  function addPencils() {
    document.querySelectorAll('[data-portal-edit-path]').forEach(function (section) {
      if (section.querySelector(':scope > [data-portal-edit-button]')) return;
      section.classList.add('owen-portal-editable');
      section.appendChild(pencilFor(section));
    });
  }

  function activate(origin) {
    parentOrigin = origin;
    document.documentElement.classList.add('owen-portal-preview-mode');
    addStyles(); addPencils();
    if (!observer && document.body) {
      observer = new MutationObserver(addPencils);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-portal-edit-button]')) return;
    var link = event.target.closest('a[href]');
    if (!link) return;
    var destination;
    try { destination = new URL(link.href, window.location.href); } catch (_) { return; }
    if (destination.origin !== window.location.origin) {
      event.preventDefault(); event.stopImmediatePropagation(); return;
    }
    destination.searchParams.set('portalEditor', '1');
    link.href = destination.href;
  }, true);
  document.addEventListener('submit', function (event) { event.preventDefault(); event.stopImmediatePropagation(); }, true);

  window.addEventListener('message', function (event) {
    if (event.source !== window.parent || !isPortalOrigin(event.origin)) return;
    var message = event.data;
    if (!message || message.siteId !== siteId) return;
    if (message.type === 'owen-portal:init') {
      activate(event.origin);
      window.__OWEN_PORTAL_PREVIEW__?.apply(message);
    } else if (message.type === 'owen-portal:update' && parentOrigin === event.origin) {
      window.__OWEN_PORTAL_PREVIEW__?.apply(message);
    }
  });

  window.parent.postMessage({ type: 'owen-portal:ready', siteId: siteId }, '*');
})();

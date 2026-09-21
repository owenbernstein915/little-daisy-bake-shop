(function () {
  var dataNode = document.getElementById('cms-data');
  if (!dataNode) return;

  var data;
  try {
    data = JSON.parse(dataNode.textContent);
  } catch (error) {
    console.error('Unable to load website content.', error);
    return;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node && value != null) node.textContent = value;
  }

  function setLink(selector, value) {
    document.querySelectorAll(selector).forEach(function (node) {
      if (value) node.setAttribute('href', value);
    });
  }

  function imageMarkup(item, loading) {
    return '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.alt) + '" loading="' + loading + '">';
  }

  document.title = data.site.seo_title;
  var description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', data.site.seo_description);

  var brandLogo = document.querySelector('.brand-logo');
  if (brandLogo) {
    brandLogo.src = data.site.logo;
    brandLogo.alt = data.site.logo_alt;
  }
  var brandCopy = document.querySelector('.brand > span');
  if (brandCopy) {
    brandCopy.innerHTML = escapeHtml(data.site.name) + '<small>' + escapeHtml(data.site.brand_subtitle) + '</small>';
  }
  setText('.hours-chip', data.site.hours_chip);
  setLink('[data-cms-link="order"]', data.site.order_url);
  setLink('[data-cms-link="instagram"]', data.site.instagram_url);
  setLink('[data-cms-link="facebook"]', data.site.facebook_url);
  setLink('[data-cms-link="maps"]', data.site.google_maps_url);
  setLink('[data-cms-link="phone"]', data.site.phone_link);

  setText('.hero .eyebrow', data.hero.eyebrow);
  var heroTitle = document.querySelector('.hero h1');
  if (heroTitle) heroTitle.innerHTML = escapeHtml(data.hero.title) + ' <em>' + escapeHtml(data.hero.title_emphasis) + '</em>';
  setText('.hero-description', data.hero.description);
  setText('.hero-ctas .btn-primary', data.hero.primary_button);
  setText('.hero-ctas .btn-outline', data.hero.secondary_button);
  var heroBadges = document.querySelector('.hero-badges');
  if (heroBadges) {
    heroBadges.innerHTML = data.hero.badges.map(function (badge) {
      return '<span class="badge"><span class="dot"></span>' + escapeHtml(badge) + '</span>';
    }).join('');
  }
  var heroCollage = document.querySelector('.hero-collage');
  if (heroCollage) heroCollage.innerHTML = data.hero.images.map(function (item) { return imageMarkup(item, 'eager'); }).join('');

  var marquee = document.querySelector('.marquee-track');
  if (marquee) {
    var marqueeLine = '<span><span class="flower">✿</span>' + data.marquee.map(escapeHtml).join('<span class="flower">✿</span>') + '</span>';
    marquee.innerHTML = marqueeLine + marqueeLine;
  }

  setText('#case .section-head .eyebrow', data.counter.eyebrow);
  setText('#case .section-head .h2', data.counter.title);
  setText('#case .section-head .lede', data.counter.description);
  var counterTrack = document.getElementById('case-track');
  if (counterTrack) {
    counterTrack.innerHTML = data.counter.items.map(function (item) {
      var noteLink = item.link_url && item.link_label
        ? ' <a href="' + escapeHtml(item.link_url) + '" style="text-decoration:underline;">' + escapeHtml(item.link_label) + '</a>'
        : '';
      return '<article class="case-card"><figure>' + imageMarkup(item, 'lazy') + '</figure><div class="case-tag ticket"><span class="name">' + escapeHtml(item.name) + '</span><span class="note">' + escapeHtml(item.note) + noteLink + '</span><span class="price">' + escapeHtml(item.price) + '</span></div></article>';
    }).join('');
  }

  setText('.trust .eyebrow', data.kitchen.eyebrow);
  setText('.trust .h2', data.kitchen.title);
  setText('.trust .lede', data.kitchen.description);
  setText('.trust-actions .btn-primary', data.kitchen.call_button);
  setText('.trust-actions .btn-outline', data.kitchen.owner_button);
  var trustFacts = document.querySelector('.trust-facts');
  if (trustFacts) {
    var daisy = '<svg class="daisy-mark" viewBox="0 0 40 40" aria-hidden="true"><g fill="currentColor"><ellipse cx="20" cy="9" rx="4.2" ry="8.5"/><ellipse cx="20" cy="9" rx="4.2" ry="8.5" transform="rotate(72 20 20)"/><ellipse cx="20" cy="9" rx="4.2" ry="8.5" transform="rotate(144 20 20)"/><ellipse cx="20" cy="9" rx="4.2" ry="8.5" transform="rotate(216 20 20)"/><ellipse cx="20" cy="9" rx="4.2" ry="8.5" transform="rotate(288 20 20)"/></g><circle cx="20" cy="20" r="5.5" fill="#F5B324"/></svg>';
    trustFacts.innerHTML = data.kitchen.facts.map(function (fact) {
      return '<div class="trust-fact">' + daisy + '<div><strong>' + escapeHtml(fact.title) + '</strong><span>' + escapeHtml(fact.description) + '</span></div></div>';
    }).join('');
  }

  setText('#cakes .section-head .eyebrow', data.cakes.eyebrow);
  setText('#cakes .section-head .h2', data.cakes.title);
  setText('#cakes .section-head .lede', data.cakes.description);
  var cakeGrid = document.querySelector('.cake-grid');
  if (cakeGrid) {
    cakeGrid.innerHTML = data.cakes.items.map(function (item) {
      return '<div class="cake-card"><figure>' + imageMarkup(item, 'lazy') + '</figure><div class="cake-body"><h3>' + escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.description) + '</p><div class="cake-price"><span>' + escapeHtml(item.size) + '</span><span>' + escapeHtml(item.price) + '</span></div></div></div>';
    }).join('');
  }
  setText('.order-note p', data.cakes.order_note);
  setText('.order-note .btn', data.cakes.order_button);

  setText('#reviews .section-head .eyebrow', data.reviews.eyebrow);
  setText('#reviews .section-head .h2', data.reviews.title);
  setText('#reviews .section-head .lede', data.reviews.description);
  setText('.review-count', data.reviews.link_label);
  var reviewGrid = document.querySelector('.review-grid');
  if (reviewGrid) {
    reviewGrid.innerHTML = data.reviews.items.map(function (item) {
      return '<article class="review-card"><blockquote><span class="review-stars" aria-label="5 out of 5 stars">★★★★★</span><p>“' + escapeHtml(item.quote) + '”</p></blockquote><footer><span class="review-avatar" aria-hidden="true">' + escapeHtml(item.initial) + '</span><span><strong>' + escapeHtml(item.name) + '</strong><span class="review-source">GOOGLE REVIEW</span></span></footer></article>';
    }).join('');
  }

  setText('#gallery .section-head .eyebrow', data.gallery.eyebrow);
  setText('#gallery .section-head .h2', data.gallery.title);
  setText('#gallery .section-head .lede', data.gallery.description);
  var galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) {
    galleryGrid.innerHTML = data.gallery.images.map(function (item) {
      var modifier = item.layout === 'wide' ? ' gallery-card--wide' : item.layout === 'tall' ? ' gallery-card--tall' : '';
      return '<figure class="gallery-card' + modifier + '">' + imageMarkup(item, 'lazy') + '</figure>';
    }).join('');
  }

  var ownerImage = document.querySelector('.about-photo img');
  if (ownerImage) {
    ownerImage.src = data.owner.image;
    ownerImage.alt = data.owner.image_alt;
  }
  setText('.about-copy .eyebrow', data.owner.eyebrow);
  setText('.about-copy .h2', data.owner.name);
  var ownerParagraphs = document.querySelectorAll('.about-copy > p');
  ownerParagraphs.forEach(function (node, index) {
    if (data.owner.paragraphs[index] != null) node.textContent = data.owner.paragraphs[index];
    else node.remove();
  });
  setText('.about-signature .line', data.owner.signature);
  setText('.about-signature small', data.owner.role);

  setText('#visit .section-head .eyebrow', data.visit.eyebrow);
  setText('#visit .section-head .h2', data.visit.title);
  var visitRows = document.querySelectorAll('.visit-row');
  if (visitRows[0]) {
    setText('.visit-row:nth-child(1) strong', data.visit.address_line_1);
    setText('.visit-row:nth-child(1) span', data.visit.address_line_2);
  }
  if (visitRows[1]) setText('.visit-row:nth-child(2) a', data.site.phone_display);
  var hoursTable = document.querySelector('.visit-hours-table');
  if (hoursTable) {
    hoursTable.innerHTML = data.visit.hours.map(function (item) {
      return '<tr><td>' + escapeHtml(item.days) + '</td><td>' + escapeHtml(item.time) + '</td></tr>';
    }).join('');
  }
  setText('.map-cta', data.visit.directions_button);

  setText('.follow-head .eyebrow', data.social.eyebrow);
  setText('.follow-head .h2', data.social.handle);
  setText('.follow-cta .btn', data.social.button);
  var followGrid = document.querySelector('.follow-grid');
  if (followGrid) {
    followGrid.innerHTML = data.social.images.map(function (item) {
      return '<a href="' + escapeHtml(data.site.instagram_url) + '" target="_blank" rel="noopener">' + imageMarkup(item, 'lazy') + '</a>';
    }).join('');
  }

  setText('.footer-brand-name', data.site.name);
  setText('.footer-tag', data.footer.tagline);
  var footerBottom = document.querySelectorAll('.footer-bottom span');
  if (footerBottom[0]) footerBottom[0].textContent = data.footer.bottom_line;
  if (footerBottom[1]) footerBottom[1].textContent = data.footer.credit;
})();

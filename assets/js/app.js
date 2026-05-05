/* =========================================================
   Guía 14-A · interacciones del cliente
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Toast ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1900);
  }

  /* ---------- Copiar Wi-Fi ---------- */
  function copyWifi() {
    const pass = document.getElementById('wifi-pass')?.textContent?.trim() || '';
    if (!pass) return;
    navigator.clipboard?.writeText(pass).then(
      () => showToast(getI18n('toast.wifi') || '✓ Contraseña copiada'),
      () => showToast('No se pudo copiar')
    );
  }

  document.querySelectorAll('[data-action="copy-wifi"]').forEach(b => {
    b.addEventListener('click', () => {
      const wifiCard = document.getElementById('wifi');
      if (wifiCard) wifiCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(copyWifi, 280);
    });
  });

  document.querySelectorAll('[data-action="copy-wifi-pass"]').forEach(b => {
    b.addEventListener('click', copyWifi);
  });

  /* ---------- Copiar código de descuento ---------- */
  document.querySelectorAll('[data-action="copy-code"]').forEach(el => {
    el.addEventListener('click', () => {
      const code = document.getElementById('promo-code')?.textContent?.trim() || '';
      if (!code) return;
      navigator.clipboard?.writeText(code).then(
        () => showToast(getI18n('toast.code') || '✓ Código copiado'),
        () => showToast('No se pudo copiar')
      );
    });
  });

  /* ---------- Bottom nav: marcar sección activa ---------- */
  const navLinks = document.querySelectorAll('.bottom-nav a');
  const sections = ['inicio', 'estancia', 'experiencias', 'comer', 'ver', 'contacto']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach(a => a.classList.toggle('is-active', a.dataset.target === id));
  };

  let suppressUntil = 0;

  if (sections.length) {
    /* Selecciona la sección que contiene la franja del 30% del viewport.
       Si ninguna la contiene, usa la última cuyo top esté por encima. */
    const updateActive = () => {
      if (Date.now() < suppressUntil) return;
      const probe = window.innerHeight * 0.30;
      let containing = null;
      let lastAbove = sections[0];
      for (const s of sections) {
        const rect = s.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom > probe) containing = s;
        if (rect.top <= probe) lastAbove = s;
      }
      const current = containing || lastAbove;
      if (current) setActive(current.id);
    };
    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    /* El iframe de Civitatis se redimensiona después de cargar — recalculamos */
    document.querySelectorAll('.civitatis-iframe').forEach(f => {
      f.addEventListener('load', () => setTimeout(updateActive, 200));
    });
  }

  /* Resaltado inmediato al tocar un ítem del dock — y bloquear que el
     scroll-handler lo quite durante el smooth-scroll */
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      const id = a.dataset.target;
      if (!id) return;
      setActive(id);
      suppressUntil = Date.now() + 900;
    });
  });

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.section, .card, .place, .move, .rules li'
    );
    const revealer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach(el => revealer.observe(el));
  } else {
    document.querySelectorAll('.section, .card, .place, .move, .rules li')
      .forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- i18n (ES / EN) ---------- */
  const I18N = {
    es: {
      'toast.wifi': '✓ Contraseña copiada al portapapeles',
      'toast.code': '✓ Código copiado al portapapeles',
      'hero.guide': 'Guía',
      'quick.wifi': 'Wi-Fi',
      'quick.promo': '−10% reserva',
      'quick.map': 'Cómo llegar',
      'stay.kicker': 'Tu estancia',
      'stay.title': 'Lo esencial',
      'stay.checkin.title': 'Entrada',
      'stay.checkin.small': 'A partir de las tres de la tarde',
      'stay.checkout.title': 'Salida',
      'stay.checkout.small': 'Antes de las once de la mañana',
      'stay.wifi.network': 'Red',
      'stay.wifi.pass': 'Contraseña',
      'stay.wifi.copy': 'Copiar contraseña',
      'stay.locker.title': 'Servicio de consigna',
      'stay.locker.small': '3,50 € por pieza en <strong>Artesanías Medina</strong>, Calle Reyes Católicos 54. Abierto todos los días de 10:00 a 21:00.',
      'stay.locker.cta': 'Ver en mapa',
      'rules.kicker': 'Para una estancia perfecta',
      'rules.title': 'Normas de la casa',
      'rules.lead': 'Estas pequeñas reglas hacen que todo el mundo disfrute por igual.',
      'rules.r2.t': 'Sin fiestas.',
      'rules.r2.d': 'Nada de celebraciones ni reuniones ruidosas.',
      'rules.r3.t': 'Silencio nocturno.',
      'rules.r3.d': 'De 00:00 a 08:00 respetamos a los vecinos.',
      'rules.r4.t': 'No se fuma.',
      'rules.r4.d': 'Ni dentro del apartamento ni en zonas comunes.',
      'rules.r5.t': 'Ocupación.',
      'rules.r5.d': 'Solo el número de personas indicado en la reserva.',
      'rules.r7.t': 'Uso responsable.',
      'rules.r7.d': 'Aire, calefacción, agua y luz con cabeza.',
      'rules.note': 'Importante: el incumplimiento puede dar lugar a cargos adicionales.',
      'house.kicker': 'La casa',
      'house.title': 'Cómo funciona todo',
      'house.sofa.t': 'Sofá cama, microondas y vitrocerámica',
      'house.sofa.d': 'Encontrarás QRs escaneables a lo largo del apartamento que te enseñan cómo usar el sofá cama, el microondas y la vitrocerámica. Búscalos junto a cada electrodoméstico.',
      'house.water.t': 'Agua caliente',
      'house.water.d': 'El agua caliente va por termo. Una vez se agota, debe pasar un tiempo para volver a calentarse. Te recomendamos duchas cortas, sobre todo si os ducháis varias personas seguidas.',
      'house.ac.t': 'Aire acondicionado (frío y calor)',
      'house.ac.d': 'Los aires tienen función de frío y calor. Selecciona en el mando el modo deseado (por ejemplo «heat» para calor) y espera a que se active. El modo calor puede tardar un poco al cambiar de modo.',
      'exp.kicker': 'Vive Granada',
      'exp.title': 'Experiencias',
      'exp.lead': 'Tours, visitas guiadas y actividades seleccionadas para disfrutar la ciudad.',
      'eat.kicker': 'Granada se vive comiendo',
      'eat.title': 'Dónde comer y tapear',
      'eat.sweet': 'Para algo dulce',
      'eat.tapas': 'Para tapear',
      'eat.views': 'Restaurantes con vistas a la Alhambra',
      'eat.4gatos': 'Desayunos tranquilos, tostadas y bollería artesanal en un entorno muy agradable.',
      'eat.finca': 'Café de especialidad y repostería cuidada, muy cerca del apartamento.',
      'eat.minuit': 'Cafetería muy acogedora, perfecta para desayunos y meriendas tranquilas.',
      'eat.gerardo': 'Tradicional, con desayunos clásicos y ambiente granadino auténtico.',
      'eat.trastienda': 'Tapas tradicionales, embutidos y vinos en la Plaza de Cuchilleros.',
      'eat.castaneda': 'Imprescindible del tapeo granadino, ambiente muy local.',
      'eat.diamantes': 'En Plaza Nueva, especialidad en pescado frito y marisco.',
      'eat.manueles': 'Tapas clásicas y raciones abundantes.',
      'eat.morayma': 'Cocina andaluza tradicional con una de las mejores vistas a la Alhambra.',
      'eat.aben': 'Restaurante romántico con terraza y vistas espectaculares.',
      'eat.sabika': 'Experiencia gastronómica con vistas directas al monumento.',
      'eat.maria': 'Cocina local en el Albaicín con vistas privilegiadas.',
      'cta.map': 'Ver en mapa →',
      'see.kicker': 'Imprescindible',
      'see.title': 'Lugares que no te puedes perder',
      'see.souvenirs': 'Souvenirs',
      'see.souvenirs.badge': '−10 %',
      'see.souvenirs.intro': 'Tienes un <strong>10 % de descuento</strong> en nuestras tiendas Artesanías Medina. Presenta esta guía al pagar.',
      'see.medina.rc': 'Calle Reyes Católicos 54. La misma tienda donde también puedes dejar el equipaje.',
      'see.medina.br1': 'Plaza Bib-Rambla. La tienda más grande, con todo el surtido.',
      'see.medina.br2': 'Segunda tienda en la misma plaza, con piezas seleccionadas.',
      'see.monuments': 'Monumentos y patrimonio',
      'see.viewpoints': 'Miradores y rincones con vistas',
      'see.museums': 'Museos y cultura',
      'see.unesco': 'Patrimonio de la Humanidad',
      'see.alhambra': 'El palacio y los jardines nazaríes. Reserva con tiempo, las entradas vuelan.',
      'see.albaicin': 'Barrio histórico con callejuelas empedradas, miradores y casas tradicionales.',
      'see.catedral': 'Impresionante catedral renacentista en pleno centro histórico.',
      'see.capilla': 'Donde descansan los Reyes Católicos, justo al lado de la catedral.',
      'see.sacromonte': 'Famoso por sus cuevas y sus espectáculos de flamenco.',
      'see.sannicolas': 'Las mejores vistas de la Alhambra con la Sierra Nevada de fondo.',
      'see.sancristobal': 'Otro punto panorámico del Albaicín, menos concurrido.',
      'see.tristes': 'Paseo precioso junto al río Darro con vistas a la Alhambra. Está cerquita del apartamento.',
      'see.carvajales': 'Vistas panorámicas desde un ángulo distinto y muy fotogénico.',
      'see.tiros': 'Arte y cultura granadina en un edificio histórico.',
      'see.ciencias': 'Museo interactivo ideal para toda la familia.',
      'see.bellas': 'Ubicado en el Palacio de Carlos V, dentro de la Alhambra.',
      'move.kicker': 'A tu ritmo',
      'move.title': 'Cómo moverte por Granada',
      'move.walk.t': 'A pie',
      'move.walk.d': 'El apartamento está en pleno centro histórico. La Catedral, la Capilla Real, la Plaza Nueva y el Albaicín están a pocos minutos andando. Calzado cómodo: Granada tiene cuestas y empedrado.',
      'move.bus.t': 'Autobús urbano',
      'move.bus.d': '<p class="move__lead">Las líneas turísticas C suben al Albaicín, Sacromonte y la Alhambra — perfectas para evitar las cuestas.</p><ul class="bus-lines"><li><span class="bus-chip">C30</span><span class="bus-route">Plaza Isabel la Católica ↔ Alhambra</span><span class="bus-freq">~12 min</span></li><li><span class="bus-chip">C31</span><span class="bus-route">Plaza Nueva ↔ Albaicín (Mirador de San Nicolás)</span><span class="bus-freq">~12 min</span></li><li><span class="bus-chip">C32</span><span class="bus-route">Alhambra ↔ Albaicín, sin pasar por el centro</span><span class="bus-freq">~10 min</span></li><li><span class="bus-chip">C34</span><span class="bus-route">Plaza Nueva ↔ Sacromonte y Albaicín bajo</span><span class="bus-freq">~20 min</span></li></ul><p class="move__foot"><strong>1,60 €</strong> al conductor (efectivo o tarjeta) · 07:00–23:00 aprox.</p>',
      'move.taxi.t': 'Taxi',
      'move.taxi.d': 'Hay paradas cerca, en Reyes Católicos y Plaza Nueva. Para pedirlo:',
      'move.car.t': 'En coche',
      'move.car.d': '<p class="move__lead">Por favor, consulta nuestra guía para acceder en coche hasta tu apartamento.</p><a class="move__cta" href="https://docs.google.com/document/d/1WIaZ-JhH2RYIeVjacKRR0F-NOTMo5k9arXoXegqyKNU/edit?usp=sharing" target="_blank" rel="noopener"><span>Guía de acceso y aparcamiento</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>',
      'move.transit.t': 'Estaciones y aeropuerto',
      'move.transit.bus': 'Estación de autobuses',
      'move.transit.train': 'Estación de tren',
      'move.transit.airport': 'Aeropuerto FGR',
      'move.transit.airport.d': 'bus urbano hasta Gran Vía o taxi (~25 min al centro).',
      'move.luggage.t': '¿Necesitas dejar el equipaje?',
      'move.luggage.hours': 'Abierto todos los días de 10:00 a 21:00.',
      'move.luggage.price': '3,5 € por maleta, sea del tamaño que sea.',
      'contact.kicker': 'Estamos aquí para ti',
      'contact.title': 'Contactos importantes',
      'contact.host': 'Tu anfitrión, 24h',
      'contact.emergency': 'Emergencias',
      'contact.transport': 'Transporte',
      'contact.112': 'Emergencias 112',
      'contact.local': 'Policía Local',
      'contact.national': 'Policía Nacional',
      'contact.fire': 'Bomberos',
      'contact.health': 'Urgencias Hospital',
      'contact.bus': 'Estación de Autobuses',
      'contact.train': 'Estación de Tren',
      'promo.kicker': 'Descuento para tu próxima visita',
      'promo.note': 'Usa el código <strong id="promo-code">ARC10</strong> en tu próxima reserva',
      'footer.quote': '«Dale limosna, mujer, que no hay en la vida nada como la pena de ser ciego en Granada.»',
      'footer.quoteAuthor': '— Francisco A. de Icaza',
      'footer.sign': 'Apartamentos Reyes Católicos · Plaza de Cuchilleros · Granada',
      'footer.bye': '¡Esperamos que tu estancia sea inolvidable!',
      'nav.home': 'Inicio',
      'nav.stay': 'Casa',
      'nav.exp': 'Vivir',
      'nav.eat': 'Comer',
      'nav.see': 'Ver',
      'nav.contact': 'Contacto'
    },
    en: {
      'toast.wifi': '✓ Password copied to clipboard',
      'toast.code': '✓ Code copied to clipboard',
      'hero.guide': 'Guide',
      'quick.wifi': 'Wi-Fi',
      'quick.promo': '−10% booking',
      'quick.map': 'Get there',
      'stay.kicker': 'Your stay',
      'stay.title': 'The essentials',
      'stay.checkin.title': 'Check-in',
      'stay.checkin.small': 'From three in the afternoon',
      'stay.checkout.title': 'Check-out',
      'stay.checkout.small': 'Before eleven in the morning',
      'stay.wifi.network': 'Network',
      'stay.wifi.pass': 'Password',
      'stay.wifi.copy': 'Copy password',
      'stay.locker.title': 'Luggage storage',
      'stay.locker.small': '€3.50 per piece at <strong>Artesanías Medina</strong>, Calle Reyes Católicos 54. Open every day 10:00–21:00.',
      'stay.locker.cta': 'Open in map',
      'rules.kicker': 'For a perfect stay',
      'rules.title': 'House rules',
      'rules.lead': 'These small rules make sure everyone enjoys their stay equally.',
      'rules.r2.t': 'No parties.',
      'rules.r2.d': 'No celebrations or noisy gatherings.',
      'rules.r3.t': 'Quiet hours.',
      'rules.r3.d': 'From 00:00 to 08:00, please respect the neighbours.',
      'rules.r4.t': 'No smoking.',
      'rules.r4.d': 'Neither inside the apartment nor in common areas.',
      'rules.r5.t': 'Occupancy.',
      'rules.r5.d': 'Only the number of guests stated in the booking.',
      'rules.r7.t': 'Use things wisely.',
      'rules.r7.d': 'AC, heating, water and electricity — please be sensible.',
      'rules.note': 'Important: failing to follow these rules may result in additional charges.',
      'house.kicker': 'The home',
      'house.title': 'How everything works',
      'house.sofa.t': 'Sofa bed, microwave and stovetop',
      'house.sofa.d': 'You\'ll find scannable QR codes around the apartment showing how to use the sofa bed, the microwave and the ceramic hob. Look for them next to each appliance.',
      'house.water.t': 'Hot water',
      'house.water.d': 'Hot water runs through a tank. Once it runs out, it needs time to heat up again. We recommend short showers, especially if several people are showering one after another.',
      'house.ac.t': 'Air conditioning (cooling and heating)',
      'house.ac.d': 'The AC units have both cooling and heating modes. Select the desired mode on the remote (for example «heat») and wait for it to start. Heating mode can take a moment to kick in after switching.',
      'exp.kicker': 'Live Granada',
      'exp.title': 'Experiences',
      'exp.lead': 'Tours, guided visits and curated activities to enjoy the city.',
      'eat.kicker': 'Granada lives through its food',
      'eat.title': 'Where to eat and have tapas',
      'eat.sweet': 'For something sweet',
      'eat.tapas': 'For tapas',
      'eat.views': 'Restaurants with views of the Alhambra',
      'eat.4gatos': 'Relaxed breakfasts, toast and homemade pastries in a lovely setting.',
      'eat.finca': 'Specialty coffee and carefully crafted pastries, very close to the apartment.',
      'eat.minuit': 'A very cosy café, perfect for quiet breakfasts and afternoon snacks.',
      'eat.gerardo': 'Traditional, with classic breakfasts and an authentic Granada vibe.',
      'eat.trastienda': 'Traditional tapas, cured meats and wine on Plaza de Cuchilleros.',
      'eat.castaneda': 'A must of Granada tapas, with a very local atmosphere.',
      'eat.diamantes': 'On Plaza Nueva — specialised in fried fish and seafood.',
      'eat.manueles': 'Classic tapas and generous portions.',
      'eat.morayma': 'Traditional Andalusian cuisine with one of the best views of the Alhambra.',
      'eat.aben': 'Romantic restaurant with a terrace and stunning views.',
      'eat.sabika': 'A gastronomic experience with direct views of the monument.',
      'eat.maria': 'Local cuisine in the Albaicín with privileged views.',
      'cta.map': 'Open in map →',
      'see.kicker': 'Must-see',
      'see.title': 'Places you can\'t miss',
      'see.souvenirs': 'Souvenirs',
      'see.souvenirs.badge': '−10%',
      'see.souvenirs.intro': 'Enjoy <strong>10% off</strong> at our Artesanías Medina stores. Just show this guide when you pay.',
      'see.medina.rc': 'Calle Reyes Católicos 54. The same shop where you can leave your luggage.',
      'see.medina.br1': 'Plaza Bib-Rambla. The largest shop, with the full range.',
      'see.medina.br2': 'Second shop on the same square, with selected pieces.',
      'see.monuments': 'Monuments and heritage',
      'see.viewpoints': 'Viewpoints and scenic spots',
      'see.museums': 'Museums and culture',
      'see.unesco': 'UNESCO World Heritage',
      'see.alhambra': 'The Nasrid palace and gardens. Book ahead — tickets sell out fast.',
      'see.albaicin': 'Historic neighbourhood with cobbled lanes, viewpoints and traditional houses.',
      'see.catedral': 'Impressive Renaissance cathedral right in the historic centre.',
      'see.capilla': 'Resting place of the Catholic Monarchs, right next to the cathedral.',
      'see.sacromonte': 'Famous for its caves and flamenco shows.',
      'see.sannicolas': 'The best views of the Alhambra with the Sierra Nevada behind.',
      'see.sancristobal': 'Another panoramic spot in the Albaicín, less crowded.',
      'see.tristes': 'A lovely walk along the river Darro with views of the Alhambra. Right by the apartment.',
      'see.carvajales': 'Panoramic views from a different, very photogenic angle.',
      'see.tiros': 'Granada art and culture in a historic building.',
      'see.ciencias': 'Interactive museum, perfect for the whole family.',
      'see.bellas': 'Located in the Palace of Charles V, inside the Alhambra.',
      'move.kicker': 'At your own pace',
      'move.title': 'Getting around Granada',
      'move.walk.t': 'On foot',
      'move.walk.d': 'The apartment is right in the historic centre. The Cathedral, the Royal Chapel, Plaza Nueva and the Albaicín are just a few minutes away on foot. Wear comfy shoes — Granada has slopes and cobblestones.',
      'move.bus.t': 'City bus',
      'move.bus.d': '<p class="move__lead">The tourist C lines climb up to the Albaicín, Sacromonte and the Alhambra — great to skip the slopes.</p><ul class="bus-lines"><li><span class="bus-chip">C30</span><span class="bus-route">Plaza Isabel la Católica ↔ Alhambra</span><span class="bus-freq">~12 min</span></li><li><span class="bus-chip">C31</span><span class="bus-route">Plaza Nueva ↔ Albaicín (Mirador de San Nicolás)</span><span class="bus-freq">~12 min</span></li><li><span class="bus-chip">C32</span><span class="bus-route">Alhambra ↔ Albaicín, bypassing the centre</span><span class="bus-freq">~10 min</span></li><li><span class="bus-chip">C34</span><span class="bus-route">Plaza Nueva ↔ Sacromonte and lower Albaicín</span><span class="bus-freq">~20 min</span></li></ul><p class="move__foot"><strong>€1.60</strong> on board (cash or card) · approx. 07:00–23:00.</p>',
      'move.taxi.t': 'Taxi',
      'move.taxi.d': 'There are taxi ranks nearby on Reyes Católicos and Plaza Nueva. To order one:',
      'move.car.t': 'By car',
      'move.car.d': '<p class="move__lead">Please check our guide to drive to your apartment.</p><a class="move__cta" href="https://docs.google.com/document/d/1EUm2fdiSxdZnFCLXpA0ZX9ppWVYmubLQv0Rh5sp5Fu8/edit?usp=sharing" target="_blank" rel="noopener"><span>Driving & parking guide</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>',
      'move.transit.t': 'Stations and airport',
      'move.transit.bus': 'Bus station',
      'move.transit.train': 'Train station',
      'move.transit.airport': 'FGR Airport',
      'move.transit.airport.d': 'city bus to Gran Vía or a taxi (~25 min to the centre).',
      'move.luggage.t': 'Need to leave your luggage?',
      'move.luggage.hours': 'Open every day from 10:00 to 21:00.',
      'move.luggage.price': '€3.50 per suitcase, any size.',
      'contact.kicker': 'We\'re here for you',
      'contact.title': 'Important contacts',
      'contact.host': 'Your host, 24h',
      'contact.emergency': 'Emergencies',
      'contact.transport': 'Transport',
      'contact.112': 'Emergency 112',
      'contact.local': 'Local Police',
      'contact.national': 'National Police',
      'contact.fire': 'Fire Brigade',
      'contact.health': 'Hospital A&E',
      'contact.bus': 'Bus Station',
      'contact.train': 'Train Station',
      'promo.kicker': 'Discount for your next visit',
      'promo.note': 'Use the code <strong id="promo-code">ARC10</strong> on your next booking',
      'footer.quote': '«Give him alms, woman, for there is nothing in life like the sorrow of being blind in Granada.»',
      'footer.quoteAuthor': '— Francisco A. de Icaza',
      'footer.sign': 'Apartamentos Reyes Católicos · Plaza de Cuchilleros · Granada',
      'footer.bye': 'We hope your stay is unforgettable!',
      'nav.home': 'Home',
      'nav.stay': 'Home',
      'nav.exp': 'Live',
      'nav.eat': 'Eat',
      'nav.see': 'See',
      'nav.contact': 'Contact'
    }
  };

  let currentLang = 'es';
  function getI18n(key) { return I18N[currentLang]?.[key]; }

  function applyLang(lang) {
    if (!I18N[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = I18N[lang][key];
      if (value !== undefined) el.innerHTML = value;
    });

    document.querySelectorAll('[data-lang]').forEach(b => {
      const isActive = b.dataset.lang === lang;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });

    try { localStorage.setItem('guia14a.lang', lang); } catch (_) {}
  }

  document.querySelectorAll('[data-lang]').forEach(b => {
    b.addEventListener('click', () => applyLang(b.dataset.lang));
  });

  // Idioma inicial: localStorage > navegador > es
  let savedLang = null;
  try { savedLang = localStorage.getItem('guia14a.lang'); } catch (_) {}
  const browserLang = (navigator.language || 'es').slice(0, 2);
  applyLang(savedLang || (I18N[browserLang] ? browserLang : 'es'));
})();

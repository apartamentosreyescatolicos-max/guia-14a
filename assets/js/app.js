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

  /* ---------- Descuento: botón igual a los demás, que abre un modal
     por encima de todo el menú (no empuja ni reordena el resto). ---------- */
  const promoToggle = document.getElementById('btn-promo-toggle');
  const promoModal = document.getElementById('promo-modal');
  function openPromo() { promoModal.hidden = false; }
  function closePromo() { promoModal.hidden = true; }
  promoToggle?.addEventListener('click', openPromo);
  promoModal?.querySelectorAll('[data-promo-close]').forEach(el => {
    el.addEventListener('click', closePromo);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && promoModal && !promoModal.hidden) closePromo();
  });

  /* ---------- Navegación del menú (hub) ---------- */
  const menuScreen = document.getElementById('screen-menu');
  const detailScreens = document.querySelectorAll('.detail-screen');

  // La entrada en cascada de los botones del menú (ver hubBtnPop en el
  // CSS) usa "animation-fill-mode: both" para que cada botón se quede
  // en su posición final al terminar. Si no la quitáramos, esa mismo
  // "transform" seguiría bloqueado por la animación para siempre y los
  // efectos :hover/:active (que también animan transform) dejarían de
  // notarse. En cuanto cada botón termina su entrada, le limpiamos la
  // animación para devolverle el control normal del hover.
  document.querySelector('.hub-grid')?.addEventListener('animationend', e => {
    if (e.target.parentElement?.classList.contains('hub-grid')) {
      e.target.style.animation = 'none';
    }
  });

  function showScreen(name) {
    const target = name === 'menu' ? menuScreen : document.getElementById('screen-' + name);
    if (!target) return;

    menuScreen.hidden = target !== menuScreen;
    detailScreens.forEach(s => { s.hidden = s !== target; });

    // Varios componentes (heredados de la guía original, pensada para un
    // scroll largo) solo se revelan al recibir la clase "is-visible" —
    // antes la ponía un IntersectionObserver al hacer scroll. Aquí cada
    // pantalla aparece entera de golpe, así que se la damos directamente
    // en cuanto se muestra, sin esperar a ningún scroll.
    target.querySelectorAll('.card, .place')
      .forEach(el => el.classList.add('is-visible'));

    window.scrollTo(0, 0);

    // Los mapas de Leaflet se crean con su contenedor oculto (tamaño 0);
    // al mostrar la pantalla correspondiente hay que recalcular tamaño y
    // encuadre. Un setTimeout fijo no siempre basta: si el navegador aún
    // no ha terminado de aplicar el "display: none -> block" cuando se
    // dispara, invalidateSize() mide 0x0, fitBounds() no tiene área real
    // sobre la que encajar y Leaflet acaba metiendo un zoom absurdo
    // (edificio a edificio, con un único tile cargado y todo lo demás en
    // gris — justo el "mapa que no carga" reportado). Por eso reintenta
    // hasta que el contenedor tenga tamaño real antes de encajar.
    function fitMapWhenVisible(mapInfo, attemptsLeft) {
      if (!mapInfo) return;
      // Nada de requestAnimationFrame aquí: en una pestaña que no está
      // en primer plano el navegador puede posponerlo indefinidamente,
      // dejando el mapa sin encuadrar. setTimeout sí se ejecuta siempre.
      setTimeout(() => {
        // map.getSize() de Leaflet cachea el tamaño y, si la primera
        // medición se hizo con el contenedor a 0x0, puede quedarse
        // "pegado" ahí aunque el div ya tenga tamaño real. Medimos el
        // propio elemento del DOM (sin caché) para decidir si ya es
        // seguro encajar el mapa.
        const container = mapInfo.map.getContainer();
        if ((container.clientWidth === 0 || container.clientHeight === 0) && attemptsLeft > 0) {
          fitMapWhenVisible(mapInfo, attemptsLeft - 1);
          return;
        }
        // Fuerza a Leaflet a remedir de cero: si su caché interna de
        // tamaño se quedó a 0x0 de cuando el contenedor nació oculto,
        // invalidateSize() por sí solo no siempre la limpia.
        mapInfo.map._size = null;
        mapInfo.map.invalidateSize();
        mapInfo.map.fitBounds(mapInfo.allBounds, { padding: [30, 30], maxZoom: 16 });
      }, 100);
    }

    if (name === 'ver' && window.__mapaGranada) {
      fitMapWhenVisible(window.__mapaGranada, 10);
    }
    if (name === 'parkings' && window.__mapaParkings) {
      fitMapWhenVisible(window.__mapaParkings, 10);
    }
  }

  document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.target));
  });

  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => showScreen('menu'));
  });

  /* ---------- i18n (ES / EN) ---------- */
  const I18N = {
    es: {
      'toast.wifi': '✓ Contraseña copiada al portapapeles',
      'hub.changeLang': '‹ Cambiar idioma',
      'hub.checkinout': 'Check-in / Check-out',
      'hub.maletas': 'Consigna',
      'hub.normas': 'Normas de la casa',
      'hub.casa': 'Cómo funciona la casa',
      'hub.llegar': 'Cómo llegar',
      'hub.moverse': 'Cómo moverte',
      'hub.parkings': 'Parkings',
      'hub.comer': 'Dónde comer',
      'hub.ver': 'Qué ver',
      'hub.experiencias': 'Experiencias',
      'hub.contacto': 'Contacto',
      'hub.promo': 'Descuento −10%',
      'stay.kicker': 'Tu estancia',
      'stay.title': 'Lo esencial',
      'stay.checkin.title': 'Entrada',
      'stay.checkin.small': 'A partir de las tres de la tarde',
      'stay.checkout.title': 'Salida',
      'stay.checkout.small': 'Antes de las once de la mañana',
      'stay.earlylate': '¿Necesitas entrar antes o salir más tarde? Escríbenos directamente por <a href="https://wa.me/34680251473" target="_blank" rel="noopener">WhatsApp</a> y lo vemos contigo.',
      'stay.wifi.network': 'Red',
      'stay.wifi.pass': 'Contraseña',
      'stay.wifi.copy': 'Copiar contraseña',
      'stay.locker.priceNote': 'por pieza, sea cual sea su tamaño',
      'stay.locker.text': 'Si necesitas guardar el equipaje antes del check-in o después del check-out, tienes a tu disposición un servicio de consigna en <strong>Artesanías Medina</strong>, en Calle Reyes Católicos 54 — a solo unos minutos andando del apartamento. Puedes dejar tus maletas por 3,50 € por pieza, sea cual sea su tamaño. La tienda abre todos los días del año, de 10:00 a 21:00, excepto el 1 de enero.',
      'stay.locker.cta': 'Ver en Google Maps',
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
      'rules.r7.d': 'Te pedimos un uso responsable del aire, la calefacción, el agua y la luz.',
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
      'move.transit.t': 'Estaciones y aeropuerto',
      'move.transit.bus': 'Estación de autobuses',
      'move.transit.train': 'Estación de tren',
      'move.transit.airport': 'Aeropuerto FGR',
      'move.transit.airport.d': 'bus urbano hasta Gran Vía o taxi (~25 min al centro).',
      'move.luggage.t': '¿Necesitas dejar el equipaje?',
      'move.luggage.hours': 'Abierto todos los días de 10:00 a 21:00.',
      'move.luggage.price': '3,5 € por maleta, sea del tamaño que sea.',
      'parkings.kicker': 'En coche',
      'parkings.title': 'Parkings en el centro',
      'parkings.intro': 'El centro histórico es zona de acceso restringido. Por favor, envíanos por <a href="https://wa.me/34680251473" target="_blank" rel="noopener">WhatsApp</a> la matrícula del coche con el que vienes, para poder autorizar tu entrada y evitar que te multen.',
      'parkings.mapIntro': 'Pulsa cualquier marcador para abrirlo en Google Maps.',
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
      'promo.expandText': 'Tienes un 10% de descuento si utilizas el código <strong>ARC10</strong> reservando directamente en nuestra web.',
      'promo.expandCta': 'Reservar en nuestra web →'
    },
    en: {
      'toast.wifi': '✓ Password copied to clipboard',
      'hub.changeLang': '‹ Change language',
      'hub.checkinout': 'Check-in / Check-out',
      'hub.maletas': 'Locker',
      'hub.normas': 'House rules',
      'hub.casa': 'How the house works',
      'hub.llegar': 'How to get here',
      'hub.moverse': 'Getting around',
      'hub.parkings': 'Parking',
      'hub.comer': 'Where to eat',
      'hub.ver': 'What to see',
      'hub.experiencias': 'Experiences',
      'hub.contacto': 'Contact',
      'hub.promo': 'Discount −10%',
      'stay.kicker': 'Your stay',
      'stay.title': 'The essentials',
      'stay.checkin.title': 'Check-in',
      'stay.checkin.small': 'From three in the afternoon',
      'stay.checkout.title': 'Check-out',
      'stay.checkout.small': 'Before eleven in the morning',
      'stay.earlylate': 'Need to check in earlier or check out later? Message us directly on <a href="https://wa.me/34680251473" target="_blank" rel="noopener">WhatsApp</a> and we\'ll sort it out with you.',
      'stay.wifi.network': 'Network',
      'stay.wifi.pass': 'Password',
      'stay.wifi.copy': 'Copy password',
      'stay.locker.priceNote': 'per piece, whatever its size',
      'stay.locker.text': 'If you need to store your luggage before check-in or after check-out, you can use the luggage storage service at <strong>Artesanías Medina</strong>, Calle Reyes Católicos 54 — just a few minutes\' walk from the apartment. You can leave your bags for €3.50 per piece, whatever the size. The shop is open every day of the year, 10:00–21:00, except January 1st.',
      'stay.locker.cta': 'Open in Google Maps',
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
      'rules.r7.d': 'We kindly ask for responsible use of the AC, heating, water and electricity.',
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
      'move.transit.t': 'Stations and airport',
      'move.transit.bus': 'Bus station',
      'move.transit.train': 'Train station',
      'move.transit.airport': 'FGR Airport',
      'move.transit.airport.d': 'city bus to Gran Vía or a taxi (~25 min to the centre).',
      'move.luggage.t': 'Need to leave your luggage?',
      'move.luggage.hours': 'Open every day from 10:00 to 21:00.',
      'move.luggage.price': '€3.50 per suitcase, any size.',
      'parkings.kicker': 'By car',
      'parkings.title': 'Parking in the centre',
      'parkings.intro': 'The historic centre has restricted vehicle access. Please send us the number plate of the car you\'re arriving in via <a href="https://wa.me/34680251473" target="_blank" rel="noopener">WhatsApp</a>, so we can authorise your entry and avoid a fine.',
      'parkings.mapIntro': 'Tap any marker to open it in Google Maps.',
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
      'promo.expandText': 'Enjoy 10% off when you use the code <strong>ARC10</strong> booking directly on our website.',
      'promo.expandCta': 'Book on our website →'
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

    // El botón "Cómo llegar" lleva a la guía de acceso ya en el mismo
    // idioma elegido aquí, saltándose su propia pantalla de idioma.
    const comoLlegarLink = document.getElementById('link-como-llegar');
    if (comoLlegarLink) {
      comoLlegarLink.href = 'https://apartamentosreyescatolicos-max.github.io/guia-como-llegar/?lang=' + lang + '&from=' + encodeURIComponent(location.href);
    }
  }

  applyLang('es');

  /* ---------- Asistente: splash → idioma → menú ---------- */
  const stage = document.getElementById('stage');
  const stageScreens = {
    splash: document.getElementById('screen-splash'),
    lang: document.getElementById('screen-lang')
  };
  let currentStageScreen = 'splash';
  const STAGE_MS = 900; // debe coincidir con la duración del fundido en CSS

  function bringToFront(screen) {
    stageScreens.splash.style.zIndex = '1';
    stageScreens.lang.style.zIndex = '1';
    screen.style.zIndex = '2';
  }

  function revealLang() {
    // La pantalla de idioma ya está lista y visible por debajo, sin
    // animación propia; solo el splash que la tapa se difumina encima.
    // Así no hay ningún hueco entre medias, solo un fundido continuo.
    const splash = stageScreens.splash;
    const lang = stageScreens.lang;
    bringToFront(splash);
    lang.hidden = false;
    splash.classList.add('is-hidden');
    setTimeout(() => {
      splash.hidden = true;
    }, STAGE_MS);
    currentStageScreen = 'lang';
  }

  function enterMenu() {
    // El menú se revela YA por debajo (el escenario aún lo tapa) y es
    // el escenario entero el que se difumina como una sola pieza sobre
    // él, para que sea un fundido continuo y no un corte seguido de
    // otra animación distinta.
    document.body.classList.remove('is-wizard');
    menuScreen.hidden = false;
    stage.classList.add('is-fading');
    setTimeout(() => {
      stage.hidden = true;
      stage.classList.remove('is-fading');
    }, STAGE_MS);
  }

  function backToLang() {
    document.body.classList.add('is-wizard');
    bringToFront(stageScreens.lang);
    stage.classList.add('is-fading');
    stage.hidden = false;
    void stage.offsetWidth;
    stage.classList.remove('is-fading');
    setTimeout(() => {
      menuScreen.hidden = true;
    }, STAGE_MS);
    currentStageScreen = 'lang';
  }

  document.querySelectorAll('[data-lang-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyLang(btn.dataset.langChoice);
      enterMenu();
    });
  });

  document.getElementById('btn-back-to-lang')?.addEventListener('click', backToLang);

  // Splash: el logo se eleva mientras aparece y, antes de que termine, ya
  // se va revelando el ornamento dorado (movimiento solapado y continuo,
  // no por pasos), se mantiene un instante y toda la pantalla se
  // difumina hacia la elección de idioma.
  const splashLogo = document.getElementById('splash-logo');
  const splashOrnament = document.getElementById('splash-ornament');
  requestAnimationFrame(() => splashLogo?.classList.add('is-visible'));
  setTimeout(() => splashOrnament?.classList.add('is-visible'), 350);
  setTimeout(() => revealLang(), 2000);
})();

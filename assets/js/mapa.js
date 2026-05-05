(function () {
  if (typeof L === 'undefined') return;

  const PLACES = [
    { cat: "comer-dulce",  emoji: "☕", name: "Café 4 Gatos",                lat: 37.17911, lon: -3.59497, q: "Café 4 Gatos Granada" },
    { cat: "comer-dulce",  emoji: "☕", name: "La Finca Coffee",             lat: 37.17621, lon: -3.60014, q: "La Finca Coffee Granada" },
    { cat: "comer-dulce",  emoji: "☕", name: "Minuit",                      lat: 37.17597, lon: -3.59665, q: "Minuit Granada" },
    { cat: "comer-dulce",  emoji: "☕", name: "Café Bar Gerardo",            lat: 37.17620, lon: -3.59850, q: "Café Bar Gerardo Granada" },
    { cat: "comer-tapas",  emoji: "🍢", name: "La Trastienda",               lat: 37.17628, lon: -3.59618, q: "La Trastienda Plaza Cuchilleros Granada" },
    { cat: "comer-tapas",  emoji: "🍢", name: "Bodegas Castañeda",           lat: 37.17683, lon: -3.59699, q: "Bodegas Castañeda Granada" },
    { cat: "comer-tapas",  emoji: "🍢", name: "Bar Los Diamantes",           lat: 37.17373, lon: -3.59833, q: "Bar Los Diamantes Plaza Nueva Granada" },
    { cat: "comer-tapas",  emoji: "🍢", name: "Los Manueles",                lat: 37.17568, lon: -3.59986, q: "Los Manueles Granada" },
    { cat: "comer-vistas", emoji: "🌅", name: "Mirador de Morayma",          lat: 37.18090, lon: -3.58956, q: "Mirador de Morayma Granada" },
    { cat: "comer-vistas", emoji: "🌅", name: "Carmen de Aben Humeya",       lat: 37.18079, lon: -3.59166, q: "Carmen de Aben Humeya Granada" },
    { cat: "comer-vistas", emoji: "🌅", name: "La Sabika",                   lat: 37.17347, lon: -3.58939, q: "Restaurante La Sabika Granada" },
    { cat: "comer-vistas", emoji: "🌅", name: "María de la O",               lat: 37.17883, lon: -3.59687, q: "María de la O Albaicín Granada" },
    { cat: "ver-mon",      emoji: "🏛️", name: "La Alhambra y el Generalife", lat: 37.17605, lon: -3.58811, q: "Alhambra Granada" },
    { cat: "ver-mon",      emoji: "🏛️", name: "Albaicín",                    lat: 37.18157, lon: -3.59467, q: "Albaicín Granada" },
    { cat: "ver-mon",      emoji: "🏛️", name: "Catedral de Granada",         lat: 37.17646, lon: -3.59931, q: "Catedral de Granada" },
    { cat: "ver-mon",      emoji: "🏛️", name: "Capilla Real",                lat: 37.17620, lon: -3.59878, q: "Capilla Real Granada" },
    { cat: "ver-mon",      emoji: "🏛️", name: "Sacromonte",                  lat: 37.18187, lon: -3.58499, q: "Sacromonte Granada" },
    { cat: "ver-mir",      emoji: "🌄", name: "Mirador de San Nicolás",      lat: 37.18104, lon: -3.59266, q: "Mirador de San Nicolás Granada" },
    { cat: "ver-mir",      emoji: "🌄", name: "Mirador de San Cristóbal",    lat: 37.18369, lon: -3.59582, q: "Mirador de San Cristóbal Granada" },
    { cat: "ver-mir",      emoji: "🌄", name: "Paseo de los Tristes",        lat: 37.17896, lon: -3.58969, q: "Paseo de los Tristes Granada" },
    { cat: "ver-mir",      emoji: "🌄", name: "Mirador de los Carvajales",   lat: 37.17893, lon: -3.59425, q: "Mirador de los Carvajales Granada" },
    { cat: "ver-mus",      emoji: "🎨", name: "Museo Casa de los Tiros",     lat: 37.17475, lon: -3.59553, q: "Casa de los Tiros Granada" },
    { cat: "ver-mus",      emoji: "🎨", name: "Parque de las Ciencias",      lat: 37.16270, lon: -3.60576, q: "Parque de las Ciencias Granada" },
    { cat: "ver-mus",      emoji: "🎨", name: "Bellas Artes",                lat: 37.17677, lon: -3.59020, q: "Museo Bellas Artes Palacio Carlos V Granada" },
    { cat: "souvenirs",    emoji: "🛍️", name: "Artesanías Medina · Reyes Católicos", lat: 37.17633, lon: -3.59644, q: "Artesanías Medina Calle Reyes Católicos 54 Granada" },
    { cat: "souvenirs",    emoji: "🛍️", name: "Artesanías Medina · Bib-Rambla",      lat: 37.17526, lon: -3.59947, q: "Artesanías Medina Plaza Bib-Rambla Granada" },
    { cat: "souvenirs",    emoji: "🛍️", name: "Artesanías Medina · Bib-Rambla 2",    lat: 37.17518, lon: -3.59980, q: "Artesanías Medina Plaza Bib-Rambla Granada" },
  ];

  const COLORS = {
    "comer-dulce":  "#C7A87E",
    "comer-tapas":  "#B5573E",
    "comer-vistas": "#8B6E48",
    "ver-mon":      "#4F6E72",
    "ver-mir":      "#6F898C",
    "ver-mus":      "#2E4144",
    "souvenirs":    "#8E4A56",
  };

  const el = document.getElementById('mapa-granada');
  if (!el) return;

  const map = L.map(el, {
    scrollWheelZoom: false,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  const allBounds = L.latLngBounds([]);
  const layers = {};
  PLACES.forEach(p => {
    const color = COLORS[p.cat] || '#4F6E72';
    const icon = L.divIcon({
      className: 'mapa-pin',
      html: `<span class="mapa-pin__dot" style="background:${color}"><span class="mapa-pin__emoji">${p.emoji}</span></span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -16],
    });
    const marker = L.marker([p.lat, p.lon], { icon });
    const url = 'https://maps.google.com/?q=' + encodeURIComponent(p.q);
    marker.bindPopup(
      `<div class="mapa-popup">
         <strong>${p.name}</strong>
         <a href="${url}" target="_blank" rel="noopener">Abrir en Google Maps →</a>
       </div>`
    );
    if (!layers[p.cat]) layers[p.cat] = L.layerGroup();
    layers[p.cat].addLayer(marker);
    allBounds.extend([p.lat, p.lon]);
  });

  Object.values(layers).forEach(g => g.addTo(map));
  map.fitBounds(allBounds, { padding: [30, 30] });

  // ----- Filtros por categoría -----
  const buttons = document.querySelectorAll('.mapa-leyenda__btn[data-cat]');
  const resetBtn = document.querySelector('.mapa-leyenda__btn--reset');
  let activeCat = null; // null = todas visibles

  function applyFilter() {
    Object.entries(layers).forEach(([cat, layer]) => {
      const visible = activeCat === null || activeCat === cat;
      if (visible && !map.hasLayer(layer)) layer.addTo(map);
      if (!visible && map.hasLayer(layer)) map.removeLayer(layer);
    });
    buttons.forEach(b => {
      const cat = b.dataset.cat;
      if (cat === '__all') return;
      const on = activeCat === null || activeCat === cat;
      b.classList.toggle('is-active', on);
      b.classList.toggle('is-dim', !on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (resetBtn) {
      resetBtn.classList.toggle('is-visible', activeCat !== null);
    }
    // reencuadrar al filtro
    if (activeCat) {
      const b = L.latLngBounds([]);
      PLACES.filter(p => p.cat === activeCat).forEach(p => b.extend([p.lat, p.lon]));
      if (b.isValid()) map.flyToBounds(b, { padding: [40, 40], maxZoom: 16, duration: 0.6 });
    } else {
      map.flyToBounds(allBounds, { padding: [30, 30], duration: 0.6 });
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      if (cat === '__all') {
        activeCat = null;
      } else {
        activeCat = activeCat === cat ? null : cat;
      }
      applyFilter();
    });
  });

  applyFilter();
})();

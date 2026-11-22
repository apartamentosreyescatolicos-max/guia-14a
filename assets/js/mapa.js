(function () {
  if (typeof L === 'undefined') return;

  const PLACES = [
    { cat: "comer-dulce",  emoji: "☕", name: "Café 4 Gatos",                lat: 37.179132, lon: -3.5949983, q: "Café 4 Gatos", pid: "ChIJv-DLZsf8cQ0RzJxLlLFa09g" },
    { cat: "comer-dulce",  emoji: "☕", name: "La Finca Coffee",             lat: 37.1762041, lon: -3.600124, q: "La Finca Coffee", pid: "ChIJcyOEtr_8cQ0Rf3-n3Wgwuec" },
    { cat: "comer-dulce",  emoji: "☕", name: "Minuit",                      lat: 37.1759224, lon: -3.5966236, q: "Minuit Pan y Café", pid: "ChIJjVkF5q79cQ0R0rqY2m65VVk" },
    { cat: "comer-dulce",  emoji: "☕", name: "Café Bar Gerardo",            lat: 37.1804518, lon: -3.5997546, q: "Café-Bar Gerardo", pid: "ChIJwYPIy-cBthIRoeRQWHzwvOE" },
    { cat: "comer-tapas",  emoji: "🍢", name: "La Trastienda",               lat: 37.1762886, lon: -3.5961407, q: "La Trastienda", pid: "ChIJI2r007j8cQ0RhZXA6RxSOrU" },
    { cat: "comer-tapas",  emoji: "🍢", name: "Bodegas Castañeda",           lat: 37.1768636, lon: -3.5969901, q: "Bodegas Castañeda", pid: "ChIJLTqlF7_8cQ0RHosavBRI48Q" },
    { cat: "comer-tapas",  emoji: "🍢", name: "Bar Los Diamantes",           lat: 37.1766076, lon: -3.5959423, q: "Bar Los Diamantes", pid: "ChIJ45mdhb78cQ0R3qfxRyTkzgI" },
    { cat: "comer-tapas",  emoji: "🍢", name: "Los Manueles",                lat: 37.1763525, lon: -3.5968757, q: "Los Manueles Reyes Católicos", pid: "ChIJ-TyL8778cQ0RGwyNKqccDOA" },
    { cat: "comer-vistas", emoji: "🌅", name: "Mirador de Morayma",          lat: 37.1807553, lon: -3.5895934, q: "Restaurante Mirador de Morayma", pid: "ChIJaxLMWsj8cQ0R3SyhmNoy0p4" },
    { cat: "comer-vistas", emoji: "🌅", name: "Carmen de Aben Humeya",       lat: 37.1806799, lon: -3.5917093, q: "Restaurante Carmen de Aben Humeya", pid: "ChIJBURo1sf8cQ0ReAwRLLioo78" },
    { cat: "comer-vistas", emoji: "🌅", name: "Las Tomasas",                lat: 37.1808216, lon: -3.5911682, q: "Las Tomasas Granada", pid: "ChIJM6rVZcj8cQ0RjjY_sjW6ABU" },
    { cat: "ver-mon",      emoji: "🏛️", name: "La Alhambra y el Generalife", lat: 37.1760783, lon: -3.5881413, q: "Alhambra", pid: "ChIJO7l_l7f8cQ0Rf6IhEu_RjYA" },
    { cat: "ver-mon",      emoji: "🏛️", name: "Albaicín",                    lat: 37.18157, lon: -3.59467, q: "Albaicín, Granada", pid: "ChIJkwiHYivjcQ0RXCr0yqO8UYo" },
    { cat: "ver-mon",      emoji: "🏛️", name: "Catedral de Granada",         lat: 37.1765906, lon: -3.5990649, q: "Catedral de Granada", pid: "ChIJqWuDsb_8cQ0RwlE55Uv7_nA" },
    { cat: "ver-mon",      emoji: "🏛️", name: "Capilla Real",                lat: 37.1763713, lon: -3.5986063, q: "Capilla Real de Granada", pid: "ChIJJT_b_778cQ0RmwUjKxl7yWM" },
    { cat: "ver-mon",      emoji: "🏛️", name: "Sacromonte",                  lat: 37.1820683, lon: -3.5864207, q: "Sacromonte, Granada", pid: "ChIJncBP8zHjcQ0RuU8rNjj8q2g" },
    { cat: "ver-mir",      emoji: "🌄", name: "Mirador de San Nicolás",      lat: 37.1811058, lon: -3.5926637, q: "Mirador de San Nicolás", pid: "ChIJlc_oycf8cQ0RmGSbIT5svlk" },
    { cat: "ver-mir",      emoji: "🌄", name: "Mirador de San Cristóbal",    lat: 37.1831024, lon: -3.5959984, q: "Mirador de San Cristóbal", pid: "ChIJOzD_sMb8cQ0RlXsnGGQJ3Gk" },
    { cat: "ver-mir",      emoji: "🌄", name: "Paseo de los Tristes",        lat: 37.1791997, lon: -3.5887713, q: "Paseo de los Tristes", pid: "ChIJg1h_LMj8cQ0RGf1o4IWHExU" },
    { cat: "ver-mir",      emoji: "🌄", name: "Mirador de los Carvajales",   lat: 37.178979, lon: -3.5942253, q: "Mirador Placeta de Carvajales", pid: "ChIJ00Spfsf8cQ0RTJBosFE3KC8" },
    { cat: "ver-mus",      emoji: "🎨", name: "Museo Casa de los Tiros",     lat: 37.1747592, lon: -3.5955111, q: "Museo Casa de los Tiros", pid: "ChIJu2j7Lbn8cQ0Ri5SbfkjUYfc" },
    { cat: "ver-mus",      emoji: "🎨", name: "Parque de las Ciencias",      lat: 37.1624608, lon: -3.6068027, q: "Parque de las Ciencias", pid: "ChIJY1N6W578cQ0RlUdw_5yVKic" },
    { cat: "ver-mus",      emoji: "🎨", name: "Bellas Artes",                lat: 37.1769402, lon: -3.5899778, q: "Museo de Bellas Artes de Granada", pid: "ChIJY5NBpbf8cQ0Rrf4epNmvb8E" },
    { cat: "souvenirs",    emoji: "🛍️", name: "Artesanías Medina · Reyes Católicos", lat: 37.17635, lon: -3.5964257, q: "Artesanías Medina, Reyes Católicos 54", pid: "ChIJUzQHqen8cQ0ReYO044JFyAY" },
    { cat: "souvenirs",    emoji: "🛍️", name: "Artesanías Medina · Bib-Rambla",      lat: 37.1754484, lon: -3.5995354, q: "Artesanías Medina, Plaza de Bib-Rambla 18", pid: "ChIJ1WXtTdn9cQ0RfQD79v8-xqk" },
    { cat: "souvenirs",    emoji: "🛍️", name: "Artesanías Medina · Bib-Rambla 2",    lat: 37.1755071, lon: -3.6002631, q: "Artesanías Medina, Plaza de Bib-Rambla 14", pid: "ChIJq6fv-b78cQ0RzVsloL-CaDI" },
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

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
    const url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.q) + (p.pid ? '&query_place_id=' + p.pid : '');
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

  // El contenedor nace oculto (pantalla "Qué ver" cerrada) y con tamaño
  // cero, así que fitBounds/flyToBounds no pueden calcular un encuadre
  // válido y Leaflet lanza "Invalid LatLng (NaN, NaN)". Estas funciones
  // comprueban el tamaño real antes de encuadrar; el encuadre correcto
  // se aplica más tarde, cuando app.js llama a invalidateSize() al
  // mostrar la pantalla.
  function hasValidSize() {
    const size = map.getSize();
    return size.x > 0 && size.y > 0;
  }
  function safeFitBounds(bounds, opts) {
    if (!bounds.isValid() || !hasValidSize()) return;
    map.fitBounds(bounds, opts);
  }
  function safeFlyToBounds(bounds, opts) {
    if (!bounds.isValid() || !hasValidSize()) return;
    map.flyToBounds(bounds, opts);
  }

  safeFitBounds(allBounds, { padding: [30, 30], maxZoom: 16 });

  // El contenedor nace oculto (la pantalla "Qué ver" empieza cerrada),
  // así que Leaflet lo mide con tamaño 0. Exponemos el mapa para que
  // app.js pueda recalcular tamaño y encuadre al mostrar la pantalla.
  window.__mapaGranada = { map, allBounds };

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
      safeFlyToBounds(b, { padding: [40, 40], maxZoom: 16, duration: 0.6 });
    } else {
      safeFlyToBounds(allBounds, { padding: [30, 30], maxZoom: 16, duration: 0.6 });
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

/* =========================================================
   Mapa de Parkings: apartamento + 5 parkings del centro
   ========================================================= */
(function () {
  if (typeof L === 'undefined') return;

  const POINTS = [
    { type: "home",    emoji: "🏠", name: "Tu apartamento · Plaza de Cuchilleros 14", lat: 37.1762272, lon: -3.5963708, q: "Plaza de Cuchilleros 14, Granada", pid: "ChIJLeOQ1Lj8cQ0RCRc3MLqn7Ew" },
    { type: "parking", emoji: "🅿️", name: "Parking San Agustín",                      lat: 37.1778097, lon: -3.5990428, q: "Parking San Agustín", pid: "ChIJUQganb_8cQ0Rn9Q84bcqqPE" },
    { type: "parking", emoji: "🅿️", name: "Parking APK2 Puerta Real",                 lat: 37.171659, lon: -3.598588, q: "Parking APK2 Puerta Real", pid: "ChIJ_cIXXiv9cQ0Rw6EBpLcqu3c" },
    { type: "parking", emoji: "🅿️", name: "Parking San Juan de Dios",                 lat: 37.1799589, lon: -3.6034918, q: "Parking San Juan de Dios", pid: "ChIJVdzo6er8cQ0RzL6-JSnN5kc" },
    { type: "parking", emoji: "🅿️", name: "Parking Hermanos Maristas",                lat: 37.1766074, lon: -3.6052343, q: "Parking HH. Maristas", pid: "ChIJZUrqe5T8cQ0R2eCBdzjAWM0" },
  ];

  const COLORS = { home: "#B5573E", parking: "#4F6E72" };

  const el = document.getElementById('mapa-parkings');
  if (!el) return;

  const map = L.map(el, {
    scrollWheelZoom: false,
    zoomControl: true,
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  const allBounds = L.latLngBounds([]);
  POINTS.forEach(p => {
    const color = COLORS[p.type];
    const icon = L.divIcon({
      className: 'mapa-pin',
      html: `<span class="mapa-pin__dot" style="background:${color}"><span class="mapa-pin__emoji">${p.emoji}</span></span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -16],
    });
    const marker = L.marker([p.lat, p.lon], { icon }).addTo(map);
    const url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.q) + (p.pid ? '&query_place_id=' + p.pid : '');
    marker.bindPopup(
      `<div class="mapa-popup">
         <strong>${p.name}</strong>
         <a href="${url}" target="_blank" rel="noopener">Abrir en Google Maps →</a>
       </div>`
    );
    allBounds.extend([p.lat, p.lon]);
  });

  // Mismo problema que el mapa de "Qué ver": el contenedor nace oculto
  // (pantalla "Parkings" cerrada) con tamaño 0, así que fitBounds no
  // puede calcular un encuadre válido todavía. app.js llama a
  // invalidateSize() + fitBounds() cuando la pantalla se muestra.
  function hasValidSize() {
    const size = map.getSize();
    return size.x > 0 && size.y > 0;
  }
  if (allBounds.isValid() && hasValidSize()) {
    map.fitBounds(allBounds, { padding: [30, 30], maxZoom: 16 });
  }

  window.__mapaParkings = { map, allBounds };
})();

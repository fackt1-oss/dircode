<!-- Подключение шрифта Montserrat -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">

<div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: 'Montserrat', sans-serif;">
  <!-- Первая строка: поиск и переключение режимов -->
  <div style="margin-bottom: 15px; display: flex; gap: 15px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
    <!-- Блок поиска (поля + кнопки) -->
    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
      <img src="https://static.tildacdn.com/tild3236-3064-4236-b662-323561623064/filterpng.webp" 
           alt="filter" 
           style="width: 24px; height: 24px; vertical-align: middle;">
      <input type="text" id="city-search" list="city-datalist" placeholder="Город..." style="width: 200px; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 15px; font-family: 'Montserrat', sans-serif; background: white; box-sizing: border-box;">
      <datalist id="city-datalist"></datalist>
      <input type="text" id="name-search" placeholder="Название..." style="width: 250px; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 15px; font-family: 'Montserrat', sans-serif; background: white; box-sizing: border-box;">
      <button id="search-btn" style="padding: 12px 28px; background: #1f2a3a; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 500; font-family: 'Montserrat', sans-serif; cursor: pointer; transition: background 0.15s;">Найти</button>
      <button id="reset-btn" style="padding: 12px 28px; background: #f3f4f6; color: #1f2a3a; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 15px; font-weight: 500; font-family: 'Montserrat', sans-serif; cursor: pointer; transition: background 0.15s;">Сбросить</button>
    </div>
    <!-- Переключатели режимов -->
    <div style="display: flex; gap: 4px; background: #f3f4f6; border-radius: 10px; padding: 4px;">
      <button id="mode-list" class="mode-btn" style="padding: 10px 20px; border: none; border-radius: 8px; font-size: 15px; font-family: 'Montserrat', sans-serif; cursor: pointer; transition: all 0.15s; background: transparent; color: #4b5563; font-weight: 500;">Списком</button>
      <button id="mode-map" class="mode-btn active" style="padding: 10px 20px; border: none; border-radius: 8px; font-size: 15px; font-family: 'Montserrat', sans-serif; cursor: pointer; transition: all 0.15s; background: white; color: #1f2a3a; font-weight: 500; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">Картой</button>
    </div>
  </div>

  <!-- Горизонтальная линия-разделитель -->
  <hr style="margin: 10px 0 20px 0; border: none; border-top: 2px solid #e5e7eb;">

  <!-- Вторая строка: фильтры в одну строку (сгруппированы) -->
  <div style="margin-bottom: 20px; display: flex; gap: 20px; flex-wrap: wrap; align-items: center;">
    <!-- Группа Товары -->
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <span style="color: #4b5563; font-size: 14px; font-weight: 500;">Товары:</span>
      <button id="filter-product-ready" class="filter-btn" style="padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 30px; background: #f3f4f6; color: #1f2a3a; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px;">🏠 Готовые решения</button>
      <button id="filter-product-smart" class="filter-btn" style="padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 30px; background: #f3f4f6; color: #1f2a3a; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px;">🔒 Умные замки</button>
      <!-- ДОБАВЛЕНО: кнопка фильтра "Умные двери" -->
      <button id="filter-product-doors" class="filter-btn" style="padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 30px; background: #f3f4f6; color: #1f2a3a; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px;">🚪 Умные двери</button>
    </div>
    <!-- Группа Услуги -->
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <span style="color: #4b5563; font-size: 14px; font-weight: 500;">Услуги:</span>
      <button id="filter-service-montazh" class="filter-btn" style="padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 30px; background: #f3f4f6; color: #1f2a3a; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px;">🔧 Монтаж</button>
      <button id="filter-service-remont" class="filter-btn" style="padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 30px; background: #f3f4f6; color: #1f2a3a; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px;">🛠️ Ремонт</button>
      <button id="filter-service-obuchenie" class="filter-btn" style="padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 30px; background: #f3f4f6; color: #1f2a3a; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px;">📚 Обучение</button>
    </div>
    <!-- Группа Сертификация (без подписи) -->
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <button id="filter-certified" class="filter-btn" style="padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 30px; background: #f3f4f6; color: #1f2a3a; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px;">⭐ Сертифицирован</button>
    </div>
  </div>

  <!-- Контейнер для списка и карты -->
  <div class="map-container" style="display: flex; flex-wrap: wrap; gap: 24px; height: 600px; margin-top: 20px;">
    <div class="office-list" id="office-list" style="width: 30%; height: 100%; overflow-y: auto; background: transparent; transition: width 0.3s; box-sizing: border-box; padding-right: 4px;"></div>
    <div id="map" style="width: 65%; height: 100%; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.05); box-sizing: border-box;"></div>
  </div>
</div>

<!-- Подключение API Яндекс.Карт с исправленным ключом (замените на свой, если этот не подойдёт) -->
<script src="https://api-maps.yandex.ru/2.1/?apikey=5408edf3-077a-475f-bd26-008101e3be9e&lang=ru_RU" type="text/javascript"></script>

<style>
  /* Базовые стили с Montserrat */
  body, input, button, .office-item, .mode-btn, .route-link, .detail-link, .no-results, .tag, .filter-btn, .cooperation-btn {
    font-family: 'Montserrat', sans-serif;
  }

  #city-search:focus, #name-search:focus {
    outline: none;
    border-color: #9aa6b5;
    box-shadow: 0 0 0 3px rgba(31,42,58,0.1);
  }

  .mode-btn.active {
    background: white !important;
    color: #1f2a3a !important;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05) !important;
  }

  /* Стили для фильтров */
  .filter-btn.active {
    background: #1f2a3a !important;
    color: white !important;
    border-color: #1f2a3a !important;
  }
  .filter-btn:hover {
    background: #e5e7eb !important;
    border-color: #9aa6b5 !important;
  }

  .mode-map-active #office-list {
    display: block;
    width: 30% !important;
    height: 100%;
    overflow-y: auto;
    padding-right: 4px;
  }
  .mode-map-active #map {
    display: block;
    width: 65% !important;
    height: 100%;
  }

  .mode-list-active #office-list {
    width: 100% !important;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    height: 100%;
    overflow-y: auto;
    padding: 0 4px 0 0;
  }
  .mode-list-active #office-list .office-item {
    margin-bottom: 0;
  }
  .mode-list-active #map {
    display: none;
  }

  .office-item {
    padding: 20px;
    margin-bottom: 12px;
    background: white;
    border-radius: 12px;
    cursor: pointer;
    border: 1px solid #f0f2f5;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    box-sizing: border-box;
  }
  .office-item:hover {
    border-color: #d0d7de;
    background-color: #fafbfc;
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.05);
  }
  .office-item.active {
    border-left: 4px solid #1f2a3a;
    background-color: #f9fafb;
  }
  .office-item strong {
    font-size: 16px;
    font-weight: 600;
    display: block;
    margin-bottom: 8px;
    color: #1f2a3a;
  }
  .office-item small {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
    display: block;
    margin-bottom: 4px;
  }

  /* Рейтинг звёздами */
  .rating-stars {
    color: #f5b342;
    font-size: 1.2em;
    letter-spacing: 2px;
  }
  .rating-value {
    font-weight: 500;
    color: #1f2a3a;
  }

  /* Теги характеристик */
  .office-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 10px 0 8px;
  }
  .tag {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.3px;
    display: inline-block;
  }
  .tag.product {
    background: #e0f2fe;
    color: #0369a1;
  }
  .tag.service {
    background: #eef2f6;
    color: #1f2a3a;
  }
  .tag.certified {
    background: #ffedd5;
    color: #9a3412;
  }

  /* Ссылки в карточках */
  .office-links {
    display: flex;
    gap: 12px;
    margin-top: 12px;
    flex-wrap: wrap;
  }
  .route-link, .detail-link {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.15s;
    border: 1px solid transparent;
  }
  .route-link {
    background: #e8f0fe;
    color: #1f2a3a;
    border-color: #d0d7de;
  }
  .route-link:hover {
    background: #dde7f5;
    border-color: #9aa6b5;
  }
  .detail-link {
    background: #f3f4f6;
    color: #1f2a3a;
    border-color: #d0d7de;
  }
  .detail-link:hover {
    background: #e5e7eb;
    border-color: #9aa6b5;
  }

  /* Стили для блока "ничего не найдено" и призыва к сотрудничеству */
  .no-results {
    padding: 40px 20px;
    text-align: center;
    color: #6b7280;
    font-size: 15px;
    background: #f9fafb;
    border-radius: 12px;
    border: 1px dashed #d0d7de;
  }
  .no-results p {
    margin-bottom: 10px;
  }
  .cooperation-btn {
    display: inline-block;
    margin-top: 15px;
    padding: 12px 28px;
    background: #1f2a3a;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.15s;
    cursor: pointer;
  }
  .cooperation-btn:hover {
    background: #2d3b4f;
  }

  /* Адаптивность */
  @media (max-width: 639px) {
    #city-search, #name-search, #search-btn, #reset-btn {
      width: 100% !important;
    }
    .mode-btn {
      flex: 1;
      text-align: center;
    }
    .mode-map-active #office-list,
    .mode-map-active #map {
      width: 100% !important;
    }
    .mode-map-active .map-container {
      flex-direction: column;
    }
    .mode-map-active #map {
      height: 400px;
    }
    .mode-map-active #office-list {
      max-height: 300px;
    }
    .filter-btn {
      flex: 1 0 auto;
      text-align: center;
    }
  }

  @media (min-width: 640px) and (max-width: 959px) {
    .mode-map-active #office-list,
    .mode-map-active #map {
      width: 100% !important;
    }
    .mode-map-active .map-container {
      flex-direction: column;
      height: auto;
    }
    .mode-map-active #map {
      height: 450px;
    }
    .mode-map-active #office-list {
      max-height: 400px;
    }
  }

  @media (min-width: 960px) and (max-width: 1199px) {
    .mode-map-active #office-list {
      width: 35% !important;
    }
    .mode-map-active #map {
      width: 60% !important;
    }
  }

  @media (max-width: 359px) {
    .office-item { padding: 16px; }
    .office-item strong { font-size: 15px; }
    .office-item small { font-size: 13px; }
    .route-link, .detail-link { padding: 5px 12px; font-size: 12px; }
    #city-search, #name-search { font-size: 14px; padding: 10px 12px; }
    #search-btn, #reset-btn { font-size: 14px; padding: 10px 12px; }
    .mode-btn { padding: 8px 16px; font-size: 14px; }
    .map-container { height: 500px; }
  }
  /* Кнопка подробнее */
  .detail-link {
  background: #1f2a3a;
  color: #ffffff;
  border: none;
  font-weight: 600;
  padding: 8px 20px;          /* чуть больше отступы */
  box-shadow: 0 2px 8px rgba(31,42,58,0.2);
  transition: background 0.2s, box-shadow 0.2s;
}

.detail-link:hover {
  background: #2d3b4f;
  box-shadow: 0 4px 12px rgba(31,42,58,0.3);
}
</style>

<script>
  // === Глобальные переменные ===
  let myMap;
  const placemarks = {};
  let officesData = [];       // загрузим с GitHub
  let filteredOffices = [];
  let cities = [];

  // Состояние фильтров
  // ДОБАВЛЕНО: doors: false
  let filters = {
    products: { ready: false, smart: false, doors: false },
    services: { montazh: false, remont: false, obuchenie: false },
    certified: false
  };

  // === Вспомогательные функции ===
  function extractCity(address) {
    const parts = address.split(',').map(s => s.trim());
    let city = parts[parts.length - 1];
    city = city.replace(/^г\.\s*/i, '');
    return city;
  }

  function getStarRating(rating) {
    const full = '★';
    const empty = '☆';
    const fullCount = Math.floor(rating);
    const emptyCount = 5 - fullCount;
    return full.repeat(fullCount) + empty.repeat(emptyCount);
  }

  function updateFilterButtons() {
    const btnReady = document.getElementById('filter-product-ready');
    const btnSmart = document.getElementById('filter-product-smart');
    // ДОБАВЛЕНО: кнопка для doors
    const btnDoors = document.getElementById('filter-product-doors');
    if (filters.products.ready) btnReady.classList.add('active'); else btnReady.classList.remove('active');
    if (filters.products.smart) btnSmart.classList.add('active'); else btnSmart.classList.remove('active');
    if (filters.products.doors) btnDoors.classList.add('active'); else btnDoors.classList.remove('active'); // ДОБАВЛЕНО

    const btnMontazh = document.getElementById('filter-service-montazh');
    const btnRemont = document.getElementById('filter-service-remont');
    const btnObuchenie = document.getElementById('filter-service-obuchenie');
    if (filters.services.montazh) btnMontazh.classList.add('active'); else btnMontazh.classList.remove('active');
    if (filters.services.remont) btnRemont.classList.add('active'); else btnRemont.classList.remove('active');
    if (filters.services.obuchenie) btnObuchenie.classList.add('active'); else btnObuchenie.classList.remove('active');

    const btnCertified = document.getElementById('filter-certified');
    if (filters.certified) btnCertified.classList.add('active'); else btnCertified.classList.remove('active');
  }

  function applyAllFilters() {
    const cityFilter = document.getElementById('city-search').value.trim();
    const nameFilter = document.getElementById('name-search').value.trim();

    filteredOffices = officesData.filter(office => {
      if (cityFilter) {
        const officeCity = extractCity(office.address).toLowerCase();
        if (officeCity !== cityFilter.toLowerCase()) return false;
      }
      if (nameFilter) {
        if (!office.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
      }
      if (filters.products.ready && !office.products.includes('Готовые решения')) return false;
      if (filters.products.smart && !office.products.includes('Умные замки')) return false;
      // ДОБАВЛЕНО: проверка для "Умные двери"
      if (filters.products.doors && !office.products.includes('Умные двери')) return false;
      if (filters.services.montazh && !office.services.includes('Монтаж')) return false;
      if (filters.services.remont && !office.services.includes('Ремонт')) return false;
      if (filters.services.obuchenie && !office.services.includes('Обучение')) return false;
      if (filters.certified && !office.certified) return false;
      return true;
    });

    officesData.forEach(o => {
      const visible = filteredOffices.some(f => f.id === o.id);
      if (placemarks[o.id]) {
        placemarks[o.id].options.set('visible', visible);
      }
    });

    if (myMap && filteredOffices.length > 0) {
      const coords = filteredOffices.map(o => o.coords);
      if (coords.length === 1) {
        myMap.setCenter(coords[0], 15);
      } else {
        const bounds = coords.reduce((acc, c) => {
          return [
            [Math.min(acc[0][0], c[0]), Math.min(acc[0][1], c[1])],
            [Math.max(acc[1][0], c[0]), Math.max(acc[1][1], c[1])]
          ];
        }, [[Infinity, Infinity], [-Infinity, -Infinity]]);
        myMap.setBounds(bounds, { checkZoomRange: true, duration: 300 });
      }
    }

    renderOfficeList(filteredOffices);
  }

  function renderOfficeList(offices) {
    const listContainer = document.getElementById('office-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (offices.length === 0) {
      listContainer.innerHTML = `
        <div class="no-results">
          <p style="font-size: 16px; margin-bottom: 10px;">По вашему запросу ничего не найдено.</p>
          <p style="margin-bottom: 20px;">Но вы можете стать нашим партнёром и представлять наши замки в своём городе!</p>
          <a href="/partnership" class="cooperation-btn">Стать партнёром</a>
        </div>
      `;
      return;
    }

    offices.forEach(office => {
      const item = document.createElement('div');
      item.className = 'office-item';
      item.setAttribute('data-id', office.id);
      const routeUrl = `https://yandex.ru/maps/?rtext=~${office.coords[0]},${office.coords[1]}`;
      const stars = getStarRating(office.rating);

      let tagsHtml = '<div class="office-tags">';
      office.products.forEach(product => {
        tagsHtml += `<span class="tag product">${product}</span>`;
      });
      office.services.forEach(service => {
        tagsHtml += `<span class="tag service">${service}</span>`;
      });
      if (office.certified) {
        tagsHtml += `<span class="tag certified">✓ Сертифицирован</span>`;
      }
      tagsHtml += '</div>';

      item.innerHTML = `
        <strong>${office.name}</strong>
        <small>${office.address}</small>
        <small>📞 ${office.phone}</small>
        <small>🕒 ${office.hours}</small>
        <small class="rating-stars" title="Рейтинг ${office.rating}">⭐ ${stars} <span class="rating-value">(${office.rating})</span></small>
        ${tagsHtml}
        <div class="office-links">
          <a href="${routeUrl}" target="_blank" class="route-link">Как проехать</a>
          <a href="partner?id=${office.id}" target="_blank" class="detail-link">Подробнее</a>
        </div>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') return;
        const placemark = placemarks[office.id];
        if (placemark && myMap && document.querySelector('.mode-map-active')) {
          myMap.setCenter(placemark.geometry.getCoordinates(), 16);
          placemark.balloon.open();
        }
        document.querySelectorAll('.office-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
      });

      listContainer.appendChild(item);
    });
  }

  function renderMarkers() {
    if (!myMap) return;
    officesData.forEach(office => {
      const stars = getStarRating(office.rating);
      const productsText = office.products.join(', ');
      const servicesText = office.services.join(', ');
      const certifiedText = office.certified ? '✅ Сертифицированный партнёр' : '';

      const placemark = new ymaps.Placemark(office.coords, {
        balloonContent: `
          <strong style="font-weight:600;">${office.name}</strong><br>
          ${office.address}<br>
          📞 ${office.phone}<br>
          🕒 ${office.hours}<br>
          ⭐ Рейтинг: <span style="color:#f5b342;">${stars}</span> (${office.rating})<br>
          🏷️ Товары: ${productsText}<br>
          🛠️ Услуги: ${servicesText}<br>
          ${certifiedText ? certifiedText + '<br>' : ''}
          <a href="https://yandex.ru/maps/?rtext=~${office.coords[0]},${office.coords[1]}" target="_blank" style="color:#1f2a3a;">🚗 Как проехать</a><br>
          <a href="partner?id=${office.id}" target="_blank" style="color:#1f2a3a;">🔍 Подробнее</a>
        `,
        hintContent: office.name
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconImageSize: [40, 40],
        iconImageOffset: [-20, -40]
      });
      myMap.geoObjects.add(placemark);
      placemarks[office.id] = placemark;

      placemark.events.add('click', () => {
        document.querySelectorAll('.office-item').forEach(el => el.classList.remove('active'));
        const activeItem = document.querySelector(`.office-item[data-id="${office.id}"]`);
        if (activeItem) {
          activeItem.classList.add('active');
          if (!document.querySelector('.mode-list-active')) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    });
  }

  function initMap() {
    myMap = new ymaps.Map("map", {
      center: [55.83, 49.18],
      zoom: 12,
      controls: ["zoomControl", "fullscreenControl"]
    });
    renderMarkers();
    renderOfficeList(filteredOffices);
  }

  // === Обработчики фильтров ===
  function toggleProduct(filterName) {
    filters.products[filterName] = !filters.products[filterName];
    updateFilterButtons();
    applyAllFilters();
  }

  function toggleService(filterName) {
    filters.services[filterName] = !filters.services[filterName];
    updateFilterButtons();
    applyAllFilters();
  }

  function toggleCertified() {
    filters.certified = !filters.certified;
    updateFilterButtons();
    applyAllFilters();
  }

  function resetAllFilters() {
    document.getElementById('city-search').value = '';
    document.getElementById('name-search').value = '';
    // ДОБАВЛЕНО: добавлен doors: false
    filters = {
      products: { ready: false, smart: false, doors: false },
      services: { montazh: false, remont: false, obuchenie: false },
      certified: false
    };
    updateFilterButtons();
    filteredOffices = [...officesData];
    officesData.forEach(o => {
      if (placemarks[o.id]) {
        placemarks[o.id].options.set('visible', true);
      }
    });
    if (myMap) {
      myMap.setCenter([55.83, 49.18], 12);
    }
    renderOfficeList(filteredOffices);
  }

  function search() {
    const cityInput = document.getElementById('city-search').value.trim();
    if (cityInput) {
      const matchedCity = cities.find(city => city.toLowerCase() === cityInput.toLowerCase());
      if (!matchedCity) {
        alert(`Город "${cityInput}" не найден. Доступные города: ${cities.join(', ')}`);
        return;
      }
    }
    if (document.querySelector('.mode-list-active')) {
      setMode('map');
    }
    applyAllFilters();
  }

  function setMode(mode) {
    const container = document.querySelector('.map-container');
    const btnList = document.getElementById('mode-list');
    const btnMap = document.getElementById('mode-map');
    if (!container || !btnList || !btnMap) return;

    container.classList.remove('mode-list-active', 'mode-map-active');

    if (mode === 'list') {
      container.classList.add('mode-list-active');
      btnList.classList.add('active');
      btnMap.classList.remove('active');
    } else {
      container.classList.add('mode-map-active');
      btnMap.classList.add('active');
      btnList.classList.remove('active');
      setTimeout(() => {
        if (myMap) {
          myMap.container.fitToViewport();
        }
      }, 100);
    }
  }

  // === Загрузка данных с GitHub ===
  async function loadDataAndStart() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/fackt1-oss/dircode/main/partners.json');
      if (!response.ok) throw new Error('Ошибка загрузки');
      officesData = await response.json();
      filteredOffices = [...officesData];

      // Заполняем города
      cities = [...new Set(officesData.map(o => extractCity(o.address)))].sort();
      const datalist = document.getElementById('city-datalist');
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        datalist.appendChild(option);
      });

      // Инициализация карты после загрузки API
      ymaps.ready(initMap);

      // Навешиваем обработчики событий
      document.getElementById('search-btn').addEventListener('click', search);
      document.getElementById('reset-btn').addEventListener('click', resetAllFilters);
      document.getElementById('city-search').addEventListener('keypress', (e) => { if (e.key === 'Enter') search(); });
      document.getElementById('name-search').addEventListener('keypress', (e) => { if (e.key === 'Enter') search(); });
      document.getElementById('mode-list').addEventListener('click', () => setMode('list'));
      document.getElementById('mode-map').addEventListener('click', () => setMode('map'));
      document.getElementById('filter-product-ready').addEventListener('click', () => toggleProduct('ready'));
      document.getElementById('filter-product-smart').addEventListener('click', () => toggleProduct('smart'));
      // ДОБАВЛЕНО: обработчик для кнопки "Умные двери"
      document.getElementById('filter-product-doors').addEventListener('click', () => toggleProduct('doors'));
      document.getElementById('filter-service-montazh').addEventListener('click', () => toggleService('montazh'));
      document.getElementById('filter-service-remont').addEventListener('click', () => toggleService('remont'));
      document.getElementById('filter-service-obuchenie').addEventListener('click', () => toggleService('obuchenie'));
      document.getElementById('filter-certified').addEventListener('click', toggleCertified);

      setMode('map');
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      document.getElementById('office-list').innerHTML = `
        <div class="no-results">
          <p>Ошибка загрузки данных. Попробуйте обновить страницу.</p>
          <p>Подробности в консоли браузера.</p>
        </div>
      `;
    }
  }

  // Стартуем после загрузки DOM
  document.addEventListener('DOMContentLoaded', loadDataAndStart);
</script>

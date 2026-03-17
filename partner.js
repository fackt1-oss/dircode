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

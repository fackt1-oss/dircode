// === Глобальные переменные ===
let myMap = null;
let clusterer = null;
let officesData = [];
let filteredOffices = [];
let cities = [];

let filters = {
    products: { smart: false, doors: false },
    services: { montazh: false, remont: false, obuchenie: false },
    certified: false
};

let isMapReady = false;
let pendingFilterUpdate = false;
let filterTimeout = null;

// === Вспомогательные функции ===
function computeAverageRating(partner) {
    if (partner.reviews && Array.isArray(partner.reviews) && partner.reviews.length > 0) {
        const total = partner.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const avg = total / partner.reviews.length;
        return Math.round(avg * 10) / 10;
    }
    return typeof partner.rating === 'number' ? partner.rating : 0;
}

function extractCity(address) {
    if (!address) return '';
    let match = address.match(/(?:г\.|город)\s*([^,]+)/i);
    if (match) return match[1].trim();
    let parts = address.split(',').map(p => p.trim());
    const streetWords = ['ул', 'просп', 'пер', 'бульв', 'шоссе', 'наб', 'пл', 'д', 'к', 'строен'];
    for (let i = parts.length - 1; i >= 0; i--) {
        let part = parts[i];
        let lowerPart = part.toLowerCase();
        if (lowerPart.startsWith('г.')) return part.replace(/^г\.\s*/, '');
        let hasStreetWord = streetWords.some(word => lowerPart.includes(word));
        let hasDigits = /\d/.test(part);
        if (!hasStreetWord && !hasDigits && part.length > 2) return part;
    }
    let lastPart = parts[parts.length - 1];
    return lastPart.replace(/^г\.\s*/, '').replace(/\d/g, '').trim();
}

function getStarRating(rating) {
    const full = '★', empty = '☆';
    const fullCount = Math.floor(rating);
    const emptyCount = 5 - fullCount;
    return full.repeat(fullCount) + empty.repeat(emptyCount);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// === Работа с картой и кластеризацией ===
function createPlacemark(office) {
    const stars = getStarRating(office.avgRating);
    const productsText = office.products.join(', ');
    const servicesText = office.services.join(', ');
    const certifiedText = office.certified ? '✅ Сертифицированный партнёр' : '';

    const safeName = escapeHtml(office.name);
    const safeAddress = escapeHtml(office.address);
    const safePhone = escapeHtml(office.phone);
    const safeHours = escapeHtml(office.hours);
    const safeProducts = escapeHtml(productsText);
    const safeServices = escapeHtml(servicesText);
    const safeCertified = escapeHtml(certifiedText);

    const balloonContent = `
        <strong style="font-weight:600;">${safeName}</strong><br>
        ${safeAddress}<br>
        📞 ${safePhone}<br>
        🕒 ${safeHours}<br>
        ⭐ Рейтинг: <span style="color:#f5b342;">${stars}</span> (${office.avgRating})<br>
        🏷️ Товары: ${safeProducts}<br>
        🛠️ Услуги: ${safeServices}<br>
        ${safeCertified ? safeCertified + '<br>' : ''}
        <div style="display: flex; gap: 8px; margin-top: 8px;">
            <a href="https://yandex.ru/maps/?rtext=~${office.coords[0]},${office.coords[1]}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; text-decoration: none; background: #e8f0fe; color: #1f2a3a; border: 1px solid #d0d7de;">🚗 Как проехать</a>
            <a href="partner?id=${office.id}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; text-decoration: none; background: #1f2a3a; color: white; border: 1px solid #1f2a3a; box-shadow: 0 2px 8px rgba(31,42,58,0.2);">🔍 Подробнее</a>
        </div>
    `;
    return new ymaps.Placemark(office.coords, {
        balloonContent: balloonContent,
        hintContent: safeName
    }, {
        iconLayout: 'default#image',
        iconImageHref: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconImageSize: [40, 40],
        iconImageOffset: [-20, -40]
    });
}

function rebuildClusterer() {
    if (!myMap) return;
    if (clusterer) myMap.geoObjects.remove(clusterer);
    const visibleOffices = officesData.filter(office => filteredOffices.some(f => f.id === office.id));
    const geoObjects = visibleOffices.map(office => createPlacemark(office));
    clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        groupByCoordinates: false,
        zoomMargin: 20,
        clusterDisableClickZoom: false
    });
    clusterer.add(geoObjects);
    myMap.geoObjects.add(clusterer);
}

function centerMapOnOffices(offices) {
    if (!myMap || !offices.length) return;
    const coords = offices.filter(o => o.coords && o.coords.length === 2).map(o => o.coords);
    if (coords.length === 0) return;
    if (coords.length === 1) {
        myMap.setCenter(coords[0], 15, { duration: 300 });
    } else {
        const bounds = coords.reduce((acc, c) => [
            [Math.min(acc[0][0], c[0]), Math.min(acc[0][1], c[1])],
            [Math.max(acc[1][0], c[0]), Math.max(acc[1][1], c[1])]
        ], [[Infinity, Infinity], [-Infinity, -Infinity]]);
        myMap.setBounds(bounds, { checkZoomRange: true, duration: 300 });
    }
}

// === Отрисовка списка ===
function createOfficeElement(office) {
    const item = document.createElement('div');
    item.className = 'office-item';
    item.setAttribute('data-id', office.id);
    const routeUrl = `https://yandex.ru/maps/?rtext=~${office.coords[0]},${office.coords[1]}`;

    const nameStrong = document.createElement('strong');
    nameStrong.textContent = office.name;
    item.appendChild(nameStrong);

    const addressSmall = document.createElement('small');
    addressSmall.textContent = office.address;
    item.appendChild(addressSmall);

    const phoneSmall = document.createElement('small');
    phoneSmall.textContent = `📞 ${office.phone}`;
    item.appendChild(phoneSmall);

    const hoursSmall = document.createElement('small');
    hoursSmall.textContent = `🕒 ${office.hours}`;
    item.appendChild(hoursSmall);

    const starsSpan = document.createElement('small');
    starsSpan.className = 'rating-stars';
    starsSpan.title = `Рейтинг ${office.avgRating}`;
    starsSpan.innerHTML = `⭐ ${getStarRating(office.avgRating)} <span class="rating-value">(${office.avgRating})</span>`;
    item.appendChild(starsSpan);

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'office-tags';
    office.products.forEach(product => {
        const tag = document.createElement('span');
        tag.className = 'tag product';
        tag.textContent = product;
        tagsDiv.appendChild(tag);
    });
    office.services.forEach(service => {
        const tag = document.createElement('span');
        tag.className = 'tag service';
        tag.textContent = service;
        tagsDiv.appendChild(tag);
    });
    if (office.certified) {
        const certTag = document.createElement('span');
        certTag.className = 'tag certified';
        certTag.textContent = '✓ Сертифицирован';
        tagsDiv.appendChild(certTag);
    }
    item.appendChild(tagsDiv);

    const linksDiv = document.createElement('div');
    linksDiv.className = 'office-links';
    const routeLink = document.createElement('a');
    routeLink.href = routeUrl;
    routeLink.target = '_blank';
    routeLink.rel = 'noopener noreferrer';
    routeLink.className = 'route-link';
    routeLink.textContent = '🚗 Как проехать';
    linksDiv.appendChild(routeLink);
    const detailLink = document.createElement('a');
    detailLink.href = `partner?id=${office.id}`;
    detailLink.target = '_blank';
    detailLink.rel = 'noopener noreferrer';
    detailLink.className = 'detail-link';
    detailLink.textContent = '🔍 Подробнее';
    linksDiv.appendChild(detailLink);
    item.appendChild(linksDiv);

    item.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') return;
        if (myMap && document.querySelector('.mode-map-active')) {
            myMap.setCenter(office.coords, 16);
        }
        document.querySelectorAll('.office-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
    });
    return item;
}

function renderOfficeList(offices) {
    const listContainer = document.getElementById('office-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    if (offices.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = `<p style="font-size: 16px; margin-bottom: 10px;">По вашему запросу ничего не найдено.</p>
            <p style="margin-bottom: 20px;">Но вы можете стать нашим партнёром и представлять наши замки в своём городе!</p>
            <a href="/partnership" class="cooperation-btn">Стать партнёром</a>`;
        listContainer.appendChild(noResultsDiv);
        return;
    }
    offices.forEach(office => listContainer.appendChild(createOfficeElement(office)));
}

// === Фильтрация с debounce ===
function applyAllFilters() {
    if (!isMapReady) {
        pendingFilterUpdate = true;
        return;
    }
    const cityFilter = document.getElementById('city-search').value.trim();
    const nameFilter = document.getElementById('name-search').value.trim();

    filteredOffices = officesData.filter(office => {
        if (cityFilter && extractCity(office.address).toLowerCase() !== cityFilter.toLowerCase()) return false;
        if (nameFilter && !office.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
        if (filters.products.smart && !office.products.includes('Умные замки')) return false;
        if (filters.products.doors && !office.products.includes('Умные двери')) return false;
        if (filters.services.montazh && !office.services.includes('Монтаж')) return false;
        if (filters.services.remont && !office.services.includes('Ремонт')) return false;
        if (filters.services.obuchenie && !office.services.includes('Обучение')) return false;
        if (filters.certified && !office.certified) return false;
        return true;
    });
    filteredOffices.sort((a, b) => b.avgRating - a.avgRating);
    rebuildClusterer();
    if (filteredOffices.length) centerMapOnOffices(filteredOffices);
    renderOfficeList(filteredOffices);
}

function debouncedApplyFilters() {
    if (filterTimeout) clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => applyAllFilters(), 100);
}

// === Обновление кнопок фильтров ===
function updateFilterButtons() {
    document.getElementById('filter-product-smart')?.classList.toggle('active', filters.products.smart);
    document.getElementById('filter-product-doors')?.classList.toggle('active', filters.products.doors);
    document.getElementById('filter-service-montazh')?.classList.toggle('active', filters.services.montazh);
    document.getElementById('filter-service-remont')?.classList.toggle('active', filters.services.remont);
    document.getElementById('filter-service-obuchenie')?.classList.toggle('active', filters.services.obuchenie);
    document.getElementById('filter-certified')?.classList.toggle('active', filters.certified);
    let activeCount = Object.values(filters.products).filter(Boolean).length +
                     Object.values(filters.services).filter(Boolean).length +
                     (filters.certified ? 1 : 0);
    document.getElementById('active-filters-count').textContent = activeCount;
}

function toggleProduct(name) { filters.products[name] = !filters.products[name]; updateFilterButtons(); debouncedApplyFilters(); }
function toggleService(name) { filters.services[name] = !filters.services[name]; updateFilterButtons(); debouncedApplyFilters(); }
function toggleCertified() { filters.certified = !filters.certified; updateFilterButtons(); debouncedApplyFilters(); }

function resetAllFilters() {
    document.getElementById('city-search').value = '';
    document.getElementById('name-search').value = '';
    filters = { products: { smart: false, doors: false }, services: { montazh: false, remont: false, obuchenie: false }, certified: false };
    updateFilterButtons();
    filteredOffices = [...officesData];
    filteredOffices.sort((a, b) => b.avgRating - a.avgRating);
    if (myMap) {
        rebuildClusterer();
        if (filteredOffices.length) centerMapOnOffices(filteredOffices);
    }
    renderOfficeList(filteredOffices);
    toggleClearIcon();
}

function search() {
    const cityInput = document.getElementById('city-search').value.trim();
    if (cityInput && !cities.find(c => c.toLowerCase() === cityInput.toLowerCase())) {
        alert(`Город "${cityInput}" не найден. Доступные города: ${cities.join(', ')}`);
        return;
    }
    if (document.querySelector('.mode-list-active')) setMode('map');
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
        setTimeout(() => { if (myMap) myMap.container.fitToViewport(); }, 100);
    }
}

function toggleClearIcon() {
    const cityInput = document.getElementById('city-search');
    const clearIcon = document.getElementById('clear-city');
    if (clearIcon) clearIcon.style.display = cityInput.value.trim() !== '' ? 'block' : 'none';
}

// === Инициализация карты ===
function initMap() {
    myMap = new ymaps.Map("map", {
        center: [55.83, 49.18],
        zoom: 12,
        controls: ["zoomControl", "fullscreenControl"]
    });
    rebuildClusterer();
    isMapReady = true;
    if (pendingFilterUpdate) {
        pendingFilterUpdate = false;
        applyAllFilters();
    } else {
        renderOfficeList(filteredOffices);
        if (filteredOffices.length) centerMapOnOffices(filteredOffices);
    }
    setTimeout(() => { if (myMap && filteredOffices.length) centerMapOnOffices(filteredOffices); }, 100);
}

// === Загрузка данных и запуск ===
async function loadDataAndStart() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'block';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
        const response = await fetch('https://raw.githubusercontent.com/fackt1-oss/dircode/main/partners.json', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        let rawData = await response.json();
        if (!Array.isArray(rawData)) throw new Error('Данные не массив');
        officesData = rawData.map(partner => {
            let coords = [55.75, 37.62];
            if (Array.isArray(partner.coords) && partner.coords.length === 2 && typeof partner.coords[0] === 'number' && typeof partner.coords[1] === 'number') {
                coords = partner.coords;
            }
            return {
                id: partner.id || Math.random(),
                name: partner.name || 'Без названия',
                address: partner.address || '',
                phone: partner.phone || 'не указан',
                hours: partner.hours || 'не указано',
                coords: coords,
                products: Array.isArray(partner.products) ? partner.products : [],
                services: Array.isArray(partner.services) ? partner.services : [],
                certified: partner.certified === true,
                reviews: Array.isArray(partner.reviews) ? partner.reviews : [],
                rating: typeof partner.rating === 'number' ? partner.rating : 0,
                avgRating: computeAverageRating(partner)
            };
        });
        filteredOffices = [...officesData].sort((a, b) => b.avgRating - a.avgRating);
        cities = [...new Set(officesData.map(o => extractCity(o.address)))].sort();
        const datalist = document.getElementById('city-datalist');
        if (datalist) {
            datalist.innerHTML = '';
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                datalist.appendChild(option);
            });
        }
        ymaps.ready(initMap);
        // Привязка обработчиков (перенесено из HTML)
        document.getElementById('search-btn')?.addEventListener('click', search);
        document.getElementById('reset-btn')?.addEventListener('click', resetAllFilters);
        document.getElementById('city-search')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') search(); });
        document.getElementById('name-search')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') search(); });
        document.getElementById('mode-list')?.addEventListener('click', () => setMode('list'));
        document.getElementById('mode-map')?.addEventListener('click', () => setMode('map'));
        document.getElementById('filter-product-smart')?.addEventListener('click', () => toggleProduct('smart'));
        document.getElementById('filter-product-doors')?.addEventListener('click', () => toggleProduct('doors'));
        document.getElementById('filter-service-montazh')?.addEventListener('click', () => toggleService('montazh'));
        document.getElementById('filter-service-remont')?.addEventListener('click', () => toggleService('remont'));
        document.getElementById('filter-service-obuchenie')?.addEventListener('click', () => toggleService('obuchenie'));
        document.getElementById('filter-certified')?.addEventListener('click', toggleCertified);
        document.getElementById('city-search')?.addEventListener('input', toggleClearIcon);
        document.getElementById('clear-city')?.addEventListener('click', () => {
            const cityInput = document.getElementById('city-search');
            if (cityInput) {
                cityInput.value = '';
                toggleClearIcon();
                applyAllFilters();
                cityInput.focus();
            }
        });
        toggleClearIcon();
        setMode('map');
        updateFilterButtons();
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        const listContainer = document.getElementById('office-list');
        if (listContainer) {
            listContainer.innerHTML = `<div class="no-results"><p>Ошибка загрузки данных. Проверьте соединение или обновите страницу.</p><p>${error.message}</p></div>`;
        }
    } finally {
        loadingDiv.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', loadDataAndStart);

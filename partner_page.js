// ================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==================
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function getStarRating(rating) {
    let numRating = parseFloat(rating);
    if (isNaN(numRating)) numRating = 0;
    const full = '★';
    const empty = '☆';
    const fullCount = Math.floor(numRating);
    const emptyCount = 5 - fullCount;
    return full.repeat(fullCount) + empty.repeat(emptyCount);
}

function isValidUrl(string) {
    if (typeof string !== 'string') return false;
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
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

// Лайтбокс фото
let photoImages = [];
let currentPhotoIndex = 0;
window.openPhotoLightbox = function(images, startIndex) {
    if (!images || images.length === 0) return;
    photoImages = images;
    currentPhotoIndex = startIndex;
    document.getElementById('lightboxImage').src = images[startIndex];
    document.getElementById('photoLightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}
window.closePhotoLightbox = function() {
    document.getElementById('photoLightbox').classList.remove('active');
    document.body.style.overflow = '';
}
window.changePhotoSlide = function(direction) {
    if (!photoImages.length) return;
    currentPhotoIndex += direction;
    if (currentPhotoIndex < 0) currentPhotoIndex = photoImages.length - 1;
    if (currentPhotoIndex >= photoImages.length) currentPhotoIndex = 0;
    document.getElementById('lightboxImage').src = photoImages[currentPhotoIndex];
}

window.openMapLightbox = function(iframeSrc) {
    document.getElementById('mapLightboxIframe').src = iframeSrc;
    document.getElementById('mapLightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}
window.closeMapLightbox = function() {
    document.getElementById('mapLightbox').classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
    if (document.getElementById('photoLightbox').classList.contains('active')) {
        if (e.key === 'Escape') closePhotoLightbox();
        if (e.key === 'ArrowLeft') changePhotoSlide(-1);
        if (e.key === 'ArrowRight') changePhotoSlide(1);
    }
    if (document.getElementById('mapLightbox').classList.contains('active')) {
        if (e.key === 'Escape') closeMapLightbox();
    }
    if (document.getElementById('reviewLightbox').classList.contains('active')) {
        if (e.key === 'Escape') closeReviewLightbox();
    }
});

// Каталог
let currentPartner = null;
let currentPartnerId = null;
let currentCatalog = [];
let filteredCatalog = [];
let itemsPerPage = 3;
let currentPage = 1;
let paginatedCatalog = [];

function getProductImageUrl(item) {
    const possibleFields = ['image', 'img', 'photo', 'picture'];
    for (const field of possibleFields) {
        if (item[field] && isValidUrl(item[field])) return item[field];
    }
    return 'https://placehold.co/200x200?text=Нет+фото';
}

function renderCatalog(items, append = false) {
    const catalogList = document.getElementById('catalog-list');
    const loadMoreWrapper = document.getElementById('load-more-wrapper');
    if (!catalogList) return;
    if (!append) { catalogList.innerHTML = ''; currentPage = 1; }
    if (items.length === 0) {
        catalogList.innerHTML = '<div class="t-store__card" style="grid-column:1/-1; text-align:center; padding:20px;">Товары не найдены</div>';
        loadMoreWrapper.style.display = 'none';
        return;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = items.slice(startIndex, endIndex);
    if (pageItems.length === 0 && currentPage > 1) { currentPage = 1; return renderCatalog(items, false); }
    const newItemsHtml = pageItems.map(item => {
        const productLink = `product?partner=${currentPartnerId}&product=${item.uid}`;
        const imgSrc = getProductImageUrl(item);
        const priceDisplay = (typeof item.price === 'number' && !isNaN(item.price)) 
            ? item.price.toLocaleString('ru-RU') + ' ₽' 
            : 'Цена не указана';
        return `<div class="t-store__card"><a href="${productLink}"><div class="t-store__card__imgwrapper"><img src="${imgSrc}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.src='https://placehold.co/200x200?text=Ошибка'"></div><div class="t-store__card__wrap_txt-and-btns"><div class="t-store__card__textwrapper"><div class="t-store__card__title">${escapeHtml(item.name)}</div>${item.description ? `<div class="t-store__card__descr">${escapeHtml(item.description)}</div>` : ''}<div class="t-store__card__price-wrapper"><div class="t-store__card__price">${priceDisplay}</div></div></div></div></a></div>`;
    }).join('');
    if (append) catalogList.insertAdjacentHTML('beforeend', newItemsHtml);
    else catalogList.innerHTML = newItemsHtml;
    const allShown = endIndex >= items.length;
    loadMoreWrapper.style.display = allShown ? 'none' : 'block';
}

function filterCatalog() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const priceMin = parseFloat(document.getElementById('price-min').value) || 0;
    const priceMax = parseFloat(document.getElementById('price-max').value) || Infinity;
    const sortValue = document.getElementById('sort-select').value;
    filteredCatalog = currentCatalog.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(searchTerm);
        const descMatch = item.description ? item.description.toLowerCase().includes(searchTerm) : false;
        const priceMatch = (typeof item.price === 'number' && item.price >= priceMin && item.price <= priceMax);
        return (nameMatch || descMatch) && priceMatch;
    });
    if (sortValue === 'priceAsc') filteredCatalog.sort((a,b)=>a.price-b.price);
    else if (sortValue === 'priceDesc') filteredCatalog.sort((a,b)=>b.price-a.price);
    else if (sortValue === 'nameAsc') filteredCatalog.sort((a,b)=>a.name.localeCompare(b.name));
    else if (sortValue === 'nameDesc') filteredCatalog.sort((a,b)=>b.name.localeCompare(a.name));
    paginatedCatalog = [...filteredCatalog];
    renderCatalog(paginatedCatalog, false);
}

let currentLoadMoreHandler = null;
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;
    if (currentLoadMoreHandler) {
        loadMoreBtn.removeEventListener('click', currentLoadMoreHandler);
    }
    currentLoadMoreHandler = () => { currentPage++; renderCatalog(paginatedCatalog, true); };
    loadMoreBtn.addEventListener('click', currentLoadMoreHandler);
}

// ===== ОБРАБОТКА ФОРМЫ ОТЗЫВА =====
let reviewFormOriginal = null;

function initReviewForm() {
    const formContainer = document.getElementById('hiddenReviewFormContainer');
    if (!formContainer) {
        console.warn('Контейнер с формой отзыва не найден');
        return;
    }
    reviewFormOriginal = formContainer.querySelector('#reviewForm');
    if (!reviewFormOriginal) {
        console.warn('Форма отзыва #reviewForm не найдена');
        return;
    }
    // Удаляем оригинальную форму из DOM (она скрыта, но лучше убрать)
    reviewFormOriginal.remove();
    // Удаляем и сам контейнер, чтобы не оставалось пустого скрытого блока
    formContainer.remove();
}

window.openReviewLightbox = function() {
    if (!reviewFormOriginal) {
        alert('Форма отзыва временно недоступна');
        return;
    }
    // Клонируем форму
    const formClone = reviewFormOriginal.cloneNode(true);
    // Заполняем partner_id
    const partnerIdField = formClone.querySelector('[name="partner_id"]');
    if (partnerIdField && currentPartnerId) {
        partnerIdField.value = currentPartnerId;
    }
    // Очищаем предыдущее содержимое и вставляем клон
    const placeholder = document.getElementById('reviewFormPlaceholder');
    if (placeholder) {
        placeholder.innerHTML = '';
        placeholder.appendChild(formClone);
    }
    // Показываем лайтбокс
    const lightbox = document.getElementById('reviewLightbox');
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.closeReviewLightbox = function() {
    const lightbox = document.getElementById('reviewLightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Очищаем контейнер, чтобы при следующем открытии был свежий клон
    const placeholder = document.getElementById('reviewFormPlaceholder');
    if (placeholder) placeholder.innerHTML = '';
}

// ===== ЗАГРУЗКА ДАННЫХ ПАРТНЁРА =====
async function loadPartner() {
    const partnerId = parseInt(getQueryParam('id'), 10);
    if (!partnerId) {
        document.getElementById('partner-container').innerHTML = `<div style="padding:40px;text-align:center;"><p>Не указан ID партнёра</p><a href="partner_map" class="btn btn-primary">Вернуться к карте</a></div>`;
        return;
    }
    currentPartnerId = partnerId;
    try {
        const response = await fetch('https://raw.githubusercontent.com/fackt1-oss/dircode/main/partners.json');
        if (!response.ok) throw new Error('Ошибка загрузки');
        const partners = await response.json();
        const partner = partners.find(p => p.id === partnerId);
        if (!partner) {
            document.getElementById('partner-container').innerHTML = `<div style="padding:40px;text-align:center;"><p>Партнёр с ID ${partnerId} не найден</p><a href="partner_map" class="btn btn-primary">Вернуться к карте</a></div>`;
            return;
        }
        currentPartner = partner;

        // Обложка, лого
        const cover = document.getElementById('cover-photo');
        cover.style.backgroundImage = partner.cover && isValidUrl(partner.cover) ? `url('${partner.cover}')` : 'url("https://placehold.co/1200x250/1f2a3a/ffffff?text=Баннер")';
        const avatarDiv = document.getElementById('cover-avatar');
        if (partner.logo && isValidUrl(partner.logo)) {
            avatarDiv.style.display = 'block';
            const avatarImg = avatarDiv.querySelector('img');
            if (avatarImg) avatarImg.src = partner.logo;
        }
        const partnerNameEl = document.getElementById('partner-name');
        if (partnerNameEl) partnerNameEl.textContent = partner.name;
        if (partner.rating) {
            const ratingDiv = document.getElementById('rating-container');
            if (ratingDiv) {
                ratingDiv.style.display = 'flex';
                const starsSpan = document.getElementById('rating-stars');
                const ratingTextSpan = document.getElementById('rating-text');
                if (starsSpan) starsSpan.innerHTML = getStarRating(partner.rating);
                if (ratingTextSpan) ratingTextSpan.textContent = `${partner.rating}${partner.reviews_count ? ` (${partner.reviews_count} отзывов)` : ''}`;
            }
        }
        const partnerTypeDiv = document.getElementById('partner-type');
        if (partnerTypeDiv && partner.type) partnerTypeDiv.innerHTML = partner.type.map(t => `<span class="type-badge">${escapeHtml(t)}</span>`).join('');
        let contacts = '';
        if (partner.address) contacts += `<div class="contact-item"><i>📍</i> ${escapeHtml(partner.address)}</div>`;
        if (partner.phone) contacts += `<div class="contact-item"><i>📞</i> ${escapeHtml(partner.phone)}</div>`;
        if (partner.hours) contacts += `<div class="contact-item"><i>🕒</i> ${escapeHtml(partner.hours)}</div>`;
        if (partner.website) contacts += `<div class="contact-item"><i>🌐</i> <a href="${partner.website}" target="_blank">${escapeHtml(partner.website.replace(/^https?:\/\//, ''))}</a></div>`;
        if (partner.whatsapp) contacts += `<div class="contact-item"><i>📱</i> <a href="https://wa.me/${partner.whatsapp}" target="_blank">WhatsApp</a></div>`;
        if (partner.telegram) contacts += `<div class="contact-item"><i>📨</i> <a href="https://t.me/${partner.telegram}" target="_blank">Telegram</a></div>`;
        const contactRow = document.getElementById('contact-row');
        if (contactRow) contactRow.innerHTML = contacts;
        let btns = '';
        if (partner.phone) btns += `<a href="tel:${partner.phone.replace(/[^0-9+]/g, '')}" class="btn btn-call">📞 Позвонить</a>`;
        if (partner.coords && partner.coords.length === 2) btns += `<a href="https://yandex.ru/maps/?rtext=~${partner.coords[0]},${partner.coords[1]}" class="btn btn-outline">📍 Построить маршрут</a>`;
        const actionBtns = document.getElementById('action-buttons');
        if (actionBtns) actionBtns.innerHTML = btns;
        const partnerDesc = document.getElementById('partner-description');
        if (partnerDesc) partnerDesc.textContent = partner.description || 'Нет описания';
        const certifiedContainer = document.getElementById('certified-badge-container');
        if (certifiedContainer) certifiedContainer.innerHTML = partner.certified ? '<div class="certified-badge">✅ Сертифицированный партнёр</div>' : '';

        // Каталог
        if (partner.catalog && partner.catalog.length) {
            currentCatalog = partner.catalog.map((item, idx) => ({ ...item, uid: idx.toString() }));
            filteredCatalog = [...currentCatalog];
            paginatedCatalog = [...filteredCatalog];
            const catalogControls = document.getElementById('catalog-controls');
            if (catalogControls) catalogControls.style.display = 'flex';
            const searchInput = document.getElementById('search-input');
            const sortSelect = document.getElementById('sort-select');
            const priceMin = document.getElementById('price-min');
            const priceMax = document.getElementById('price-max');
            if (searchInput && sortSelect && priceMin && priceMax) {
                searchInput.removeEventListener('input', filterCatalog);
                sortSelect.removeEventListener('change', filterCatalog);
                priceMin.removeEventListener('input', filterCatalog);
                priceMax.removeEventListener('input', filterCatalog);
                searchInput.addEventListener('input', filterCatalog);
                sortSelect.addEventListener('change', filterCatalog);
                priceMin.addEventListener('input', filterCatalog);
                priceMax.addEventListener('input', filterCatalog);
            }
            renderCatalog(paginatedCatalog, false);
            setupLoadMore();
        } else {
            const catalogList = document.getElementById('catalog-list');
            if (catalogList) {
                if (partner.products && partner.products.length) {
                    catalogList.innerHTML = partner.products.map(p => {
                        let icon = '🔒';
                        if (p.includes('Готовые решения')) icon = '🏠';
                        else if (p.includes('Умные замки')) icon = '🔐';
                        return `<div class="t-store__card"><div class="t-store__card__imgwrapper" style="display:flex;align-items:center;justify-content:center;font-size:48px;">${icon}</div><div class="t-store__card__wrap_txt-and-btns"><div class="t-store__card__title">${escapeHtml(p)}</div><div class="t-store__card__descr">Цена по запросу</div></div></div>`;
                    }).join('');
                } else catalogList.innerHTML = '<div class="t-store__card" style="grid-column:1/-1;text-align:center;padding:20px;">Нет товаров</div>';
            }
        }

        // Обычные услуги
        const servicesList = document.getElementById('services-list');
        if (servicesList) {
            if (partner.services && partner.services.length) {
                const allServices = partner.services;
                const showLimit = 4;
                const visibleServices = allServices.slice(0, showLimit);
                const hiddenServices = allServices.slice(showLimit);
                
                let servicesHtml = `<div class="services-visible">`;
                servicesHtml += visibleServices.map(s => `<span class="service-item">${escapeHtml(s)}</span>`).join('');
                servicesHtml += `</div>`;
                
                if (hiddenServices.length > 0) {
                    servicesHtml += `<div class="services-hidden" id="services-hidden">`;
                    servicesHtml += hiddenServices.map(s => `<span class="service-item">${escapeHtml(s)}</span>`).join('');
                    servicesHtml += `</div>`;
                    servicesHtml += `<button class="detailed-service-toggle" id="services-toggle-btn">📋 Все услуги (${hiddenServices.length})</button>`;
                }
                servicesList.innerHTML = servicesHtml;
                
                const toggleBtn = document.getElementById('services-toggle-btn');
                if (toggleBtn) {
                    const hiddenDiv = document.getElementById('services-hidden');
                    toggleBtn.addEventListener('click', () => {
                        if (hiddenDiv.style.display === 'none' || hiddenDiv.style.display === '') {
                            hiddenDiv.style.display = 'flex';
                            toggleBtn.textContent = `🙈 Скрыть услуги`;
                        } else {
                            hiddenDiv.style.display = 'none';
                            toggleBtn.textContent = `📋 Все услуги (${hiddenServices.length})`;
                        }
                    });
                }
            } else {
                servicesList.innerHTML = '<span class="service-item">Нет данных</span>';
            }
        }

        // Подробные услуги (показываем только первую услугу)
        const detailedSection = document.getElementById('detailed-services-section');
        const detailedContainer = document.getElementById('detailed-services-list');
        if (detailedSection && detailedContainer) {
            if (partner.detailed_services && partner.detailed_services.length) {
                detailedSection.style.display = 'block';
                let html = '';
                partner.detailed_services.forEach((cat, catIndex) => {
                    const categoryId = `cat-${catIndex}`;
                    html += `<div class="detailed-service-category" data-category-id="${categoryId}">`;
                    html += `<div class="detailed-service-header"><h3>${escapeHtml(cat.category)}</h3><div class="detailed-service-price">💰 ${escapeHtml(cat.price)}</div></div>`;
                    if (cat.items && cat.items.length) {
                        const items = cat.items;
                        const showLimit = 1;
                        const visibleItems = items.slice(0, showLimit);
                        const hiddenItems = items.slice(showLimit);
                        html += `<ul class="detailed-service-items">`;
                        visibleItems.forEach(item => {
                            html += `<li><strong>${escapeHtml(item.name)}</strong> <span>${escapeHtml(item.price)}</span></li>`;
                        });
                        html += `</ul>`;
                        if (hiddenItems.length > 0) {
                            html += `<div class="detailed-service-hidden" id="hidden-${categoryId}"><ul class="detailed-service-items">`;
                            hiddenItems.forEach(item => {
                                html += `<li><strong>${escapeHtml(item.name)}</strong> <span>${escapeHtml(item.price)}</span></li>`;
                            });
                            html += `</ul></div>`;
                            html += `<button class="detailed-service-toggle" data-target="hidden-${categoryId}">Раскрыть все</button>`;
                        }
                    } else {
                        html += `<div class="detailed-service-empty">Конкретные услуги уточняйте у партнёра</div>`;
                    }
                    html += `</div>`;
                });
                detailedContainer.innerHTML = html;
                
                document.querySelectorAll('.detailed-service-toggle[data-target]').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        const targetId = this.getAttribute('data-target');
                        const hiddenDiv = document.getElementById(targetId);
                        if (hiddenDiv) {
                            const isHidden = hiddenDiv.classList.contains('show');
                            if (!isHidden) {
                                hiddenDiv.classList.add('show');
                                this.textContent = 'Скрыть';
                            } else {
                                hiddenDiv.classList.remove('show');
                                this.textContent = 'Раскрыть все';
                            }
                        }
                    });
                });
            } else {
                detailedSection.style.display = 'none';
            }
        }

        // Галерея
        const gallery = document.getElementById('partner-gallery');
        if (gallery) {
            gallery.innerHTML = '';
            if (partner.photos && partner.photos.length) {
                const validPhotos = partner.photos.filter(url => isValidUrl(url));
                if (validPhotos.length) {
                    validPhotos.forEach((url, idx) => {
                        const img = document.createElement('img');
                        img.src = url;
                        img.alt = partner.name;
                        img.loading = 'lazy';
                        img.addEventListener('click', () => openPhotoLightbox(validPhotos, idx));
                        gallery.appendChild(img);
                    });
                } else gallery.innerHTML = '<div class="gallery-placeholder">Нет доступных фотографий</div>';
            } else gallery.innerHTML = '<div class="gallery-placeholder">Фотографии отсутствуют</div>';
        }

        // Отзывы + кнопка "Оставить отзыв"
        const reviewsDiv = document.getElementById('reviews-list');
        if (reviewsDiv) {
            if (partner.reviews && partner.reviews.length) {
                reviewsDiv.innerHTML = partner.reviews.map(r => {
                    const date = r.date ? new Date(r.date).toLocaleDateString('ru-RU') : '';
                    return `<div class="review"><div class="review-header"><span class="review-author">${escapeHtml(r.author)}</span><span class="stars">${getStarRating(r.rating)}</span><span class="review-date">${date}</span></div><div class="review-text">${escapeHtml(r.text)}</div></div>`;
                }).join('');
            } else {
                reviewsDiv.innerHTML = '<div class="no-reviews">Пока нет отзывов</div>';
            }
            // Добавляем кнопку, если её ещё нет
            if (!reviewsDiv.querySelector('.add-review-btn')) {
                const addReviewBtn = document.createElement('button');
                addReviewBtn.className = 'btn btn-outline add-review-btn';
                addReviewBtn.textContent = '✍️ Оставить отзыв';
                addReviewBtn.style.marginTop = '16px';
                addReviewBtn.style.width = '100%';
                addReviewBtn.addEventListener('click', () => openReviewLightbox());
                reviewsDiv.appendChild(addReviewBtn);
            }
        }

        // Карта
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            if (partner.coords && partner.coords.length === 2) {
                const [lat, lon] = partner.coords;
                const iframeSrc = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=17&pt=${lon},${lat},pm2rdm&l=map`;
                mapContainer.innerHTML = `<iframe src="${iframeSrc}" allowfullscreen></iframe><div class="map-overlay">🔍 Увеличить</div>`;
                mapContainer.onclick = () => openMapLightbox(iframeSrc);
            } else mapContainer.innerHTML = '<div class="map-placeholder">Карта недоступна</div>';
        }

        const partnerIdField = document.getElementById('partner-id-field');
        if (partnerIdField) partnerIdField.value = partnerId;

    } catch (error) {
        console.error(error);
        document.getElementById('partner-container').innerHTML = `<div style="padding:40px;text-align:center;"><p>Ошибка загрузки</p><a href="partner_map" class="btn btn-primary">Вернуться к карте</a></div>`;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initReviewForm();
    loadPartner();
});

// ========== ИНТЕГРАЦИЯ С TILDA ФОРМОЙ (основная форма и форма отзыва) ==========
(function() {
    function formatPhone(value) {
        if (!value) return value;
        const digits = value.replace(/\D/g, '');
        if (digits.length === 0) return '';
        let number = digits;
        if (digits[0] === '8') number = '7' + digits.slice(1);
        else if (digits[0] !== '7') number = '7' + digits;
        const limited = number.slice(0, 11);
        const len = limited.length;
        if (len === 1) return '+7';
        if (len === 2) return `+7 (${limited[1]}`;
        if (len === 3) return `+7 (${limited.slice(1)}`;
        if (len === 4) return `+7 (${limited.slice(1)})`;
        if (len === 5) return `+7 (${limited.slice(1,4)}) ${limited[4]}`;
        if (len === 6) return `+7 (${limited.slice(1,4)}) ${limited.slice(4)}`;
        if (len === 7) return `+7 (${limited.slice(1,4)}) ${limited.slice(4)}`;
        if (len === 8) return `+7 (${limited.slice(1,4)}) ${limited.slice(4,7)}-${limited[7]}`;
        if (len === 9) return `+7 (${limited.slice(1,4)}) ${limited.slice(4,7)}-${limited.slice(7)}`;
        if (len === 10) return `+7 (${limited.slice(1,4)}) ${limited.slice(4,7)}-${limited.slice(7,9)}-${limited[9]}`;
        return `+7 (${limited.slice(1,4)}) ${limited.slice(4,7)}-${limited.slice(7,9)}-${limited.slice(9,11)}`;
    }
    const phoneInput = document.querySelector('#partnerForm [name="tildaspec-phone-part[]"]');
    if (phoneInput) phoneInput.addEventListener('input', e => { e.target.value = formatPhone(e.target.value); });

    let attempts = 0;
    const interval = setInterval(() => {
        const tildaForm = document.querySelector('form.t-form:not(#partnerForm)');
        if (tildaForm) {
            clearInterval(interval);
            function moveCaptcha() {
                const captchaDiv = tildaForm.querySelector('.t-form__captcha, .t-captcha, [data-captcha]');
                const container = document.getElementById('captcha-container');
                if (container) {
                    if (captchaDiv && container.children.length === 0) {
                        container.appendChild(captchaDiv);
                        const captchaInput = tildaForm.querySelector('[name="tildaspec-captcha"], [name="captcha"]');
                        if (captchaInput && captchaInput.parentNode !== container) container.appendChild(captchaInput);
                        container.style.display = 'block';
                    } else if (!captchaDiv) container.style.display = 'none';
                }
            }
            if (document.readyState === 'complete') moveCaptcha();
            else window.addEventListener('load', moveCaptcha);
            function copyErrors() {
                document.querySelectorAll('#partnerForm .t-input-error').forEach(el => el.classList.remove('t-input-error'));
                const customError = document.querySelector('#partnerForm .t-form__errorbox-middle');
                if (customError) { customError.style.display = 'none'; customError.innerHTML = ''; }
                const tildaFields = tildaForm.querySelectorAll('.t-input-error');
                tildaFields.forEach(field => {
                    const name = field.getAttribute('name');
                    let customField;
                    if (name === 'tildaspec-phone-part[]') customField = document.querySelector('#partnerForm [name="tildaspec-phone-part[]"]');
                    else customField = document.querySelector(`#partnerForm [name="${name}"]`);
                    if (customField) customField.classList.add('t-input-error');
                });
                const tildaError = tildaForm.querySelector('.t-form__errorbox-middle');
                if (tildaError && tildaError.style.display !== 'none' && customError) {
                    customError.innerHTML = tildaError.innerHTML;
                    customError.style.display = 'block';
                }
            }
            const customForm = document.getElementById('partnerForm');
            customForm.addEventListener('submit', e => {
                e.preventDefault();
                if (!tildaForm) {
                    alert('Форма отправки временно недоступна');
                    return;
                }
                const fields = [{ from: 'name', to: 'name' }, { from: 'massage', to: 'massage' }, { from: 'partner_id', to: 'partner_id' }];
                fields.forEach(f => {
                    const fromEl = customForm.querySelector(`[name="${f.from}"]`);
                    let toEl = tildaForm.querySelector(`[name="${f.to}"]`);
                    if (f.from === 'massage' && !toEl) toEl = tildaForm.querySelector('[name="message"]');
                    if (fromEl && toEl) { toEl.value = fromEl.value; toEl.dispatchEvent(new Event('input', {bubbles: true})); toEl.dispatchEvent(new Event('change', {bubbles: true})); }
                    else if (fromEl && !toEl && f.from === 'massage') { const newInput = document.createElement('input'); newInput.type = 'hidden'; newInput.name = 'massage'; tildaForm.appendChild(newInput); newInput.value = fromEl.value; }
                });
                const phoneCustom = customForm.querySelector('[name="tildaspec-phone-part[]"]');
                if (phoneCustom) {
                    const raw = phoneCustom.value;
                    const digits = raw.replace(/\D/g, '');
                    let clean = digits.length === 11 && digits.startsWith('7') ? '+' + digits : (digits.length === 10 ? '+7' + digits : '+7' + digits);
                    const tildaPhone = tildaForm.querySelector('[name="tildaspec-phone-part[]"]');
                    if (tildaPhone) { tildaPhone.value = raw; tildaPhone.dispatchEvent(new Event('input', {bubbles: true})); }
                    const tildaPhoneHidden = tildaForm.querySelector('[name="Phone"]');
                    if (tildaPhoneHidden) { tildaPhoneHidden.value = clean; tildaPhoneHidden.dispatchEvent(new Event('input', {bubbles: true})); }
                    const tildaSimple = tildaForm.querySelector('[name="phone"]');
                    if (tildaSimple) { tildaSimple.value = raw; tildaSimple.dispatchEvent(new Event('input', {bubbles: true})); }
                }
                const isoCustom = customForm.querySelector('[name="tildaspec-phone-part[]-iso"]');
                const tildaIso = tildaForm.querySelector('[name="tildaspec-phone-part[]-iso"]');
                if (isoCustom && tildaIso) { tildaIso.value = isoCustom.value; tildaIso.dispatchEvent(new Event('input', {bubbles: true})); }
                const captchaInput = tildaForm.querySelector('[name="tildaspec-captcha"], [name="captcha"]');
                if (captchaInput && !captchaInput.value.trim()) { alert('Пожалуйста, заполните капчу'); return; }
                const submitBtn = customForm.querySelector('button[type="submit"]');
                if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Отправка...'; }
                const tildaSubmit = tildaForm.querySelector('button[type="submit"], .t-submit');
                if (tildaSubmit) {
                    tildaSubmit.click();
                    setTimeout(() => {
                        const hasErrors = tildaForm.querySelector('.t-input-error') || (tildaForm.querySelector('.t-form__errorbox-middle') && tildaForm.querySelector('.t-form__errorbox-middle').style.display !== 'none');
                        if (hasErrors) { copyErrors(); if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Отправить сообщение'; } }
                        else { setTimeout(() => { if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Отправить сообщение'; } }, 3000); }
                    }, 1000);
                } else alert('Ошибка: кнопка отправки не найдена.');
            });
            if (!tildaForm.querySelector('[name="partner_id"]')) { const inp = document.createElement('input'); inp.type = 'hidden'; inp.name = 'partner_id'; tildaForm.appendChild(inp); }
            const partnerIdUrl = new URLSearchParams(window.location.search).get('id');
            if (partnerIdUrl) {
                const tildaPartner = tildaForm.querySelector('[name="partner_id"]');
                if (tildaPartner) tildaPartner.value = partnerIdUrl;
                const customPartner = customForm.querySelector('[name="partner_id"]');
                if (customPartner) customPartner.value = partnerIdUrl;
            }
        } else if (++attempts >= 50) { clearInterval(interval); console.warn('Форма Tilda не найдена, отправка сообщений будет недоступна'); }
    }, 100);
})();

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. БАЗОВЫЕ УТИЛИТЫ И ГОД
    // =========================================
    const yearEl = document.querySelector('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // =========================================
    // 2. БУРГЕР-МЕНЮ (МОБИЛЬНОЕ)
    // =========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.querySelector('#site-nav');

    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
        });

        // Закрываем меню при клике на любую ссылку внутри него
        siteNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                siteNav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Открыть меню');
            });
        });
    }

    // =========================================
    // 3. МОДАЛЬНОЕ ОКНО БРОНИРОВАНИЯ
    // =========================================
    const modal = document.querySelector('#modal-booking');
    const modalForm = document.querySelector('#modal-booking-form');
    let lastFocusedElement;

    if (modal) {
        const openModal = () => {
            lastFocusedElement = document.activeElement;
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden'; // Блокируем скролл фона
            // Переносим фокус на первое поле ввода
            const firstInput = modal.querySelector('input');
            if (firstInput) setTimeout(() => firstInput.focus(), 100);
        };

        const closeModal = () => {
            modal.classList.remove('is-open');
            document.body.style.overflow = ''; // Возвращаем скролл
            if (lastFocusedElement) lastFocusedElement.focus(); // Возвращаем фокус
        };

        // Открытие по кнопкам с атрибутом data-open-modal
        document.querySelectorAll('[data-open-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                // Если мы на странице тура, подставляем его название в форму
                const tourName = document.querySelector('#tour-title').textContent;
                if (tourName && document.querySelector('#page-tour').classList.contains('active')) {
                    const msgField = modal.querySelector('#modal-msg');
                    if (msgField) msgField.value = `Хочу забронировать тур: "${tourName}"`;
                }
                openModal();
            });
        });

        // Закрытие по крестику и клику на оверлей
        modal.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', closeModal);
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });

        // Отправка формы внутри модалки
        if (modalForm) {
            modalForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = modalForm.querySelector('button[type="submit"]');
                const status = document.querySelector('#modal-form-status');
                const originalText = btn.textContent;

                btn.disabled = true;
                btn.textContent = 'Отправка...';
                status.textContent = 'Отправка...';
                status.style.color = 'var(--accent-green)';
                status.style.display = 'block';

                try {
                    const response = await fetch(modalForm.action, {
                        method: 'POST',
                        body: new FormData(modalForm),
                        headers: { 'Accept': 'application/json' }
                    });

                    if (!response.ok) throw new Error('Ошибка');

                    status.textContent = 'Спасибо! Заявка отправлена.';
                    modalForm.reset();
                    setTimeout(closeModal, 2000); // Закрываем через 2 секунды
                } catch (error) {
                    status.textContent = 'Ошибка. Попробуйте еще раз.';
                    status.style.color = '#cc4b1d';
                } finally {
                    btn.disabled = false;
                    btn.textContent = originalText;
                }
            });
        }
    }

    // =========================================
    // 4. ДАННЫЕ ТУРОВ
    // =========================================
    const toursData = {
        1: {
            title: "Бурятский стрит-арт",
            price: "от 1 500 ₽",
            desc: "Откройте для себя Улан-Удэ с новой стороны! Мы прогуляемся мимо гигантских муралов, где древние национальные орнаменты встречаются с образами степных воинов. Вы увидите, как современные художники переосмысливают вековые традиции, и узнаете, какие глубокие смыслы они закладывают в каждую линию.",
            img: "img/tour-1.jpg",
            gallery: ["img/gr-1.jpg", "img/gr-2.jpg", "img/gr-3.jpg"]
        },
        2: {
            title: "Верхнеудинск купеческий",
            price: "от 1 900 ₽",
            desc: "Прогулка по историческому центру: деревянное зодчество, старинные усадьбы и арт-объекты. Мы сравним, как выглядел город 100 лет назад и как он меняется сейчас благодаря современному искусству.",
            img: "img/tour-2.jpg",
            gallery: ["img/cup-1.jpg", "img/cup-2.jpg", "img/cup-3.jpg"]
        },
        3: {
            title: "Неоновый Улан-Удэ",
            price: "от 2 200 ₽",
            desc: "Вечерняя экскурсия при свете фонарей и неоновых вывесок. Узнаем, как город выглядит после заката, где находятся самые атмосферные места и какие истории скрываются за яркими витринами.",
            img: "img/tour-3.jpg",
            gallery: ["img/night-1.jpg", "img/night-2.jpg", "img/night-3.jpg"]
        },
        4: {
            title: "Гастрономический тур",
            price: "от 2 500 ₽",
            desc: "Стрит-арт стрит-артом, а обед по расписанию. Закончим прогулку дегустацией настоящих бууз. Вы попробуете традиционные блюда бурятской кухни и узнаете, как они готовятся.",
            img: "img/tour-4.jpg",
            gallery: ["img/food-1.jpg", "img/food-2.jpg", "img/food-3.jpg"]
        }
    };

    // =========================================
    // 5. НАВИГАЦИЯ (SPA)
    // =========================================
    window.showPage = (pageId) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo(0, 0); 
        }
    };

    window.openTour = (id) => {
        const data = toursData[id];
        if (!data) return;

        document.getElementById('tour-title').textContent = data.title;
        document.getElementById('tour-price').textContent = data.price;
        document.getElementById('tour-desc').textContent = data.desc;
        
        const imgEl = document.getElementById('tour-img');
        imgEl.src = data.img;
        imgEl.alt = data.title; 

        const galleryContainer = document.getElementById('tour-gallery');
        if (galleryContainer) {
            galleryContainer.innerHTML = ''; 
            if (data.gallery && data.gallery.length > 0) {
                data.gallery.forEach((imgSrc, index) => {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = `${data.title} - фото ${index + 1}`;
                    img.className = 'gallery-img';
                    img.onclick = () => window.open(imgSrc, '_blank');
                    galleryContainer.appendChild(img);
                });
            }
        }
        showPage('tour');
    };

    // =========================================
    // 6. УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ПАНЕЛЕЙ ДОСТУПНОСТИ
    // =========================================
    const setupA11yPanel = (prefix) => {
        const toggleBtn = document.querySelector(`#a11y-toggle${prefix}`);
        const panel = document.querySelector(`#a11y-panel${prefix}`);
        const closeBtn = document.querySelector(`#a11y-close${prefix}`);

        if (!toggleBtn || !panel) return;

        const closePanel = () => {
            panel.setAttribute('hidden', '');
            toggleBtn.setAttribute('aria-expanded', 'false');
        };

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = panel.hasAttribute('hidden');
            if (isHidden) {
                panel.removeAttribute('hidden');
                toggleBtn.setAttribute('aria-expanded', 'true');
            } else {
                closePanel();
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closePanel();
            });
        }

        document.addEventListener('click', (event) => {
            if (!panel.hasAttribute('hidden')) {
                if (!panel.contains(event.target) && !toggleBtn.contains(event.target)) {
                    closePanel();
                }
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closePanel();
        });

        // Тема
        const themeBtn = document.querySelector(`#theme-toggle${prefix}`);
        if (themeBtn) {
            const themeText = themeBtn.querySelector('span');
            const isLight = document.documentElement.classList.contains('light');
            themeBtn.setAttribute('aria-pressed', String(isLight));
            if (themeText) themeText.textContent = isLight ? 'Светлая тема' : 'Темная тема';

            themeBtn.addEventListener('click', () => {
                document.documentElement.classList.toggle('light');
                const nowLight = document.documentElement.classList.contains('light');
                if (themeText) themeText.textContent = nowLight ? 'Светлая тема' : 'Темная тема';
                themeBtn.setAttribute('aria-pressed', String(nowLight));
                localStorage.setItem('theme', nowLight ? 'light' : 'dark');
            });
        }

        // Контрастность
        const contrastBtn = document.querySelector(`#contrast-toggle${prefix}`);
        if (contrastBtn) {
            const contrastText = contrastBtn.querySelector('span');
            const isContrast = document.documentElement.classList.contains('high-contrast');
            contrastBtn.setAttribute('aria-pressed', String(isContrast));
            if (contrastText && isContrast) contrastText.textContent = 'Обычные цвета';

            contrastBtn.addEventListener('click', () => {
                document.documentElement.classList.toggle('high-contrast');
                const nowContrast = document.documentElement.classList.contains('high-contrast');
                if (contrastText) contrastText.textContent = nowContrast ? 'Обычные цвета' : 'Высокая контрастность';
                contrastBtn.setAttribute('aria-pressed', String(nowContrast));
                localStorage.setItem('contrast', nowContrast ? 'high' : 'normal');
            });
        }

        // Зум
        const fontInc = document.querySelector(`#font-increase${prefix}`);
        const fontDec = document.querySelector(`#font-decrease${prefix}`);
        const fontRes = document.querySelector(`#font-reset${prefix}`);
        const bodyElement = document.querySelector('body');
        
        let currentZoom = parseInt(localStorage.getItem('siteZoom')) || 100;
        const applyZoom = (zoomLevel) => {
            currentZoom = zoomLevel;
            bodyElement.style.zoom = `${zoomLevel}%`;
            localStorage.setItem('siteZoom', zoomLevel);
        };

        if (currentZoom !== 100) applyZoom(currentZoom);
        if (fontInc) fontInc.addEventListener('click', () => { if (currentZoom < 150) applyZoom(currentZoom + 10); });
        if (fontDec) fontDec.addEventListener('click', () => { if (currentZoom > 70) applyZoom(currentZoom - 10); });
        if (fontRes) fontRes.addEventListener('click', () => applyZoom(100));

        // Озвучка текста
        const readBtn = document.querySelector(`#read-page${prefix}`);
        const readText = document.querySelector(`#read-text${prefix}`);
        const prevBtn = document.querySelector(`#speech-prev${prefix}`);
        const nextBtn = document.querySelector(`#speech-next${prefix}`);

        let textChunks = [];
        let currentChunk = 0;
        let isPlaying = false;

        const gatherTextChunks = () => {
            textChunks = [];
            const activePage = document.querySelector('.page.active');
            if (!activePage) return;
            activePage.querySelectorAll('h1, h2, h3, p').forEach(el => {
                if (el.id.includes('status')) return;
                const text = el.innerText.trim();
                if (text) textChunks.push(text);
            });
        };

        const updateUI = () => {
            if (!readBtn || !readText) return;
            if (isPlaying) {
                readText.textContent = 'Пауза';
                readBtn.setAttribute('aria-pressed', 'true');
            } else {
                readText.textContent = 'Озвучить';
                readBtn.setAttribute('aria-pressed', 'false');
            }
        };

        const speakCurrentChunk = () => {
            if (currentChunk < 0) currentChunk = 0;
            if (currentChunk >= textChunks.length) { stopSpeaking(); return; }

            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textChunks[currentChunk]);
            utterance.lang = 'ru-RU';
            utterance.rate = 1;

            const voices = window.speechSynthesis.getVoices();
            const ruVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ru'));
            if (ruVoice) utterance.voice = ruVoice;

            utterance.onend = () => {
                if (isPlaying) { currentChunk++; speakCurrentChunk(); }
            };
            utterance.onerror = () => { isPlaying = false; updateUI(); };

            window.speechSynthesis.speak(utterance);
            updateUI();
        };

        const stopSpeaking = () => {
            window.speechSynthesis.cancel();
            isPlaying = false;
            currentChunk = 0;
            updateUI();
        };

        if (readBtn && 'speechSynthesis' in window) {
            readBtn.addEventListener('click', () => {
                if (isPlaying) {
                    isPlaying = false;
                    window.speechSynthesis.cancel();
                    updateUI();
                } else {
                    isPlaying = true;
                    gatherTextChunks();
                    speakCurrentChunk();
                }
            });

            if (prevBtn) prevBtn.addEventListener('click', () => {
                if (currentChunk > 0) { currentChunk--; if (isPlaying) speakCurrentChunk(); }
            });
            if (nextBtn) nextBtn.addEventListener('click', () => {
                if (currentChunk < textChunks.length - 1) { currentChunk++; if (isPlaying) speakCurrentChunk(); }
            });
        }
    };

    setupA11yPanel('');
    setupA11yPanel('-tour');

    // =========================================
    // 7. ОТПРАВКА ОБЫЧНЫХ ФОРМ (Главная и Страница тура)
    // =========================================
    const setupForm = (formId, statusId, successMsgTemplate) => {
        const form = document.querySelector(formId);
        const statusMsg = document.querySelector(statusId);
        const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

        if (form && statusMsg && submitBtn) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                submitBtn.disabled = true;
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Отправка...';
                
                const formData = new FormData(form);
                statusMsg.classList.remove('visible');
                statusMsg.textContent = 'Отправка...';
                statusMsg.classList.add('visible');

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

                    const nameInput = form.querySelector('input[name="name"]');
                    const name = nameInput ? nameInput.value.trim() : 'друг';
                    statusMsg.textContent = successMsgTemplate.replace('{name}', name);
                    form.reset();
                } catch (error) {
                    console.error('Ошибка отправки:', error);
                    statusMsg.textContent = 'Ошибка при отправке. Проверьте интернет.';
                    statusMsg.style.color = '#cc4b1d';
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            });
        }
    };

    setupForm('#contact-form', '#form-status', 'Спасибо, {name}! Заявка отправлена.');
    setupForm('#booking-form', '#book-form-status', 'Спасибо, {name}! Заявка на тур отправлена.');

    // =========================================
    // 8. КНОПКА "НАВЕРХ"
    // =========================================
    const upBtn = document.querySelector('#to-top');
    if (upBtn) {
        window.addEventListener('scroll', () => {
            upBtn.classList.toggle('visible', window.scrollY > 400);
        });
        upBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
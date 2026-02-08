// Мобильное меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('#navMenu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Закрытие меню при скролле на мобильных
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 767 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// Плавная прокрутка с учетом фиксированной шапки
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            // Закрываем мобильное меню если открыто
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
            
            // Расчет позиции с учетом фиксированной шапки
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Фокус для доступности
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
            setTimeout(() => targetElement.removeAttribute('tabindex'), 1000);
        }
    });
});

// Обработка формы с улучшенной валидацией
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверка всех обязательных полей
        const requiredFields = bookingForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#f72585';
                field.focus();
            } else {
                field.style.borderColor = '#ddd';
            }
        });
        
        if (!isValid) {
            alert('Пожалуйста, заполните все обязательные поля (отмечены *)');
            return;
        }
        
        // Сбор данных формы
        const formData = {
            name: document.getElementById('name')?.value || '',
            contact: document.getElementById('contact')?.value || '',
            goal: document.getElementById('goal')?.value || '',
            format: document.getElementById('format')?.value || '',
            language: document.getElementById('language')?.value || '',
            message: document.getElementById('message')?.value || ''
        };
        
        // Показ сообщения об успехе
        const successMessage = document.createElement('div');
        successMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                z-index: 1001;
                max-width: 90%;
                width: 400px;
                text-align: center;
            ">
                <h3 style="color: #4361ee; margin-bottom: 15px;">Спасибо за заявку!</h3>
                <p>Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    margin-top: 20px;
                    background: #4361ee;
                    color: white;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: 600;
                ">ОК</button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 1000;
                backdrop-filter: blur(3px);
            " onclick="this.parentElement.remove()"></div>
        `;
        
        document.body.appendChild(successMessage);
        
        // Сброс формы
        bookingForm.reset();
        
        // Отправка данных на сервер (заглушка)
        console.log('Form submitted:', formData);
        // Здесь будет реальная отправка через fetch()
    });
}

// Установка текущего года в футере
const currentYearSpan = document.getElementById('currentYear');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Управление всплывающими окнами преподавателей на мобильных
document.addEventListener('DOMContentLoaded', function() {
    const teacherCards = document.querySelectorAll('.teacher-card');
    let popupOverlay = document.querySelector('.popup-overlay');
    
    if (!popupOverlay) {
        popupOverlay = document.createElement('div');
        popupOverlay.className = 'popup-overlay';
        document.body.appendChild(popupOverlay);
    }
    
    teacherCards.forEach(card => {
        const popup = card.querySelector('.teacher-popup');
        
        // Для мобильных устройств
        if (window.innerWidth <= 767) {
            card.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Закрыть все остальные попапы
                document.querySelectorAll('.teacher-popup.mobile-active').forEach(p => {
                    if (p !== popup) {
                        p.classList.remove('mobile-active');
                    }
                });
                
                // Показать/скрыть текущий попап
                const isActive = popup.classList.contains('mobile-active');
                if (!isActive) {
                    popup.classList.add('mobile-active');
                    popupOverlay.classList.add('active');
                    
                    // Блокировка скролла
                    document.body.style.overflow = 'hidden';
                } else {
                    popup.classList.remove('mobile-active');
                    popupOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            
            // Закрытие по клику на оверлей
            popupOverlay.addEventListener('click', function() {
                document.querySelectorAll('.teacher-popup.mobile-active').forEach(p => {
                    p.classList.remove('mobile-active');
                });
                popupOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
            
            // Закрытие по кнопке Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.teacher-popup.mobile-active').forEach(p => {
                        p.classList.remove('mobile-active');
                    });
                    popupOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });
    
    // Адаптация попапов при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767) {
            // На десктопе скрываем все мобильные попапы
            document.querySelectorAll('.teacher-popup.mobile-active').forEach(p => {
                p.classList.remove('mobile-active');
            });
            popupOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Закрытие всплывающих окон преподавателей на десктопе при клике вне их
document.addEventListener('click', function(e) {
    if (window.innerWidth > 767) {
        if (!e.target.closest('.teacher-card')) {
            document.querySelectorAll('.teacher-popup').forEach(popup => {
                popup.style.opacity = '0';
                popup.style.visibility = 'hidden';
                popup.style.transform = 'translateX(-50%) translateY(10px)';
            });
        }
    }
});

// Фиксированная шапка с тенью
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.webkitBackdropFilter = 'blur(10px)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        header.style.background = 'white';
        header.style.backdropFilter = 'none';
        header.style.webkitBackdropFilter = 'none';
    }
});

// Оптимизация для сенсорных устройств
if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device');
    
    // Улучшение отклика касаний
    document.querySelectorAll('.btn, .service-card, .pricing-card, .teacher-card, .language-card').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        el.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Предотвращение масштабирования при двойном тапе на iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Ленивая загрузка изображений
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Улучшение доступности для клавиатуры
document.addEventListener('keydown', function(e) {
    // Навигация по табам в модальных окнах
    if (document.querySelector('.teacher-popup.mobile-active')) {
        const focusableElements = document.querySelector('.teacher-popup.mobile-active').querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    }
});